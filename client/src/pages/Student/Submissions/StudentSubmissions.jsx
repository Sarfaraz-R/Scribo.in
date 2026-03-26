import { useState, useMemo } from 'react';
import Sidebar from '../../../components/common/Sidebar';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Search,
  Filter,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  Timer,
  X,
  ChevronDown,
  FileCode,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(100px); pointer-events: none; z-index: 0;
  }

  .scrollbar-thin::-webkit-scrollbar { width: 3px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 99px; }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(249,115,22,0.4); }
  .no-scrollbar::-webkit-scrollbar { display:none; }
  .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }

  @keyframes slideInRight {
    from { opacity:0; transform:translateX(24px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes rowSlide {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes shimmerSweep {
    0%   { transform: translateX(-100%) skewX(-20deg); }
    100% { transform: translateX(300%) skewX(-20deg); }
  }
  @keyframes pulseDot {
    0%,100% { opacity:.4; transform:scale(1); }
    50%     { opacity:1;  transform:scale(1.4); }
  }

  .anim-detail { animation: slideInRight .35s cubic-bezier(.16,1,.3,1) both; }
  .anim-row    { animation: rowSlide .28s ease both; }
  .anim-stat   { animation: fadeUp .4s ease both; }

  .anim-row:nth-child(1){animation-delay:.00s}
  .anim-row:nth-child(2){animation-delay:.04s}
  .anim-row:nth-child(3){animation-delay:.08s}
  .anim-row:nth-child(4){animation-delay:.12s}
  .anim-row:nth-child(5){animation-delay:.16s}
  .anim-row:nth-child(6){animation-delay:.20s}
  .anim-row:nth-child(7){animation-delay:.24s}
  .anim-row:nth-child(8){animation-delay:.28s}

  .code-font    { font-family:'JetBrains Mono',monospace; }
  .display-font { font-family:'Syne',sans-serif; }

  /* Row */
  .sub-row {
    position: relative;
    border-left: 2px solid transparent;
    transition: background .16s ease, border-color .16s ease;
  }
  .sub-row::before {
    content:''; position:absolute; inset:0; opacity:0;
    background: linear-gradient(100deg, rgba(249,115,22,.05) 0%, transparent 55%);
    transition: opacity .2s ease; pointer-events:none;
  }
  .sub-row:hover::before { opacity:1; }
  .sub-row.active {
    border-left-color: rgba(249,115,22,.7) !important;
    background: linear-gradient(100deg, rgba(249,115,22,.07) 0%, transparent 60%);
    box-shadow: inset 3px 0 18px rgba(249,115,22,.06);
  }

  /* Glass card */
  .card {
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(255,255,255,.055);
    border-radius: 16px;
  }

  /* Resubmit */
  .resubmit-btn {
    position:relative; overflow:hidden;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .resubmit-btn::after {
    content:''; position:absolute;
    top:0; left:-60%; width:40%; height:100%;
    background: linear-gradient(90deg,transparent,rgba(249,115,22,.2),transparent);
    transform: skewX(-20deg);
  }
  .resubmit-btn:hover::after { animation: shimmerSweep .65s ease forwards; }
  .resubmit-btn:hover {
    border-color: rgba(249,115,22,.5) !important;
    box-shadow: 0 0 24px rgba(249,115,22,.1);
    background: rgba(249,115,22,.09) !important;
  }

  .stat-pill { transition: transform .15s ease; cursor:default; }
  .stat-pill:hover { transform:translateY(-2px); }

  /* Verdict icon glows */
  .glow-green  { filter:drop-shadow(0 0 5px rgba(52,211,153,.6)); }
  .glow-orange { filter:drop-shadow(0 0 5px rgba(251,146,60,.6)); }
  .glow-red    { filter:drop-shadow(0 0 5px rgba(248,113,113,.6)); }
  .glow-amber  { filter:drop-shadow(0 0 5px rgba(251,191,36,.6)); }
  .glow-purple { filter:drop-shadow(0 0 5px rgba(196,181,253,.6)); }
  .glow-pink   { filter:drop-shadow(0 0 5px rgba(244,114,182,.6)); }

  .live-dot { animation: pulseDot 2s ease infinite; }

  .copy-btn { transition: background .15s, border-color .15s, color .15s; }

  .bd-row { padding:5px 6px; margin:-5px -6px; border-radius:8px; transition:background .15s; }
  .bd-row:hover { background:rgba(255,255,255,.03); }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBMISSIONS = [
  {
    id: 's001',
    problem: 'Two Sum',
    subject: 'Data Structures',
    language: 'JavaScript',
    verdict: 'Accepted',
    score: 100,
    maxScore: 100,
    submittedAt: '2026-02-24T10:32:00',
    runtime: '68ms',
    memory: '42.3MB',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 20, max: 20 },
      { label: 'Boilerplate', score: 20, max: 20 },
      { label: 'Logic Flow', score: 20, max: 20 },
      { label: 'Test Cases', score: 20, max: 20 },
    ],
    testCases: { passed: 57, total: 57 },
    code: `var twoSum = function(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n};`,
  },
  {
    id: 's002',
    problem: 'Merge Sort',
    subject: 'Algorithms',
    language: 'Python',
    verdict: 'Partial Credit',
    score: 72,
    maxScore: 100,
    submittedAt: '2026-02-23T14:18:00',
    runtime: '142ms',
    memory: '38.1MB',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 20, max: 20 },
      { label: 'Boilerplate', score: 15, max: 20 },
      { label: 'Logic Flow', score: 12, max: 20 },
      { label: 'Test Cases', score: 5, max: 20 },
    ],
    testCases: { passed: 31, total: 57 },
    code: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
  },
  {
    id: 's003',
    problem: 'Binary Search Tree',
    subject: 'Data Structures',
    language: 'Java',
    verdict: 'Wrong Answer',
    score: 40,
    maxScore: 100,
    submittedAt: '2026-02-22T09:05:00',
    runtime: '210ms',
    memory: '45.7MB',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 20, max: 20 },
      { label: 'Boilerplate', score: 0, max: 20 },
      { label: 'Logic Flow', score: 0, max: 20 },
      { label: 'Test Cases', score: 0, max: 20 },
    ],
    testCases: { passed: 12, total: 57 },
    code: `class BST {\n    Node root;\n    void insert(int val) {\n        root = insertRec(root, val);\n    }\n    Node insertRec(Node root, int val) {\n        if (root == null) {\n            root = new Node(val);\n            return root;\n        }\n        if (val < root.val) root.left = insertRec(root.left, val);\n        else if (val > root.val) root.right = insertRec(root.right, val);\n        return root;\n    }\n}`,
  },
  {
    id: 's004',
    problem: 'Fibonacci DP',
    subject: 'Algorithms',
    language: 'C++',
    verdict: 'Time Limit Exceeded',
    score: 25,
    maxScore: 100,
    submittedAt: '2026-02-21T16:44:00',
    runtime: '>2000ms',
    memory: '52.4MB',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 5, max: 20 },
      { label: 'Boilerplate', score: 0, max: 20 },
      { label: 'Logic Flow', score: 0, max: 20 },
      { label: 'Test Cases', score: 0, max: 20 },
    ],
    testCases: { passed: 8, total: 57 },
    code: `int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2); // No memoization — O(2^n)\n}\n\nint main() {\n    cout << fib(50) << endl; // TLE here\n    return 0;\n}`,
  },
  {
    id: 's005',
    problem: 'SQL Joins',
    subject: 'Database Management',
    language: 'SQL',
    verdict: 'Compilation Error',
    score: 10,
    maxScore: 100,
    submittedAt: '2026-02-20T11:22:00',
    runtime: '—',
    memory: '—',
    partialBreakdown: [
      { label: 'Syntax', score: 10, max: 20 },
      { label: 'Compilation', score: 0, max: 20 },
      { label: 'Boilerplate', score: 0, max: 20 },
      { label: 'Logic Flow', score: 0, max: 20 },
      { label: 'Test Cases', score: 0, max: 20 },
    ],
    testCases: { passed: 0, total: 57 },
    code: `SELCT e.name, d.department_name\nFORM employees e\nINNER JOIN departments d ON e.dept_id = d.id\nWHER e.salary > 50000\nORDER BY e.name`,
  },
  {
    id: 's006',
    problem: 'Linked List Reversal',
    subject: 'Data Structures',
    language: 'Python',
    verdict: 'Accepted',
    score: 100,
    maxScore: 100,
    submittedAt: '2026-02-19T08:15:00',
    runtime: '54ms',
    memory: '36.2MB',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 20, max: 20 },
      { label: 'Boilerplate', score: 20, max: 20 },
      { label: 'Logic Flow', score: 20, max: 20 },
      { label: 'Test Cases', score: 20, max: 20 },
    ],
    testCases: { passed: 57, total: 57 },
    code: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
  },
  {
    id: 's007',
    problem: 'Heap Sort',
    subject: 'Algorithms',
    language: 'C++',
    verdict: 'Runtime Error',
    score: 20,
    maxScore: 100,
    submittedAt: '2026-02-18T15:30:00',
    runtime: 'Error',
    memory: '—',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 0, max: 20 },
      { label: 'Boilerplate', score: 0, max: 20 },
      { label: 'Logic Flow', score: 0, max: 20 },
      { label: 'Test Cases', score: 0, max: 20 },
    ],
    testCases: { passed: 0, total: 57 },
    code: `void heapify(int arr[], int n, int i) {\n    int largest = i;\n    int l = 2*i + 1;\n    int r = 2*i + 2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        swap(arr[i], arr[largest]);\n        heapify(arr, n, largest); // Stack overflow on large input\n    }\n}`,
  },
  {
    id: 's008',
    problem: 'Graph BFS',
    subject: 'Algorithms',
    language: 'JavaScript',
    verdict: 'Partial Credit',
    score: 58,
    maxScore: 100,
    submittedAt: '2026-02-17T13:10:00',
    runtime: '98ms',
    memory: '44.1MB',
    partialBreakdown: [
      { label: 'Syntax', score: 20, max: 20 },
      { label: 'Compilation', score: 20, max: 20 },
      { label: 'Boilerplate', score: 10, max: 20 },
      { label: 'Logic Flow', score: 8, max: 20 },
      { label: 'Test Cases', score: 0, max: 20 },
    ],
    testCases: { passed: 24, total: 57 },
    code: `function bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];\n  visited.add(start);\n  const result = [];\n  while (queue.length) {\n    const node = queue.shift();\n    result.push(node);\n    for (const neighbor of graph[node] || []) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return result;\n}`,
  },
];

// ── Config ────────────────────────────────────────────────────────────────────
const VERDICT_CFG = {
  Accepted: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/25',
    dot: 'bg-emerald-400',
    glow: 'glow-green',
  },
  'Partial Credit': {
    icon: Award,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/25',
    dot: 'bg-orange-400',
    glow: 'glow-orange',
  },
  'Wrong Answer': {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/25',
    dot: 'bg-red-400',
    glow: 'glow-red',
  },
  'Time Limit Exceeded': {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/25',
    dot: 'bg-amber-400',
    glow: 'glow-amber',
  },
  'Compilation Error': {
    icon: AlertTriangle,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/25',
    dot: 'bg-purple-400',
    glow: 'glow-purple',
  },
  'Runtime Error': {
    icon: Zap,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/25',
    dot: 'bg-pink-400',
    glow: 'glow-pink',
  },
};

const LANG_CFG = {
  JavaScript: 'text-yellow-300 bg-yellow-300/10 border-yellow-300/15',
  Python: 'text-blue-300   bg-blue-300/10   border-blue-300/15',
  Java: 'text-orange-300 bg-orange-300/10 border-orange-300/15',
  'C++': 'text-cyan-300   bg-cyan-300/10   border-cyan-300/15',
  SQL: 'text-violet-300 bg-violet-300/10  border-violet-300/15',
};
const LANG_EXT = {
  JavaScript: 'js',
  Python: 'py',
  Java: 'java',
  'C++': 'cpp',
  SQL: 'sql',
};

const ALL_VERDICTS = [
  'All',
  'Accepted',
  'Partial Credit',
  'Wrong Answer',
  'Time Limit Exceeded',
  'Compilation Error',
  'Runtime Error',
];
const ALL_SUBJECTS = [
  'All',
  ...Array.from(new Set(SUBMISSIONS.map((s) => s.subject))),
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const sc = (p) =>
  p >= 0.8 ? 'text-emerald-400' : p >= 0.5 ? 'text-orange-400' : 'text-red-400';
const sb = (p) =>
  p >= 0.8 ? 'bg-emerald-400' : p >= 0.5 ? 'bg-orange-400' : 'bg-red-400';
const sbDim = (p) =>
  p >= 0.8
    ? 'bg-emerald-400/50'
    : p >= 0.5
      ? 'bg-orange-400/50'
      : 'bg-red-400/40';
const sg = (p) =>
  p >= 0.8
    ? '0 0 10px rgba(52,211,153,.5)'
    : p >= 0.5
      ? '0 0 10px rgba(251,146,60,.5)'
      : '0 0 10px rgba(248,113,113,.5)';

// ── Score Arc ─────────────────────────────────────────────────────────────────
function ScoreArc({ score, max, size = 44 }) {
  const pct = score / max,
    r = (size - 5) / 2,
    circ = 2 * Math.PI * r;
  const c = pct >= 0.8 ? '#34d399' : pct >= 0.5 ? '#fb923c' : '#f87171';
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="3.5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={c}
        strokeWidth="3.5"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset .9s cubic-bezier(.16,1,.3,1)',
          filter: `drop-shadow(0 0 4px ${c}88)`,
        }}
      />
    </svg>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className="copy-btn flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: ok ? 'rgba(52,211,153,.1)' : 'rgba(255,255,255,.04)',
        border: `1px solid ${ok ? 'rgba(52,211,153,.25)' : 'rgba(255,255,255,.07)'}`,
        color: ok ? '#34d399' : 'rgba(255,255,255,.3)',
      }}
    >
      {ok ? (
        <>
          <Check size={10} />
          Copied
        </>
      ) : (
        <>
          <Copy size={10} />
          Copy
        </>
      )}
    </button>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ sub, onClose, onResubmit }) {
  const v = VERDICT_CFG[sub.verdict],
    VIcon = v.icon,
    pct = sub.score / sub.maxScore;
  return (
    <div
      className="anim-detail flex flex-col h-full"
      style={{
        background: '#080809',
        borderLeft: '1px solid rgba(255,255,255,.05)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 pt-6 pb-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}
      >
        <div className="flex items-start gap-4 mb-4">
          {/* Arc + score percent */}
          <div className="relative shrink-0">
            <ScoreArc score={sub.score} max={sub.maxScore} size={56} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[11px] font-black code-font ${sc(pct)}`}>
                {Math.round(pct * 100)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p
              className="text-[9px] font-bold uppercase tracking-[.28em] mb-1"
              style={{ color: 'rgba(255,255,255,.2)' }}
            >
              {sub.subject}
            </p>
            <h2
              className="display-font text-white font-black leading-tight truncate"
              style={{ fontSize: 21, letterSpacing: '-.02em' }}
            >
              {sub.problem}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all shrink-0"
            style={{ color: 'rgba(255,255,255,.2)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,.06)';
              e.currentTarget.style.color = 'rgba(255,255,255,.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,.2)';
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold ${v.color} ${v.bg} ${v.border}`}
          >
            <VIcon size={11} className={v.glow} />
            {sub.verdict}
          </span>
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${LANG_CFG[sub.language] || 'text-white/40 bg-white/5 border-white/10'}`}
          >
            {sub.language}
          </span>
          <div
            className="ml-auto flex items-center gap-1 text-[10px]"
            style={{ color: 'rgba(255,255,255,.2)' }}
          >
            <Clock size={9} />
            {timeAgo(sub.submittedAt)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
        {/* Score card */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[.25em]"
              style={{ color: 'rgba(255,255,255,.2)' }}
            >
              Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`display-font text-xl font-black ${sc(pct)}`}>
                {sub.score}
              </span>
              <span
                className="text-sm"
                style={{ color: 'rgba(255,255,255,.2)' }}
              >
                /{sub.maxScore}
              </span>
            </div>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden mb-4"
            style={{ background: 'rgba(255,255,255,.05)' }}
          >
            <div
              className={`h-full rounded-full ${sb(pct)}`}
              style={{
                width: `${pct * 100}%`,
                boxShadow: sg(pct),
                transition: 'width .9s cubic-bezier(.16,1,.3,1)',
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Runtime', value: sub.runtime, Icon: Timer },
              { label: 'Memory', value: sub.memory, Icon: Activity },
              {
                label: 'Tests',
                value: `${sub.testCases.passed}/${sub.testCases.total}`,
                Icon: CheckCircle,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,.025)',
                  border: '1px solid rgba(255,255,255,.045)',
                }}
              >
                <s.Icon
                  size={11}
                  className="mx-auto mb-1.5"
                  style={{ color: 'rgba(255,255,255,.2)' }}
                />
                <div
                  className="text-[9px] font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: 'rgba(255,255,255,.2)' }}
                >
                  {s.label}
                </div>
                <div className="text-white text-xs font-bold code-font">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="card p-4">
          <p
            className="text-[9px] font-bold uppercase tracking-[.25em] mb-4"
            style={{ color: 'rgba(255,255,255,.2)' }}
          >
            Score Breakdown
          </p>
          <div className="space-y-3.5">
            {sub.partialBreakdown.map((item, i) => {
              const p = item.score / item.max;
              const c =
                p === 1
                  ? {
                      bar: 'bg-emerald-400',
                      text: 'text-emerald-400',
                      glow: '0 0 8px rgba(52,211,153,.35)',
                    }
                  : p > 0
                    ? {
                        bar: 'bg-orange-400',
                        text: 'text-orange-400',
                        glow: '0 0 8px rgba(251,146,60,.35)',
                      }
                    : {
                        bar: 'bg-red-400/40',
                        text: 'text-red-400/50',
                        glow: 'none',
                      };
              return (
                <div key={i} className="bd-row">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: 'rgba(255,255,255,.4)' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold code-font ${c.text}`}
                    >
                      {item.score}
                      <span
                        style={{
                          color: 'rgba(255,255,255,.15)',
                          fontWeight: 400,
                        }}
                      >
                        /{item.max}
                      </span>
                    </span>
                  </div>
                  <div
                    className="h-[3px] rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,.05)' }}
                  >
                    <div
                      className={`h-full rounded-full ${c.bar}`}
                      style={{
                        width: `${p * 100}%`,
                        boxShadow: c.glow,
                        transition: 'width .9s cubic-bezier(.16,1,.3,1)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code viewer */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,.055)',
            background: '#050506',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: 'rgba(255,95,87,.45)' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: 'rgba(255,189,46,.45)' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: 'rgba(40,201,64,.45)' }}
                />
              </div>
              <span
                className="code-font text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,.2)' }}
              >
                solution.{LANG_EXT[sub.language] || 'txt'}
              </span>
            </div>
            <CopyBtn text={sub.code} />
          </div>
          <div className="flex">
            {/* Line numbers gutter */}
            <div
              className="shrink-0 w-10 py-4 flex flex-col items-end pr-3 select-none"
              style={{
                borderRight: '1px solid rgba(255,255,255,.03)',
                background: 'rgba(255,255,255,.01)',
              }}
            >
              {sub.code.split('\n').map((_, i) => (
                <span
                  key={i}
                  className="code-font text-[10px] leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,.12)' }}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <pre
              className="code-font text-[11.5px] leading-[1.7] flex-1 p-4 overflow-x-auto scrollbar-thin"
              style={{ color: 'rgba(255,255,255,.65)' }}
            >
              <code>{sub.code}</code>
            </pre>
          </div>
        </div>

        {/* Re-submit */}
        <button
          onClick={() => onResubmit(sub)}
          className="resubmit-btn w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[.15em] text-orange-400"
          style={{
            background: 'rgba(249,115,22,.06)',
            border: '1px solid rgba(249,115,22,.2)',
          }}
        >
          <RotateCcw size={12} /> Re-submit Solution
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StudentSubmissions() {
  const [selected, setSelected] = useState(SUBMISSIONS[0]);
  const [verdictFilter, setVerdictFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [listKey, setListKey] = useState(0);

  const filtered = useMemo(
    () =>
      SUBMISSIONS.filter((s) => {
        const mV = verdictFilter === 'All' || s.verdict === verdictFilter;
        const mS = subjectFilter === 'All' || s.subject === subjectFilter;
        const mQ =
          s.problem.toLowerCase().includes(search.toLowerCase()) ||
          s.subject.toLowerCase().includes(search.toLowerCase());
        return mV && mS && mQ;
      }),
    [verdictFilter, subjectFilter, search]
  );

  const bump = (fn) => {
    fn();
    setListKey((k) => k + 1);
  };

  const total = SUBMISSIONS.length;
  const accepted = SUBMISSIONS.filter((s) => s.verdict === 'Accepted').length;
  const partial = SUBMISSIONS.filter(
    (s) => s.verdict === 'Partial Credit'
  ).length;
  const avgScore = Math.round(
    (SUBMISSIONS.reduce((a, s) => a + s.score / s.maxScore, 0) / total) * 100
  );

  return (
    <div
      className="flex dot-grid min-h-screen mt-12 md:mt-0"
      style={{
        background: '#030303',
        fontFamily: "'DM Sans',sans-serif",
        position: 'relative',
      }}
    >
      <style>{STYLES}</style>

      {/* Ambient orbs */}
      <div
        className="orb"
        style={{
          width: 450,
          height: 450,
          top: -80,
          left: 280,
          background:
            'radial-gradient(circle,rgba(249,115,22,.055) 0%,transparent 70%)',
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          bottom: 60,
          right: 180,
          background:
            'radial-gradient(circle,rgba(52,211,153,.035) 0%,transparent 70%)',
        }}
      />

      <Sidebar />

      <main
        className="lg:ml-[240px] flex flex-col min-h-screen w-full overflow-hidden"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* ── Header ── */}
        <div
          className="px-7 pt-7 pb-5 shrink-0"
          style={{
            borderBottom: '1px solid rgba(255,255,255,.05)',
            background: 'rgba(3,3,3,.94)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="text-[9px] font-bold uppercase tracking-[.28em]"
              style={{ color: 'rgba(249,115,22,.5)' }}
            >
              Student Portal
            </span>
            <ChevronRight size={9} style={{ color: 'rgba(255,255,255,.15)' }} />
            <span
              className="text-[9px] font-bold uppercase tracking-[.28em]"
              style={{ color: 'rgba(255,255,255,.25)' }}
            >
              Submissions
            </span>
          </div>

          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h1
                className="display-font text-white font-black leading-none"
                style={{ fontSize: 30, letterSpacing: '-.025em' }}
              >
                Submissions
              </h1>
              <p
                className="text-sm mt-1.5"
                style={{ color: 'rgba(255,255,255,.28)' }}
              >
                Review your code history and score breakdowns.
              </p>
            </div>
            <div
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,.15)' }}
            >
              <TrendingUp size={11} style={{ color: 'rgba(249,115,22,.4)' }} />
              Last 8 submissions
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {[
              {
                label: 'Total',
                value: total,
                c: 'rgba(255,255,255,1)',
                bg: 'rgba(255,255,255,.05)',
                bd: 'rgba(255,255,255,.08)',
              },
              {
                label: 'Accepted',
                value: accepted,
                c: 'rgb(52,211,153)',
                bg: 'rgba(52,211,153,.06)',
                bd: 'rgba(52,211,153,.18)',
              },
              {
                label: 'Partial',
                value: partial,
                c: 'rgb(251,146,60)',
                bg: 'rgba(251,146,60,.06)',
                bd: 'rgba(251,146,60,.18)',
              },
              {
                label: 'Avg Score',
                value: `${avgScore}%`,
                c: 'rgb(96,165,250)',
                bg: 'rgba(96,165,250,.06)',
                bd: 'rgba(96,165,250,.18)',
              },
            ].map((s, i) => (
              <div
                key={i}
                className="stat-pill anim-stat flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  opacity: 0,
                  background: s.bg,
                  border: `1px solid ${s.bd}`,
                }}
              >
                <span
                  className="display-font text-[18px] font-black"
                  style={{ color: s.c }}
                >
                  {s.value}
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-[.2em]"
                  style={{ color: 'rgba(255,255,255,.22)' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Split Layout ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT — List */}
          <div
            className="w-full lg:w-[420px] xl:w-[460px] flex flex-col shrink-0 min-h-0"
            style={{ borderRight: '1px solid rgba(255,255,255,.05)' }}
          >
            {/* Filters */}
            <div
              className="px-4 py-3 space-y-2.5 shrink-0"
              style={{
                borderBottom: '1px solid rgba(255,255,255,.05)',
                background: 'rgba(3,3,3,.95)',
              }}
            >
              {/* Search */}
              <div className="relative">
                <Search
                  size={11}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,.2)' }}
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setListKey((k) => k + 1);
                  }}
                  placeholder="Search problems or subjects…"
                  className="w-full rounded-xl pl-9 pr-9 py-2.5 text-[11px] focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.07)',
                    color: 'rgba(255,255,255,.7)',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'rgba(249,115,22,.3)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,.07)')
                  }
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setListKey((k) => k + 1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(255,255,255,.2)' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,.5)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,.2)')
                    }
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Subject dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSubjectOpen(!subjectOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] transition-all"
                    style={{
                      background: 'rgba(255,255,255,.03)',
                      border: '1px solid rgba(255,255,255,.07)',
                      color: 'rgba(255,255,255,.35)',
                    }}
                  >
                    <Filter size={9} />
                    <span className="max-w-[80px] truncate">
                      {subjectFilter}
                    </span>
                    <ChevronDown
                      size={9}
                      className={`transition-transform ${subjectOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {subjectOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSubjectOpen(false)}
                      />
                      <div
                        className="absolute top-9 left-0 z-20 w-52 rounded-xl shadow-2xl py-1.5 overflow-hidden"
                        style={{
                          background: '#161618',
                          border: '1px solid rgba(255,255,255,.08)',
                        }}
                      >
                        {ALL_SUBJECTS.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              bump(() => setSubjectFilter(s));
                              setSubjectOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-[11px] transition-colors"
                            style={{
                              color:
                                subjectFilter === s
                                  ? 'rgb(251,146,60)'
                                  : 'rgba(255,255,255,.35)',
                              background:
                                subjectFilter === s
                                  ? 'rgba(249,115,22,.08)'
                                  : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (subjectFilter !== s) {
                                e.currentTarget.style.background =
                                  'rgba(255,255,255,.04)';
                                e.currentTarget.style.color =
                                  'rgba(255,255,255,.7)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (subjectFilter !== s) {
                                e.currentTarget.style.background =
                                  'transparent';
                                e.currentTarget.style.color =
                                  'rgba(255,255,255,.35)';
                              }
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Verdict pills */}
                <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {ALL_VERDICTS.map((v) => {
                    const cfg = VERDICT_CFG[v],
                      active = verdictFilter === v;
                    return (
                      <button
                        key={v}
                        onClick={() => bump(() => setVerdictFilter(v))}
                        className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                          active
                            ? v === 'All'
                              ? 'bg-white/10 text-white border border-white/15'
                              : `${cfg.bg} ${cfg.color} border ${cfg.border}`
                            : 'text-white/20 hover:text-white/40 hover:bg-white/[.04]'
                        }`}
                      >
                        {v === 'All' ? (
                          'All'
                        ) : (
                          <>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${active ? 'live-dot' : ''} ${cfg.dot}`}
                            />
                            {v.split(' ')[0]}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Count */}
            <div
              className="px-5 py-2 shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,.03)' }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,.15)' }}
              >
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* List */}
            <div
              className="flex-1 overflow-y-auto scrollbar-thin"
              key={listKey}
            >
              {filtered.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-40 gap-3"
                  style={{ color: 'rgba(255,255,255,.1)' }}
                >
                  <FileCode size={22} />
                  <span className="text-xs">
                    No submissions match your filters.
                  </span>
                </div>
              ) : (
                filtered.map((sub, i) => {
                  const v = VERDICT_CFG[sub.verdict],
                    VIcon = v.icon,
                    pct = sub.score / sub.maxScore,
                    isSel = selected?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelected(sub)}
                      className={`anim-row sub-row w-full text-left px-5 py-4 ${isSel ? 'active' : ''}`}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,.04)',
                        animationDelay: `${i * 0.03}s`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span
                              className={`flex items-center gap-1 text-[10px] font-bold ${v.color}`}
                            >
                              <VIcon size={10} className={v.glow} />
                              {sub.verdict}
                            </span>
                            <span
                              className="text-[9px]"
                              style={{ color: 'rgba(255,255,255,.12)' }}
                            >
                              ·
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${LANG_CFG[sub.language] || 'text-white/30 bg-white/5 border-white/10'}`}
                            >
                              {sub.language}
                            </span>
                          </div>
                          <p
                            className="display-font text-white text-[13px] font-bold truncate"
                            style={{ letterSpacing: '-.01em' }}
                          >
                            {sub.problem}
                          </p>
                          <p
                            className="text-[10px] mt-0.5"
                            style={{ color: 'rgba(255,255,255,.2)' }}
                          >
                            {sub.subject}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <div className="text-right">
                            <div
                              className={`display-font text-[15px] font-black ${sc(pct)}`}
                            >
                              {sub.score}
                              <span
                                className="text-xs font-normal"
                                style={{ color: 'rgba(255,255,255,.15)' }}
                              >
                                /{sub.maxScore}
                              </span>
                            </div>
                            <div
                              className="text-[9px] mt-0.5"
                              style={{ color: 'rgba(255,255,255,.18)' }}
                            >
                              {timeAgo(sub.submittedAt)}
                            </div>
                          </div>
                          <div
                            style={{
                              position: 'relative',
                              width: 30,
                              height: 30,
                            }}
                          >
                            <ScoreArc
                              score={sub.score}
                              max={sub.maxScore}
                              size={30}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mini bar */}
                      <div
                        className="mt-3 h-[3px] rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,.04)' }}
                      >
                        <div
                          className={`h-full rounded-full ${sbDim(pct)}`}
                          style={{ width: `${pct * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT — Detail */}
          <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
            {selected ? (
              <DetailPanel
                key={selected.id}
                sub={selected}
                onClose={() => setSelected(null)}
                onResubmit={(s) => console.log('Resubmit', s.id)}
              />
            ) : (
              <div
                className="flex-1 flex flex-col items-center justify-center gap-3"
                style={{ color: 'rgba(255,255,255,.08)' }}
              >
                <FileCode size={32} />
                <p className="text-sm">Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
