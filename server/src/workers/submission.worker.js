import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/Redis.config.js';
import { runTestCases } from '../../sandbox/sandbox.js';
import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Worker payload shape (set by submission.controller.js):
 * {
 *   submissionId : ObjectId | null   (null for "run" type)
 *   userId       : string
 *   code         : string
 *   language     : "cpp" | "python"
 *   problemSlug  : string
 *   type         : "run" | "submit"
 *   testCases    : Array<{
 *                    id             : string,
 *                    input          : string,
 *                    expectedOutput : string | null,
 *                    isSample       : boolean,
 *                    isCustom       : boolean
 *                  }>
 *   limits       : { timeLimit: number, memoryLimit: number }
 * }
 */

const worker = new Worker(
  'code-submissions',
  async (job) => {
    const { submissionId, userId, code, language, type, testCases, limits } =
      job.data;

    // ✅ Sensible default: 2s minimum, not 10s
    limits.timeLimit = Math.max(limits.timeLimit || 0, 2000);

    logger.info(
      `[Worker] Processing job ${job.id} | type=${type} | lang=${language} | testCases=${testCases.length}`
    );

    // ── Run all test cases through the sandbox ──────────────────────────
    const { overallStatus, results } = await runTestCases(
      language,
      code,
      testCases,
      limits
    );

    // ── Build the output payload ─────────────────────────────────────────
    const output = {
      type,
      overallStatus,
      results: results.map((r) => ({
        id: r.id,
        status: r.status,
        passed: r.passed,
        stdout: r.stdout,
        stderr: r.stderr,
        expectedOutput: r.expectedOutput,
        isSample: r.isSample,
        isCustom: r.isCustom,
      })),
    };

    const runtime = null;
    const memory = null;

    // ── Notify the API server (which pushes result to the client via WS) ─
    await axios.post(
      `http://localhost:${env.PORT}/api/submissions/callback/results`,
      {
        userId,
        submissionId,
        status: overallStatus,
        output: JSON.stringify(output),
        runtime,
        memory,
      },
      {
        timeout: 10_000,
        headers: {
          'x-worker-secret': env.WORKER_SECRET,
        },
      }
    );

    logger.info(
      `[Worker] Job ${job.id} done | overall=${overallStatus} | passed=${
        results.filter((r) => r.passed).length
      }/${results.length}`
    );
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on('failed', (job, err) => {
  logger.error({ err }, `[Worker] Job ${job?.id} failed`);
});

worker.on('completed', (job) => {
  logger.info(`[Worker] Job ${job.id} completed`);
});

export default worker;

// ── Queue ────────────────────────────────────────────────────────────────────

export const submissionQueue = new Queue('code-submissions', {
  connection: redisConnection,
});

export const addSubmissionToQueue = async (data) => {
  try {
    const job = await submissionQueue.add('execute-code', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: 100,
      removeOnFail: 1000,
    });
    logger.info(`[Queue] Job added: ${job.id}`);
    return job;
  } catch (error) {
    logger.error({ error }, '[Queue] Error adding to queue');
    throw error;
  }
};