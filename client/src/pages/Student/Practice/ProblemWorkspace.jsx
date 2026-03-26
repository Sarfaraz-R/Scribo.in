import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import Sidebar from '../../../components/common/Sidebar';
import { getProblemBySlug } from '../../../api/problem.api';
import {
  getProblemSubmissions,
  getSubmissionById,
} from '../../../api/submission.api';
import {
  ChevronDown,
  RotateCcw,
  Copy,
  Check,
  Play,
  Send,
  Terminal,
  FileCode,
  Info,
  Lightbulb,
  History,
  ChevronRight,
  Tag as TagIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  Cpu,
  TriangleAlert,
  Clock,
  Zap,
} from 'lucide-react';
import api from '../../../api/api';
import { getSocket } from '../../../socket/socket';

// ─── Constants ────────────────────────────────────────────────────────────────
const BOILERPLATE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    
    return 0;
}`,

  python: `# Write your solution here

def main():
    pass

if __name__ == "__main__":
    main()`,

  java: `import java.util.*;

public class Main {

    public static void main(String[] args) {

        
    }

}`,

  javascript: `function main() {

    
}

main();`,
};
const LANGUAGES = {
  cpp: { label: 'C++ 17', ext: 'cpp', monaco: 'cpp' },
  python: { label: 'Python 3', ext: 'py', monaco: 'python' },
  java: { label: 'Java 21', ext: 'java', monaco: 'java' },
  javascript: { label: 'JavaScript', ext: 'js', monaco: 'javascript' },
};

const DIFF = {
  EASY: {
    label: 'Easy',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
  },
  MEDIUM: {
    label: 'Medium',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
  },
  HARD: {
    label: 'Hard',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
  },
};

const VERDICT_META = {
  Accepted: {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.15)',
    icon: 'ok',
  },
  'Wrong Answer': {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.15)',
    icon: 'err',
  },
  'Runtime Error': {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.15)',
    icon: 'err',
  },
  TLE: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.15)',
    icon: 'tle',
  },
  'Internal Error': {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.06)',
    border: 'rgba(167,139,250,0.15)',
    icon: 'warn',
  },
};

const SUBMISSION_STATUS_META = {
  Accepted: { color: '#4ade80' },
  'Wrong Answer': { color: '#f87171' },
  'Runtime Error': { color: '#f87171' },
  TLE: { color: '#fbbf24' },
  Pending: { color: '#a1a1aa' },
  'Internal Error': { color: '#a78bfa' },
};

function formatRelativeTime(value) {
  if (!value) return '—';
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return '—';

  const diff = Math.max(0, Date.now() - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;

  return new Date(ts).toLocaleDateString();
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0c0c0d;
    --surface:   #111114;
    --surface2:  #17171a;
    --border:    #222226;
    --border2:   #2a2a2e;
    --text:      #f0f0f2;
    --text2:     #a0a0a8;
    --text3:     #5a5a64;
    --text4:     #3a3a42;
    --accent:    #f97316;
    --accent-dim:#7c3912;
    --mono:      'JetBrains Mono', monospace;
    --sans:      'DM Sans', sans-serif;
  }

  html, body, #root { height: 100%; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: #404048; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    from { background-position: -600px 0; }
    to   { background-position:  600px 0; }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.96) translateY(4px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  .fade-up   { animation: fadeUp 0.2s ease forwards; }
  .pop-in    { animation: popIn 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards; }
  .spin-anim { animation: spin 0.7s linear infinite; }

  .skeleton {
    background: linear-gradient(90deg,
      rgba(255,255,255,0.03) 25%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.03) 75%
    );
    background-size: 600px 100%;
    animation: shimmer 1.5s ease infinite;
    border-radius: 4px;
  }

  select option { background: #111114; color: #f0f0f2; }

  /* Tab underline button reset */
  .tab-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 0 14px; height: 100%;
    font-size: 12.5px; font-weight: 500;
    font-family: var(--sans);
    background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--text3); cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .tab-btn:hover { color: var(--text2); }
  .tab-btn.active { color: var(--text); border-bottom-color: var(--accent); }
  .tab-btn:disabled { cursor: default; pointer-events: none; }

  /* Console pill tabs */
  .pill-tab {
    padding: 4px 12px; border-radius: 6px; font-size: 12px;
    font-weight: 500; font-family: var(--sans);
    background: transparent; border: none;
    color: var(--text3); cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .pill-tab:hover { background: rgba(255,255,255,0.04); color: var(--text2); }
  .pill-tab.active { background: var(--border2); color: var(--text); }

  /* Case selector button */
  .case-btn {
    padding: 4px 12px; border-radius: 6px; font-size: 12px;
    font-weight: 500; font-family: var(--sans);
    border: 1px solid var(--border); background: transparent;
    color: var(--text3); cursor: pointer;
    transition: all 0.15s;
  }
  .case-btn:hover { border-color: var(--border2); color: var(--text2); }
  .case-btn.active { background: var(--border2); border-color: var(--border2); color: var(--text); }

  /* Test result row */
  .result-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 14px; border-radius: 7px;
    font-size: 12.5px; font-family: var(--mono);
    border: 1px solid var(--border);
    background: var(--surface2);
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
    margin-bottom: 5px;
  }
  .result-row:hover { background: rgba(255,255,255,0.025); }
  .result-row.pass  { border-color: rgba(74,222,128,0.2); }
  .result-row.fail  { border-color: rgba(248,113,113,0.2); }

  /* Icon button */
  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    padding: 6px; border-radius: 7px;
    background: none; border: none;
    color: var(--text3); cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.05); color: var(--text2); }

  /* Resizer */
  .h-resizer { width: 3px; background: var(--surface2); cursor: col-resize; transition: background 0.15s; }
  .v-resizer { height: 3px; background: var(--surface2); cursor: row-resize; transition: background 0.15s; }
  .h-resizer:hover, .v-resizer:hover { background: rgba(249,115,22,0.35); }

  /* Scrollable prose */
  .prose-area { color: var(--text2); font-size: 13.5px; line-height: 1.8; font-family: var(--sans); }
  .code-inline {
    font-family: var(--mono); font-size: 12px;
    background: rgba(255,255,255,0.07); padding: 1px 6px;
    border-radius: 4px; color: var(--text);
  }
`;

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function Sk({ w = '100%', h = 12, mt = 0, r = 4 }) {
  return (
    <div
      className="skeleton"
      style={{
        width: w,
        height: h,
        marginTop: mt,
        borderRadius: r,
        flexShrink: 0,
      }}
    />
  );
}

function Spinner({ color = 'var(--accent)', size = 14 }) {
  return (
    <svg
      className="spin-anim"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke={color}
        strokeOpacity="0.2"
      />
      <path d="M12 2v4" stroke={color} />
    </svg>
  );
}

function CopyBtn({ text, size = 13 }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="icon-btn"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
    >
      {ok ? <Check size={size} color="#4ade80" /> : <Copy size={size} />}
    </button>
  );
}

function Badge({ diff }) {
  const d = DIFF[diff] ?? DIFF.EASY;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 9px',
        borderRadius: 999,
        color: d.color,
        background: d.bg,
        border: `1px solid ${d.border}`,
        fontFamily: 'var(--sans)',
        flexShrink: 0,
      }}
    >
      {d.label}
    </span>
  );
}

// ─── Skeleton / Error ─────────────────────────────────────────────────────────
function ProblemSkeleton() {
  return (
    <div
      style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <Sk w="55%" h={19} />
      <Sk w="15%" h={9} mt={2} />
      <div
        style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}
      />
      <Sk />
      <Sk w="88%" />
      <Sk w="70%" />
      <div
        style={{ height: 1, background: 'var(--border)', margin: '6px 0' }}
      />
      <Sk w="30%" h={11} />
      <Sk h={9} />
      <Sk w="82%" h={9} />
      <Sk w="64%" h={9} />
      <div
        style={{ height: 1, background: 'var(--border)', margin: '6px 0' }}
      />
      <Sk w="25%" h={11} />
      <Sk h={60} mt={4} r={8} />
      <Sk h={60} mt={6} r={8} />
    </div>
  );
}

function ProblemError({ message, onRetry }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: 32,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertCircle size={18} color="#f87171" />
      </div>
      <p
        style={{
          fontSize: 13,
          color: 'var(--text3)',
          lineHeight: 1.6,
          maxWidth: 200,
        }}
      >
        {message || 'Failed to load problem.'}
      </p>
      <button
        onClick={onRetry}
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--accent)',
          background: 'none',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 7,
          padding: '6px 18px',
          cursor: 'pointer',
          fontFamily: 'var(--sans)',
          transition: 'background 0.15s',
        }}
      >
        Retry
      </button>
    </div>
  );
}

// ─── Verdict Panel ────────────────────────────────────────────────────────────
function VerdictIcon({ meta }) {
  const s = { color: meta.color, flexShrink: 0 };
  if (meta.icon === 'ok') return <CheckCircle2 size={16} style={s} />;
  if (meta.icon === 'tle') return <Timer size={16} style={s} />;
  if (meta.icon === 'warn') return <TriangleAlert size={16} style={s} />;
  return <XCircle size={16} style={s} />;
}

// ─── Per-test result list (for run/submit) ────────────────────────────────────
function TestResultList({ results }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div
      style={{
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {results.map((r, i) => {
        const pass = r.passed;
        const isExp = expanded === i;
        const label = r.isCustom
          ? 'Custom'
          : r.isSample
            ? `Sample ${i + 1}`
            : `Test ${i + 1}`;
        const statusColor = pass
          ? '#4ade80'
          : r.status === 'TLE'
            ? '#fbbf24'
            : r.status === 'Executed'
              ? '#a78bfa'
              : '#f87171';

        return (
          <div key={i}>
            <div
              className={`result-row ${pass ? 'pass' : r.status === 'Executed' ? '' : 'fail'}`}
              onClick={() => setExpanded(isExp ? null : i)}
            >
              {/* dot */}
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: statusColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  color: 'var(--text2)',
                  fontFamily: 'var(--sans)',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: statusColor,
                  fontWeight: 600,
                  fontFamily: 'var(--sans)',
                }}
              >
                {r.status === 'Executed' ? 'OK' : r.status}
              </span>
              <ChevronDown
                size={12}
                style={{
                  color: 'var(--text4)',
                  transform: isExp ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s',
                }}
              />
            </div>

            {isExp && (
              <div
                className="fade-up"
                style={{
                  marginBottom: 6,
                  padding: '10px 14px',
                  borderRadius: 7,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  fontFamily: 'var(--mono)',
                }}
              >
                {r.stdout && (
                  <div
                    style={{
                      marginBottom: r.expectedOutput && !r.isCustom ? 10 : 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--text4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 5,
                      }}
                    >
                      Your Output
                    </p>
                    <pre
                      style={{
                        color: 'var(--text2)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}
                    >
                      {r.stdout}
                    </pre>
                  </div>
                )}
                {r.expectedOutput && !r.isCustom && (
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--text4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 5,
                      }}
                    >
                      Expected
                    </p>
                    <pre
                      style={{
                        color: '#4ade80',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}
                    >
                      {r.expectedOutput}
                    </pre>
                  </div>
                )}
                {r.stderr && (
                  <div style={{ marginTop: 8 }}>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'rgba(248,113,113,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 5,
                      }}
                    >
                      Stderr
                    </p>
                    <pre
                      style={{
                        color: '#f87171',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}
                    >
                      {r.stderr}
                    </pre>
                  </div>
                )}
                {!r.stdout && !r.stderr && (
                  <p style={{ color: 'var(--text4)', fontStyle: 'italic' }}>
                    No output.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VerdictPanel({ verdict }) {
  const meta = VERDICT_META[verdict.status] ?? {
    color: '#71717a',
    bg: 'rgba(113,113,122,0.06)',
    border: 'rgba(113,113,122,0.15)',
    icon: 'err',
  };

  // Parse structured output from worker
  let parsedOutput = null;
  try {
    if (verdict.output) parsedOutput = JSON.parse(verdict.output);
  } catch (_) {}

  const hasResults = parsedOutput?.results?.length > 0;

  return (
    <div
      className="pop-in"
      style={{
        margin: 10,
        borderRadius: 10,
        border: `1px solid ${meta.border}`,
        background: meta.bg,
        overflow: 'hidden',
      }}
    >
      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: hasResults ? `1px solid ${meta.border}` : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <VerdictIcon meta={meta} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: meta.color,
              fontFamily: 'var(--sans)',
            }}
          >
            {verdict.status}
          </span>
          {hasResults && (
            <span
              style={{
                fontSize: 12,
                color: 'var(--text3)',
                fontFamily: 'var(--sans)',
              }}
            >
              {parsedOutput.results.filter((r) => r.passed).length}/
              {parsedOutput.results.length} passed
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {verdict.runtime && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: 'var(--text3)',
                fontFamily: 'var(--mono)',
              }}
            >
              <Timer size={10} />
              {verdict.runtime}
            </span>
          )}
          {verdict.memory && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: 'var(--text3)',
                fontFamily: 'var(--mono)',
              }}
            >
              <Cpu size={10} />
              {verdict.memory}
            </span>
          )}
        </div>
      </div>

      {/* Per-test results */}
      {hasResults && <TestResultList results={parsedOutput.results} />}

      {/* Fallback: plain text output */}
      {!hasResults && verdict.output && (
        <div style={{ padding: '10px 14px' }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text4)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 6,
            }}
          >
            Output
          </p>
          <pre
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color:
                verdict.status === 'Accepted' ? 'var(--text2)' : meta.color,
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 120,
              overflowY: 'auto',
            }}
          >
            {verdict.output}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Description Tab ──────────────────────────────────────────────────────────
function Prose({ src }) {
  if (!src) return null;
  const html = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>')
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="color:var(--text);font-weight:600">$1</strong>'
    )
    .replace(/\n\n/g, '</p><p style="margin-top:14px">')
    .replace(/\n/g, '<br/>');
  return (
    <p className="prose-area" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function MonoBlock({ label, value }) {
  return (
    <div>
      <p
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          color: 'var(--text4)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: 6,
          fontFamily: 'var(--sans)',
        }}
      >
        {label}
      </p>
      <pre
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12.5,
          color: 'var(--text2)',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '10px 14px',
          margin: 0,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.65,
        }}
      >
        {value}
      </pre>
    </div>
  );
}

function DescriptionTab({ problem }) {
  const [showTopics, setShowTopics] = useState(false);
  const constraints = (problem?.constraints ?? []).map((c) =>
    typeof c === 'string' ? c : (c?.description ?? '')
  );

  return (
    <div
      className="flex-1 overflow-y-auto fade-up"
      style={{ fontFamily: 'var(--sans)' }}
    >
      {/* Title block */}
      <div
        style={{
          padding: '22px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <h1
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.2px',
              lineHeight: 1.35,
              flex: 1,
            }}
          >
            {problem?.title}
          </h1>
          <Badge diff={problem?.difficulty} />
        </div>
        {/* Topics toggle */}
        <button
          onClick={() => setShowTopics((p) => !p)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--text4)',
            fontSize: 11.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--sans)',
            transition: 'color 0.15s',
          }}
          className="hover:text-zinc-500"
        >
          <TagIcon size={11} />
          <span>{showTopics ? 'Hide' : 'Show'} topics</span>
          <ChevronDown
            size={10}
            style={{
              transform: showTopics ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
              marginLeft: 1,
            }}
          />
        </button>
        {showTopics && (
          <div
            className="fade-up"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}
          >
            {(problem?.tags ?? []).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '2px 9px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text3)',
                  border: '1px solid var(--border2)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        <Prose src={problem?.description} />
      </div>

      {(problem?.inputFormat || problem?.outputFormat) && (
        <div
          style={{
            padding: '18px 20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {problem?.inputFormat && (
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 5,
                }}
              >
                Input
              </p>
              <p
                style={{
                  color: 'var(--text2)',
                  fontSize: 13.5,
                  lineHeight: 1.75,
                }}
              >
                {problem.inputFormat.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          )}
          {problem?.outputFormat && (
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 5,
                }}
              >
                Output
              </p>
              <p
                style={{
                  color: 'var(--text2)',
                  fontSize: 13.5,
                  lineHeight: 1.75,
                }}
              >
                {problem.outputFormat.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}

      {constraints.length > 0 && (
        <div style={{ padding: '18px 20px 0' }}>
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: 'var(--text4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
              fontFamily: 'var(--sans)',
            }}
          >
            Constraints
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {constraints.map((c, i) => (
              <li
                key={i}
                style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}
              >
                <span
                  style={{
                    color: 'var(--border2)',
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  ▸
                </span>
                <code
                  style={{
                    fontSize: 13,
                    color: 'var(--text2)',
                    fontFamily: 'var(--mono)',
                    lineHeight: 1.65,
                  }}
                >
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(problem?.examples ?? []).length > 0 && (
        <div style={{ padding: '18px 20px 24px' }}>
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: 'var(--text4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14,
              fontFamily: 'var(--sans)',
            }}
          >
            Examples
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {problem.examples.map((ex, i) => (
              <div key={i}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text3)',
                    marginBottom: 10,
                    fontFamily: 'var(--sans)',
                  }}
                >
                  Example {i + 1}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                  }}
                >
                  <MonoBlock label="Input" value={ex.input} />
                  <MonoBlock label="Output" value={ex.output} />
                </div>
                {ex.explanation && (
                  <p
                    style={{
                      fontSize: 12.5,
                      color: 'var(--text3)',
                      fontFamily: 'var(--sans)',
                      lineHeight: 1.65,
                      marginTop: 8,
                    }}
                  >
                    <span style={{ color: 'var(--text4)', fontWeight: 600 }}>
                      Explanation:{' '}
                    </span>
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hints Tab ────────────────────────────────────────────────────────────────
function HintsTab({ hints = [] }) {
  const [open, setOpen] = useState([]);
  return (
    <div
      className="flex-1 overflow-y-auto fade-up"
      style={{
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: 'var(--text4)',
          marginBottom: 6,
          fontFamily: 'var(--sans)',
        }}
      >
        Reveal hints one at a time.
      </p>
      {!hints.length && (
        <p
          style={{
            fontSize: 13,
            color: 'var(--text3)',
            fontFamily: 'var(--sans)',
          }}
        >
          No hints available.
        </p>
      )}
      {hints.map((hint, i) => {
        const isOpen = open.includes(i);
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${isOpen ? 'var(--border2)' : 'var(--border)'}`,
              borderRadius: 9,
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
          >
            <button
              onClick={() =>
                setOpen((p) => (isOpen ? p.filter((h) => h !== i) : [...p, i]))
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 15px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              className="hover:bg-white/[0.02] transition-colors"
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: isOpen ? 'var(--text)' : 'var(--text3)',
                  fontFamily: 'var(--sans)',
                }}
              >
                Hint {i + 1}
              </span>
              <ChevronDown
                size={13}
                style={{
                  color: 'var(--text4)',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            {isOpen && (
              <div
                className="fade-up"
                style={{
                  padding: '0 15px 13px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <p
                  style={{
                    fontSize: 13.5,
                    color: 'var(--text2)',
                    lineHeight: 1.75,
                    paddingTop: 11,
                    fontFamily: 'var(--sans)',
                  }}
                >
                  {hint}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Submissions Tab ──────────────────────────────────────────────────────────
function SubmissionsTab({
  submissions = [],
  isLoading,
  error,
  onRetry,
  onSelectSubmission,
}) {
  if (isLoading) {
    return (
      <div
        className="flex-1 fade-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text3)',
          gap: 8,
        }}
      >
        <Spinner size={14} color="var(--accent)" />
        <p style={{ fontSize: 13, fontFamily: 'var(--sans)' }}>
          Loading submissions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex-1 fade-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: 'var(--text3)',
          padding: 20,
          textAlign: 'center',
        }}
      >
        <TriangleAlert size={20} color="#f87171" />
        <p style={{ fontSize: 13, maxWidth: 300 }}>{error}</p>
        <button
          onClick={onRetry}
          className="icon-btn"
          style={{
            border: '1px solid var(--border2)',
            padding: '6px 10px',
            borderRadius: 7,
            fontSize: 12,
            color: 'var(--text2)',
            fontFamily: 'var(--sans)',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div
        className="flex-1 fade-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: 'var(--text4)',
        }}
      >
        <Clock size={22} />
        <p style={{ fontSize: 13, fontFamily: 'var(--sans)' }}>
          No submissions yet
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto fade-up">
      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Status', 'Language', 'Runtime', 'Memory', 'Submitted'].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: 'var(--text4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr
              key={s._id ?? i}
              onClick={() => onSelectSubmission?.(s._id)}
              style={{
                borderBottom:
                  i < submissions.length - 1
                    ? '1px solid var(--border)'
                    : 'none',
              }}
              className="hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <td style={{ padding: '11px 16px' }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: 'var(--sans)',
                    color:
                      SUBMISSION_STATUS_META[s.status]?.color ?? '#a1a1aa',
                  }}
                >
                  {s.status}
                </span>
              </td>
              <td
                style={{
                  padding: '11px 16px',
                  color: 'var(--text3)',
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                }}
              >
                {s.language}
              </td>
              <td
                style={{
                  padding: '11px 16px',
                  color: 'var(--text3)',
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                }}
              >
                {s.runtime ?? '—'}
              </td>
              <td
                style={{
                  padding: '11px 16px',
                  color: 'var(--text3)',
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                }}
              >
                {s.memory ?? '—'}
              </td>
              <td
                style={{
                  padding: '11px 16px',
                  color: 'var(--text4)',
                  fontSize: 12,
                  fontFamily: 'var(--sans)',
                }}
              >
                {formatRelativeTime(s.date ?? s.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionDetailsModal({
  isOpen,
  isLoading,
  error,
  submission,
  onClose,
  onLoadInEditor,
}) {
  if (!isOpen) return null;

  const monacoLang = LANGUAGES[submission?.language]?.monaco ?? 'cpp';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(980px, 100%)',
          maxHeight: '90vh',
          overflow: 'hidden',
          borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: 48,
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <History size={14} style={{ color: 'var(--text3)' }} />
            <span
              style={{
                fontSize: 13,
                color: 'var(--text)',
                fontWeight: 600,
                fontFamily: 'var(--sans)',
              }}
            >
              Submission Details
            </span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <XCircle size={14} />
          </button>
        </div>

        {isLoading ? (
          <div
            style={{
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text3)',
              gap: 8,
            }}
          >
            <Spinner size={14} color="var(--accent)" />
            Loading submission...
          </div>
        ) : error ? (
          <div
            style={{
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              padding: 20,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        ) : submission ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 10,
                padding: 14,
                borderBottom: '1px solid var(--border)',
              }}
            >
              {[
                ['Status', submission.status],
                ['Language', submission.language],
                ['Runtime', submission.runtime ?? '—'],
                ['Memory', submission.memory ?? '—'],
                ['Submitted', formatRelativeTime(submission.createdAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '9px 10px',
                    background: 'var(--surface2)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text4)',
                      marginBottom: 5,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: label === 'Status' ? (SUBMISSION_STATUS_META[value]?.color ?? '#a1a1aa') : 'var(--text2)',
                      fontFamily: label === 'Language' ? 'var(--mono)' : 'var(--sans)',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ height: 320, borderBottom: '1px solid var(--border)' }}>
              <Editor
                height="100%"
                theme="vs-dark"
                language={monacoLang}
                value={submission.code ?? ''}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>

            <div
              style={{
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 14px',
              }}
            >
              <button
                onClick={() => onLoadInEditor(submission)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#0c0c0d',
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                <FileCode size={13} />
                Load in Editor
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ─── Console Panel ────────────────────────────────────────────────────────────
function ConsolePanel({
  examples = [],
  isRunning,
  isSubmitting,
  customInput,
  setCustomInput,
  verdict,
}) {
  const [tab, setTab] = useState('testcases');
  const [activeCase, setActiveCase] = useState(0);
  const isLoading = isRunning || isSubmitting;

  useEffect(() => {
    if (isLoading || verdict) setTab('output');
  }, [isLoading, verdict]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--surface)',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          height: 40,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          gap: 2,
          flexShrink: 0,
        }}
      >
        {[
          { id: 'testcases', label: 'Test Cases' },
          { id: 'output', label: 'Output' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pill-tab${tab === t.id ? ' active' : ''}`}
            style={{ position: 'relative' }}
          >
            {t.label}
            {t.id === 'output' && verdict && tab !== 'output' && (
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background:
                    VERDICT_META[verdict.status]?.color ?? 'var(--accent)',
                }}
              />
            )}
          </button>
        ))}
        {isLoading && (
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <Spinner size={12} />
            <span
              style={{
                fontSize: 11,
                color: 'var(--accent)',
                fontWeight: 500,
                fontFamily: 'var(--sans)',
              }}
            >
              {isRunning ? 'Running…' : 'Judging…'}
            </span>
          </div>
        )}
      </div>

      {/* Test Cases */}
      {tab === 'testcases' && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {examples.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCase(i)}
                className={`case-btn${activeCase === i ? ' active' : ''}`}
              >
                Case {i + 1}
              </button>
            ))}
            <button
              onClick={() => setActiveCase(examples.length)}
              className={`case-btn${activeCase === examples.length ? ' active' : ''}`}
            >
              Custom
            </button>
          </div>

          {activeCase < examples.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MonoBlock label="Input" value={examples[activeCase].input} />
              <MonoBlock
                label="Expected Output"
                value={examples[activeCase].output}
              />
            </div>
          ) : (
            <div>
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--text4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                  fontFamily: 'var(--sans)',
                }}
              >
                Custom Input
              </p>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter stdin…"
                rows={6}
                style={{
                  width: '100%',
                  fontFamily: 'var(--mono)',
                  fontSize: 12.5,
                  color: 'var(--text2)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 13px',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: 1.65,
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border2)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          )}
        </div>
      )}

      {/* Output */}
      {tab === 'output' && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isLoading && !verdict && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                color: 'var(--text3)',
              }}
            >
              <Spinner color="var(--text4)" size={22} />
              <p style={{ fontSize: 13, fontFamily: 'var(--sans)' }}>
                {isRunning ? 'Running your code…' : 'Judging submission…'}
              </p>
            </div>
          )}
          {verdict && <VerdictPanel verdict={verdict} />}
          {!isLoading && !verdict && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: 'var(--text4)',
              }}
            >
              <Terminal size={20} />
              <p style={{ fontSize: 13, fontFamily: 'var(--sans)' }}>
                Run your code to see output
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Blocker ───────────────────────────────────────────────────────────
function MobileBlocker({ width }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(
      () => setDots((d) => (d.length >= 3 ? '' : d + '.')),
      500
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        zIndex: 50,
        fontFamily: 'var(--mono)',
        padding: '0 32px',
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
        Desktop Required
      </h2>
      <div
        style={{
          display: 'flex',
          gap: 32,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '18px 28px',
          fontSize: 13,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text3)', marginBottom: 4 }}>Current</p>
          <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>
            {width}px
          </p>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text3)', marginBottom: 4 }}>Minimum</p>
          <p style={{ color: '#4ade80', fontWeight: 700, fontSize: 18 }}>
            1024px
          </p>
        </div>
      </div>
      <p
        style={{
          fontSize: 11,
          color: 'var(--text4)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Awaiting desktop{dots}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProblemWorkspace() {
  const { problemSlug } = useParams();

  const [problem, setProblem] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [leftTab, setLeftTab] = useState('description');
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(BOILERPLATE.cpp);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowW, setWindowW] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [verdict, setVerdict] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [submissionDetailsOpen, setSubmissionDetailsOpen] = useState(false);
  const [submissionDetailsLoading, setSubmissionDetailsLoading] =
    useState(false);
  const [submissionDetailsError, setSubmissionDetailsError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionsRefreshTick, setSubmissionsRefreshTick] = useState(0);
  const pendingId = useRef(null);

  // Socket
  useEffect(() => {
    const socket = getSocket();
    const handleResult = (data) => {
      if (
        pendingId.current &&
        String(data.submissionId) !== String(pendingId.current)
      )
        return;
      setIsRunning(false);
      setIsSubmitting(false);
      pendingId.current = null;
      setVerdict({
        status: data.status,
        output: data.output,
        runtime: data.runtime,
        memory: data.memory,
      });
      if (data.submissionId) {
        setSubmissionsRefreshTick((n) => n + 1);
      }
    };
    socket.on('CODE_RESULT', handleResult);
    return () => socket.off('CODE_RESULT', handleResult);
  }, []);

  // Fetch problem
  const loadProblem = async () => {
    if (!problemSlug) return;
    setFetching(true);
    setFetchError(null);
    try {
      const data = await getProblemBySlug(problemSlug);
      setProblem(data.data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message ??
          err?.message ??
          'Could not load problem.'
      );
    } finally {
      setFetching(false);
    }
  };
  useEffect(() => {
    loadProblem();
  }, [problemSlug]);

  const loadSubmissions = async () => {
    if (!problem?._id) return;
    setSubmissionsLoading(true);
    setSubmissionsError(null);
    try {
      const res = await getProblemSubmissions(problem._id);
      setSubmissions(res?.data ?? []);
    } catch (err) {
      setSubmissionsError(
        err?.response?.data?.message ??
          err?.message ??
          'Failed to fetch submissions.'
      );
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (leftTab !== 'submissions' || !problem?._id) return;
    loadSubmissions();
  }, [leftTab, problem?._id, submissionsRefreshTick]);

  const handleOpenSubmissionDetails = async (submissionId) => {
    if (!submissionId) return;
    setSubmissionDetailsOpen(true);
    setSubmissionDetailsLoading(true);
    setSubmissionDetailsError(null);
    setSelectedSubmission(null);

    try {
      const res = await getSubmissionById(submissionId);
      setSelectedSubmission(res?.data ?? null);
    } catch (err) {
      setSubmissionDetailsError(
        err?.response?.data?.message ??
          err?.message ??
          'Could not load submission details.'
      );
    } finally {
      setSubmissionDetailsLoading(false);
    }
  };

  const handleLoadSubmissionInEditor = (submission) => {
    const nextLanguage = LANGUAGES[submission?.language]
      ? submission.language
      : 'cpp';

    setLanguage(nextLanguage);
    setCode(submission?.code ?? BOILERPLATE[nextLanguage]);
    setVerdict({
      status: submission?.status ?? 'Pending',
      output: submission?.output ?? '',
      runtime: submission?.runtime ?? null,
      memory: submission?.memory ?? null,
    });
    setSubmissionDetailsOpen(false);
  };

  // Resize
  useEffect(() => {
    const fn = () => {
      setWindowW(window.innerWidth);
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(BOILERPLATE[lang]);
  };

  const handleRun = async () => {
    if (!problem?._id || isRunning || isSubmitting) return;
    setIsRunning(true);
    setVerdict(null);
    try {
      const res = await api.post('/submissions/run', {
        code,
        language,
        problemId: problem._id,
        type: 'run',
        customInput,
      });
      pendingId.current = res.data?.submissionId ?? null;
    } catch (err) {
      setIsRunning(false);
      setVerdict({
        status: 'Internal Error',
        output: err?.response?.data?.error ?? err.message,
      });
    }
  };

  const handleSubmit = async () => {
    if (!problem?._id || isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setVerdict(null);
    try {
      const res = await api.post('/submissions/run', {
        code,
        language,
        problemId: problem._id,
        type: 'submit',
      });
      pendingId.current = res.data?.submissionId ?? null;
    } catch (err) {
      setIsSubmitting(false);
      setVerdict({
        status: 'Internal Error',
        output: err?.response?.data?.error ?? err.message,
      });
    }
  };

  if (isMobile) return <MobileBlocker width={windowW} />;

  const isLoading = isRunning || isSubmitting;
  const lang = LANGUAGES[language];
  const diff = DIFF[problem?.difficulty] ?? DIFF.EASY;

  let leftContent;
  if (fetching) leftContent = <ProblemSkeleton />;
  else if (fetchError)
    leftContent = <ProblemError message={fetchError} onRetry={loadProblem} />;
  else {
    if (leftTab === 'description')
      leftContent = <DescriptionTab problem={problem} />;
    if (leftTab === 'hints')
      leftContent = <HintsTab hints={problem?.hints ?? []} />;
    if (leftTab === 'submissions')
      leftContent = (
        <SubmissionsTab
          submissions={submissions}
          isLoading={submissionsLoading}
          error={submissionsError}
          onRetry={loadSubmissions}
          onSelectSubmission={handleOpenSubmissionDetails}
        />
      );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Sidebar compact />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg)',
          height: '100vh',
          overflow: 'hidden',
          fontFamily: 'var(--sans)',
          paddingTop: 48,
        }}
      >
        {/* ── Toolbar ── */}
        <div
          style={{
            height: 44,
            flexShrink: 0,
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            gap: 12,
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--text4)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
                fontFamily: 'var(--sans)',
              }}
              className="hover:text-zinc-400"
            >
              Problems
            </span>
            <ChevronRight
              size={11}
              style={{ color: 'var(--text4)', flexShrink: 0 }}
            />
            {fetching ? (
              <div className="skeleton" style={{ width: 130, height: 11 }} />
            ) : (
              <>
                <span
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text)',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 260,
                  }}
                >
                  {problem?.title ?? '—'}
                </span>
                <Badge diff={problem?.difficulty} />
              </>
            )}
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            {/* Reset */}
            <button
              className="icon-btn"
              title="Reset code"
              onClick={() => {
                setCode(BOILERPLATE[language]);
                setVerdict(null);
              }}
            >
              <RotateCcw size={14} />
            </button>

            <div
              style={{ width: 1, height: 18, background: 'var(--border)' }}
            />

            {/* Language selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border2)',
                borderRadius: 7,
                padding: '5px 10px',
                fontSize: 12.5,
                color: 'var(--text)',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'var(--sans)',
                transition: 'border-color 0.15s',
              }}
              className="hover:border-zinc-500"
            >
              {Object.entries(LANGUAGES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            {/* Run */}
            <button
              onClick={handleRun}
              disabled={isLoading || fetching}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 500,
                fontFamily: 'var(--sans)',
                background: 'var(--surface2)',
                border: '1px solid var(--border2)',
                color: isLoading || fetching ? 'var(--text3)' : 'var(--text)',
                cursor: isLoading || fetching ? 'not-allowed' : 'pointer',
                opacity: isLoading || fetching ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
              className={
                !isLoading ? 'hover:bg-zinc-700 hover:border-zinc-600' : ''
              }
            >
              {isRunning ? (
                <Spinner color="#4ade80" size={12} />
              ) : (
                <Play size={12} color="#4ade80" />
              )}
              {isRunning ? 'Running…' : 'Run'}
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || fetching}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 16px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: 'var(--sans)',
                background: isSubmitting
                  ? 'var(--accent-dim)'
                  : 'var(--accent)',
                border: 'none',
                color: isSubmitting ? '#fdba74' : '#0c0c0d',
                cursor: isLoading || fetching ? 'not-allowed' : 'pointer',
                opacity: isLoading || fetching ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
              className={!isLoading ? 'hover:brightness-110' : ''}
            >
              {isSubmitting ? (
                <Spinner color="#fdba74" size={12} />
              ) : (
                <Zap size={12} />
              )}
              {isSubmitting ? 'Judging…' : 'Submit'}
            </button>
          </div>
        </div>

        {/* ── Panels ── */}
        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
          {/* Left panel */}
          <Panel
            defaultSize={40}
            minSize={26}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              background: 'var(--surface)',
              borderRight: '1px solid var(--border)',
            }}
          >
            {/* Left tab bar */}
            <div
              style={{
                height: 40,
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0 2px',
                flexShrink: 0,
              }}
            >
              {[
                {
                  id: 'description',
                  icon: <Info size={12} />,
                  label: 'Description',
                },
                { id: 'hints', icon: <Lightbulb size={12} />, label: 'Hints' },
                {
                  id: 'submissions',
                  icon: <History size={12} />,
                  label: 'Submissions',
                },
              ].map((t) => (
                <button
                  key={t.id}
                  disabled={fetching}
                  onClick={() => !fetching && setLeftTab(t.id)}
                  className={`tab-btn${leftTab === t.id && !fetching ? ' active' : ''}`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
            {leftContent}
          </Panel>

          <PanelResizeHandle className="h-resizer" />

          {/* Right panel */}
          <Panel
            defaultSize={60}
            style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
          >
            <PanelGroup direction="vertical" style={{ flex: 1, minHeight: 0 }}>
              {/* Editor */}
              <Panel
                defaultSize={65}
                minSize={30}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                }}
              >
                {/* Editor header */}
                <div
                  style={{
                    height: 40,
                    background: 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['#3f3f46', '#3f3f46', '#3f3f46'].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          background: c,
                        }}
                      />
                    ))}
                  </div>
                  <FileCode size={12} style={{ color: 'var(--text4)' }} />
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--text3)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    solution.{lang.ext}
                  </span>
                  <div style={{ marginLeft: 'auto' }}>
                    <CopyBtn text={code} />
                  </div>
                </div>
                {/* Monaco */}
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={lang.monaco}
                    value={code}
                    onChange={(val) => setCode(val ?? '')}
                    options={{
                      fontSize: 13.5,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontLigatures: true,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      scrollBeyondLastLine: false,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'gutter',
                      bracketPairColorization: { enabled: true },
                      guides: { bracketPairs: false, indentation: true },
                      scrollbar: {
                        verticalScrollbarSize: 3,
                        horizontalScrollbarSize: 3,
                      },
                      overviewRulerBorder: false,
                      hideCursorInOverviewRuler: true,
                    }}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="v-resizer" />

              {/* Console */}
              <Panel
                defaultSize={35}
                minSize={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                }}
              >
                <ConsolePanel
                  examples={problem?.examples ?? []}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  customInput={customInput}
                  setCustomInput={setCustomInput}
                  verdict={verdict}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      <SubmissionDetailsModal
        isOpen={submissionDetailsOpen}
        isLoading={submissionDetailsLoading}
        error={submissionDetailsError}
        submission={selectedSubmission}
        onClose={() => setSubmissionDetailsOpen(false)}
        onLoadInEditor={handleLoadSubmissionInEditor}
      />
    </>
  );
}
