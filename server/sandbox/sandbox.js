import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const docker = new Docker();

const normalizeLanguage = (language) => {
  const map = {
    cpp: 'cpp',
    'c++': 'cpp',
    python: 'python',
    py: 'python',
    javascript: 'javascript',
    js: 'javascript',
    java: 'java',
  };

  return map[String(language || '').toLowerCase()] || null;
};

export const runInSandbox = async (language, code, input = '', limits = {}) => {
  const normalizedLanguage = normalizeLanguage(language);
  if (!normalizedLanguage) {
    return {
      status: 'Internal Error',
      stdout: '',
      stderr: `Unsupported language: ${language}`,
    };
  }

  const executionId = uuidv4();
  const tempDir = path.resolve(`./temp/${executionId}`);

  fs.mkdirSync(tempDir, { recursive: true });

  const fileMap = {
    cpp: 'solution.cpp',
    python: 'solution.py',
    javascript: 'solution.js',
    java: 'Main.java',
  };

  const codeFile = fileMap[normalizedLanguage];
  fs.writeFileSync(path.join(tempDir, codeFile), code);

  // Preserve input exactly as authored in the test case payload.
  const normalizedInput = input.endsWith('\n') ? input : `${input}\n`;
  fs.writeFileSync(path.join(tempDir, 'input.txt'), normalizedInput);

  const toDockerPath = (p) => {
    if (process.platform !== 'win32') return p;
    return (
      '/' +
      p.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => d.toLowerCase())
    );
  };

  const dockerTempDir = toDockerPath(tempDir);
  const imageName = `${normalizedLanguage}-sandbox`;

  const timeLimitSec = Math.ceil((limits.timeLimit ?? 2000) / 1000);
  const wallClockMs = (timeLimitSec + 5) * 1000;

  let container = null;

  try {
    container = await docker.createContainer({
      Image: imageName,
      Cmd: getExecutionCommand(normalizedLanguage, timeLimitSec),
      WorkingDir: '/home/sandboxuser',
      Tty: false,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        Memory: (limits.memoryLimit ?? 256) * 1024 * 1024,
        MemorySwap: (limits.memoryLimit ?? 256) * 1024 * 1024,
        NanoCpus: 500_000_000,
        PidsLimit: 128,
        ReadonlyRootfs: true,
        SecurityOpt: ['no-new-privileges:true'],
        NetworkMode: 'none',
        Binds: [`${dockerTempDir}:/home/sandboxuser`],
      },
    });

    await container.start();

    let isTimedOut = false;
    const timer = setTimeout(async () => {
      isTimedOut = true;
      try {
        await container.kill();
      } catch (_) {}
    }, wallClockMs);

    // Wait for container to finish
    const waitResult = await container.wait();
    clearTimeout(timer);

    // ✅ Get logs AFTER container finishes — guaranteed to be a Buffer now
    const rawLogs = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });

    let stdout = '';
    let stderr = '';

    // ✅ Ensure we always work with a Buffer regardless of dockerode version
    const logBuffer = Buffer.isBuffer(rawLogs) ? rawLogs : Buffer.from(rawLogs);

    let offset = 0;
    while (offset + 8 <= logBuffer.length) {
      const type = logBuffer[offset];
      const size = logBuffer.readUInt32BE(offset + 4);
      offset += 8;
      const chunk = logBuffer.slice(offset, offset + size).toString('utf8');
      if (type === 1) stdout += chunk;
      else stderr += chunk;
      offset += size;
    }

    let status = 'Accepted';
    if (isTimedOut || waitResult.StatusCode === 124) status = 'TLE';
    else if (waitResult.StatusCode !== 0) status = 'Runtime Error';

    return { status, stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (err) {
    console.error('[Sandbox] Error:', err.message);
    return { status: 'Internal Error', stdout: '', stderr: err.message };
  } finally {
    if (container) {
      try {
        await container.remove({ force: true });
      } catch (_) {
        // ignore container cleanup errors
      }
    }

    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
};;;

export const runTestCases = async (language, code, testCases, limits = {}) => {
  const results = [];
  let overallStatus = 'Accepted';

  const normalise = (s = '') =>
    s
      .trim()
      .replace(/\r/g, '')
      .split('\n')
      .map((l) => l.trimEnd())
      .join('\n');

  for (const tc of testCases) {
    const { status, stdout, stderr } = await runInSandbox(
      language,
      code,
      tc.input,
      limits
    );

    let passed = false;
    let tcStatus = status;

    if (status === 'Accepted') {
      if (tc.isCustom || tc.expectedOutput === null) {
        passed = true;
        tcStatus = 'Executed';
      } else {
        const normalisedOutput = normalise(stdout);
        const normalisedExpected = normalise(tc.expectedOutput);
        passed = normalisedOutput === normalisedExpected;
        tcStatus = passed ? 'Accepted' : 'Wrong Answer';
      }
    }

    results.push({
      id: tc.id,
      status: tcStatus,
      stdout,
      stderr,
      expectedOutput: tc.expectedOutput ?? null,
      passed,
      isSample: tc.isSample,
      isCustom: tc.isCustom ?? false,
    });

    if (!passed && tcStatus !== 'Executed' && overallStatus === 'Accepted') {
      overallStatus = tcStatus;
    }
  }

  const allPassed = results.every((r) => r.passed);
  if (!allPassed && overallStatus === 'Accepted') overallStatus = 'Wrong Answer';

  return { overallStatus, results };
};

function getExecutionCommand(lang, timeLimitSec = 2) {
  if (lang === 'python') {
    return [
      'sh',
      '-c',
      `timeout ${timeLimitSec}s python3 solution.py < input.txt`,
    ];
  }
  if (lang === 'cpp') {
    return [
      'sh',
      '-c',
      `g++ -std=c++17 -O2 solution.cpp -o solution && timeout ${timeLimitSec}s ./solution < input.txt`,
    ];
  }
  if (lang === 'javascript') {
    return [
      'sh',
      '-c',
      `timeout ${timeLimitSec}s node solution.js < input.txt`,
    ];
  }
  if (lang === 'java') {
    return [
      'sh',
      '-c',
      `javac Main.java && timeout ${timeLimitSec}s java Main < input.txt`,
    ];
  }
  return [];
}