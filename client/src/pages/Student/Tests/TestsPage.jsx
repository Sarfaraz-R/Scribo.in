import { useState, useEffect } from 'react';
import Sidebar from '../../../components/common/Sidebar';
import {
  Clock,
  Tag,
  ChevronRight,
  Zap,
  BookOpen,
  CheckCircle,
  Lock,
  Play,
  Search,
  SlidersHorizontal,
  Trophy,
  AlertCircle,
  Calendar,
  Timer,
  X,
} from 'lucide-react';

// ── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    70% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes countdownPulse {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.5; }
  }
  @keyframes liveBlip {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes borderGlow {
    0%,100% { border-color: rgba(239,68,68,0.3); }
    50%     { border-color: rgba(239,68,68,0.7); }
  }

  .animate-fade-up   { animation: fadeUp 0.5s ease forwards; }
  .animate-pulse-ring { animation: pulseRing 1.8s ease-out infinite; }
  .animate-live-blip  { animation: liveBlip 1.2s ease-in-out infinite; }
  .animate-border-glow { animation: borderGlow 2s ease-in-out infinite; }
  .stagger-1 { animation-delay: 0.05s; opacity: 0; }
  .stagger-2 { animation-delay: 0.10s; opacity: 0; }
  .stagger-3 { animation-delay: 0.15s; opacity: 0; }
  .stagger-4 { animation-delay: 0.20s; opacity: 0; }
  .stagger-5 { animation-delay: 0.25s; opacity: 0; }
  .stagger-6 { animation-delay: 0.30s; opacity: 0; }

  .card-hover {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.07);
  }


  .dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
  }


  @keyframes tabBlurIn {
    from { opacity: 0; filter: blur(8px); transform: translateY(8px); }
    to   { opacity: 1; filter: blur(0px); transform: translateY(0); }
  }
  @keyframes tabBlurOut {
    from { opacity: 1; filter: blur(0px); }
    to   { opacity: 0; filter: blur(8px); }
  }
  .tab-enter {
    animation: tabBlurIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .tab-grid-enter > * {
    animation: tabBlurIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  .tab-grid-enter > *:nth-child(1) { animation-delay: 0.00s; }
  .tab-grid-enter > *:nth-child(2) { animation-delay: 0.06s; }
  .tab-grid-enter > *:nth-child(3) { animation-delay: 0.12s; }
  .tab-grid-enter > *:nth-child(4) { animation-delay: 0.18s; }
  .tab-grid-enter > *:nth-child(5) { animation-delay: 0.22s; }
  .tab-grid-enter > *:nth-child(6) { animation-delay: 0.26s; }
  .score-ring {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }
`;

// ── Mock Data ────────────────────────────────────────────────────────────────
const LIVE_TESTS = [
  {
    id: 'l1',
    title: 'Data Structures — Mid Semester',
    subject: 'Data Structures',
    tags: ['Arrays', 'Linked Lists', 'Stacks'],
    duration: 90,
    timeLeft: 2580, // seconds remaining
    totalMarks: 100,
    problems: 5,
    enrolled: 62,
    status: 'live',
    difficulty: 'Medium',
  },
];

const UPCOMING_TESTS = [
  {
    id: 'u1',
    title: 'Algorithms Lab — Unit 3',
    subject: 'Algorithms',
    tags: ['Sorting', 'Searching', 'Complexity'],
    duration: 60,
    startsIn: 86400 * 2 + 3600 * 5, // 2d 5h
    totalMarks: 50,
    problems: 3,
    date: 'Feb 28, 2026',
    time: '10:00 AM',
    difficulty: 'Hard',
  },
  {
    id: 'u2',
    title: 'DBMS Practical Exam',
    subject: 'Database Management',
    tags: ['SQL', 'Normalization', 'Joins'],
    duration: 75,
    startsIn: 86400 * 4 + 3600 * 2,
    totalMarks: 60,
    problems: 4,
    date: 'Mar 2, 2026',
    time: '2:00 PM',
    difficulty: 'Medium',
  },
  {
    id: 'u3',
    title: 'OS Concepts — Quiz 2',
    subject: 'Operating Systems',
    tags: ['Processes', 'Threads', 'Deadlock'],
    duration: 45,
    startsIn: 86400 * 7 + 3600 * 9,
    totalMarks: 30,
    problems: 2,
    date: 'Mar 5, 2026',
    time: '11:30 AM',
    difficulty: 'Easy',
  },
];

const COMPLETED_TESTS = [
  {
    id: 'c1',
    title: 'Data Structures — Unit 1 Quiz',
    subject: 'Data Structures',
    tags: ['Arrays', 'Strings'],
    duration: 45,
    totalMarks: 50,
    scored: 43,
    grade: 'A+',
    problems: 3,
    submittedOn: 'Feb 18, 2026',
    partialMarks: 5,
    difficulty: 'Easy',
  },
  {
    id: 'c2',
    title: 'Algorithms — Sorting Lab',
    subject: 'Algorithms',
    tags: ['Merge Sort', 'Quick Sort'],
    duration: 60,
    totalMarks: 60,
    scored: 47,
    grade: 'A',
    problems: 4,
    submittedOn: 'Feb 12, 2026',
    partialMarks: 8,
    difficulty: 'Hard',
  },
  {
    id: 'c3',
    title: 'Python Basics — Unit 2',
    subject: 'Programming Fundamentals',
    tags: ['Functions', 'OOP'],
    duration: 30,
    totalMarks: 40,
    scored: 28,
    grade: 'B+',
    problems: 2,
    submittedOn: 'Feb 6, 2026',
    partialMarks: 4,
    difficulty: 'Easy',
  },
  {
    id: 'c4',
    title: 'DBMS — ER Diagrams Lab',
    subject: 'Database Management',
    tags: ['ER Model', 'Relational Schema'],
    duration: 50,
    totalMarks: 50,
    scored: 35,
    grade: 'B',
    problems: 3,
    submittedOn: 'Jan 29, 2026',
    partialMarks: 6,
    difficulty: 'Medium',
  },
];

const PRACTICE_TESTS = [
  {
    id: 'p1',
    title: 'Graph Algorithms — Practice Set',
    subject: 'Algorithms',
    tags: ['BFS', 'DFS', 'Dijkstra'],
    duration: 90,
    totalMarks: 100,
    problems: 6,
    attempts: 1204,
    difficulty: 'Hard',
    bestScore: null,
  },
  {
    id: 'p2',
    title: 'SQL Query Builder',
    subject: 'Database Management',
    tags: ['SELECT', 'JOIN', 'Aggregation'],
    duration: 45,
    totalMarks: 50,
    problems: 4,
    attempts: 876,
    difficulty: 'Medium',
    bestScore: 42,
  },
  {
    id: 'p3',
    title: 'Recursion & Backtracking',
    subject: 'Algorithms',
    tags: ['Recursion', 'Memoization'],
    duration: 60,
    totalMarks: 60,
    problems: 4,
    attempts: 2341,
    difficulty: 'Hard',
    bestScore: null,
  },
  {
    id: 'p4',
    title: 'OOP Design Patterns',
    subject: 'Software Engineering',
    tags: ['Singleton', 'Factory', 'Observer'],
    duration: 30,
    totalMarks: 40,
    problems: 3,
    attempts: 567,
    difficulty: 'Easy',
    bestScore: 38,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const DIFF_STYLES = {
  Easy: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    dot: 'bg-emerald-400',
  },
  Medium: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    dot: 'bg-amber-400',
  },
  Hard: { text: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
};

const GRADE_COLORS = {
  'A+': 'text-emerald-400',
  A: 'text-emerald-400',
  'B+': 'text-blue-400',
  B: 'text-blue-400',
  'C+': 'text-amber-400',
  C: 'text-amber-400',
  D: 'text-red-400',
  F: 'text-red-400',
};

function formatCountdown(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function formatTimeLeft(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ScoreRing({ scored, total, size = 44 }) {
  const pct = scored / total;
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color =
    pct >= 0.8
      ? '#34d399'
      : pct >= 0.6
        ? '#60a5fa'
        : pct >= 0.4
          ? '#fbbf24'
          : '#f87171';
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        className="score-ring"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size < 40 ? 8 : 10}
        fontWeight="700"
        fontFamily="monospace"
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function LiveCard({ test }) {
  const [timeLeft, setTimeLeft] = useState(test.timeLeft);
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const pct = (timeLeft / (test.duration * 60)) * 100;

  return (
    <div className="animate-border-glow relative rounded-2xl border bg-gradient-to-br from-red-950/25 via-[#0d0d0f] to-[#020202] p-5 overflow-hidden card-hover cursor-pointer ">
      {/* Glow blob */}

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4 ">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-live-blip" />
              Live
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFF_STYLES[test.difficulty].bg} ${DIFF_STYLES[test.difficulty].text}`}
            >
              {test.difficulty}
            </span>
          </div>
          <h3
            className="text-white font-bold text-base leading-snug mb-1"
            style={{ fontFamily: 'Syne,sans-serif' }}
          >
            {test.title}
          </h3>
          <p className="text-white/40 text-xs">{test.subject}</p>
        </div>
        {/* Countdown */}
        <div className="shrink-0 text-right">
          <div
            className="text-red-400 text-xl font-black tracking-tighter font-mono"
            style={{ animation: 'countdownPulse 1s ease-in-out infinite' }}
          >
            {formatTimeLeft(timeLeft)}
          </div>
          <div className="text-white/25 text-[9px] uppercase tracking-widest mt-0.5">
            remaining
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
          <span>Time Progress</span>
          <span>{Math.round(100 - pct)}% used</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000"
            style={{ width: `${100 - pct}%` }}
          />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 mb-4 text-[11px] text-white/40">
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {test.duration} min
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={11} />
          {test.problems} problems
        </span>
        <span className="flex items-center gap-1.5">
          <Trophy size={11} />
          {test.totalMarks} marks
        </span>
        <span className="ml-auto text-white/25">{test.enrolled} students</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {test.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded bg-white/5 border border-white/[0.07] text-white/40 text-[10px] flex items-center gap-1"
          >
            <Tag size={8} />
            {t}
          </span>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 transition-all text-[11px] font-bold text-white uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.3)]">
        <Play size={12} fill="white" /> Continue Test
      </button>
    </div>
  );
}

function UpcomingCard({ test, idx }) {
  const [countdown, setCountdown] = useState(test.startsIn);
  useEffect(() => {
    const id = setInterval(() => setCountdown((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = DIFF_STYLES[test.difficulty];

  return (
    <div
      className={`relative rounded-2xl border border-white/[0.07] bg-[#0d0d0f] p-4 overflow-hidden card-hover cursor-pointer animate-fade-up stagger-${idx + 1}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diff.bg} ${diff.text}`}
            >
              {test.difficulty}
            </span>
            <span className="text-white/20 text-[10px]">{test.subject}</span>
          </div>
          <h3
            className="text-white font-bold text-sm leading-snug"
            style={{ fontFamily: 'Syne,sans-serif' }}
          >
            {test.title}
          </h3>
        </div>
      </div>

      {/* Countdown chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/8 border border-orange-500/20 mb-4">
        <Timer size={11} className="text-orange-400" />
        <span className="text-orange-300 text-[11px] font-bold font-mono">
          {formatCountdown(countdown)}
        </span>
        <span className="text-orange-400/50 text-[10px]">to start</span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-[11px] text-white/35">
        <span className="flex items-center gap-1.5">
          <Calendar size={11} />
          {test.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {test.time}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-[11px] text-white/35">
        <span className="flex items-center gap-1.5">
          <BookOpen size={11} />
          {test.problems} problems
        </span>
        <span className="flex items-center gap-1.5">
          <Trophy size={11} />
          {test.totalMarks} marks
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {test.duration} min
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {test.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded bg-white/5 border border-white/[0.07] text-white/35 text-[10px] flex items-center gap-1"
          >
            <Tag size={8} />
            {t}
          </span>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all text-[10px] font-bold text-white/50 hover:text-orange-300 uppercase tracking-widest">
        <Lock size={11} /> Locked · Starts {test.date}
      </button>
    </div>
  );
}

function CompletedCard({ test, idx }) {
  const pct = test.scored / test.totalMarks;
  const diff = DIFF_STYLES[test.difficulty];
  const gradeColor = GRADE_COLORS[test.grade] || 'text-white';

  return (
    <div
      className={`relative rounded-2xl border border-white/[0.07] bg-[#0d0d0f] p-4 overflow-hidden card-hover cursor-pointer animate-fade-up stagger-${idx + 1}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diff.bg} ${diff.text}`}
            >
              {test.difficulty}
            </span>
            <span className="text-white/20 text-[10px]">{test.subject}</span>
          </div>
          <h3
            className="text-white font-bold text-sm leading-snug"
            style={{ fontFamily: 'Syne,sans-serif' }}
          >
            {test.title}
          </h3>
        </div>
        {/* Grade badge */}
        <div className="shrink-0 flex flex-col items-center">
          <span
            className={`text-2xl font-black ${gradeColor}`}
            style={{ fontFamily: 'Syne,sans-serif' }}
          >
            {test.grade}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="flex items-center gap-3 mb-4">
        <ScoreRing scored={test.scored} total={test.totalMarks} size={48} />
        <div className="flex-1">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-white/50">Score</span>
            <span className="text-white font-bold">
              {test.scored} / {test.totalMarks}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${pct * 100}%`, transition: 'width 1s ease' }}
            />
          </div>
          {test.partialMarks > 0 && (
            <div className="text-[10px] text-white/25 mt-1">
              Includes{' '}
              <span className="text-orange-400/70">
                +{test.partialMarks} partial marks
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-[11px] text-white/35">
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {test.duration} min
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={11} />
          {test.problems} problems
        </span>
        <span className="ml-auto flex items-center gap-1">
          <CheckCircle size={11} className="text-emerald-500/50" />
          {test.submittedOn}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {test.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded bg-white/5 border border-white/[0.07] text-white/35 text-[10px] flex items-center gap-1"
          >
            <Tag size={8} />
            {t}
          </span>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/[0.07] hover:bg-white/8 transition-all text-[10px] font-bold text-white/40 hover:text-white/70 uppercase tracking-widest">
        View Report <ChevronRight size={11} />
      </button>
    </div>
  );
}

function PracticeCard({ test, idx }) {
  const diff = DIFF_STYLES[test.difficulty];
  const hasBest = test.bestScore !== null;

  return (
    <div
      className={`relative rounded-2xl border border-white/[0.07] bg-[#0d0d0f] p-4 overflow-hidden card-hover cursor-pointer animate-fade-up stagger-${idx + 1}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diff.bg} ${diff.text}`}
            >
              {test.difficulty}
            </span>
            <span className="text-white/20 text-[10px]">{test.subject}</span>
          </div>
          <h3
            className="text-white font-bold text-sm leading-snug"
            style={{ fontFamily: 'Syne,sans-serif' }}
          >
            {test.title}
          </h3>
        </div>
        {hasBest && (
          <div className="shrink-0">
            <ScoreRing
              scored={test.bestScore}
              total={test.totalMarks}
              size={44}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-[11px] text-white/35">
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {test.duration} min
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={11} />
          {test.problems} problems
        </span>
        <span className="flex items-center gap-1.5">
          <Trophy size={11} />
          {test.totalMarks} marks
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {test.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded bg-white/5 border border-white/[0.07] text-white/35 text-[10px] flex items-center gap-1"
          >
            <Tag size={8} />
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-white/25">
          {test.attempts.toLocaleString()} attempts
        </span>
        {hasBest ? (
          <span className="text-[10px] text-emerald-400/70 font-bold">
            Best: {test.bestScore}/{test.totalMarks}
          </span>
        ) : (
          <span className="text-[10px] text-white/20">Not attempted</span>
        )}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40 transition-all text-[11px] font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest">
        <Zap size={12} /> {hasBest ? 'Retry Practice' : 'Start Practice'}
      </button>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'live', label: 'Live Now', icon: Zap, count: LIVE_TESTS.length },
  {
    id: 'upcoming',
    label: 'Upcoming',
    icon: Calendar,
    count: UPCOMING_TESTS.length,
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    count: COMPLETED_TESTS.length,
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: BookOpen,
    count: PRACTICE_TESTS.length,
  },
];

export  function StudentTests() {
  const [activeTab, setActiveTab] = useState('live');
  const [animKey, setAnimKey] = useState(0);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filterFn = (arr) => {
    return arr.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchDiff = diffFilter === 'All' || t.difficulty === diffFilter;
      return matchSearch && matchDiff;
    });
  };

  const filtered = {
    live: filterFn(LIVE_TESTS),
    upcoming: filterFn(UPCOMING_TESTS),
    completed: filterFn(COMPLETED_TESTS),
    practice: filterFn(PRACTICE_TESTS),
  };

  return (
    <div className="flex flex-col bg-[#020202] min-h-screen font-['DM_Sans',sans-serif] mt-12 md:mt-0">
      <style>{STYLES}</style>
      <Sidebar />

      <main className="lg:ml-[240px] flex flex-col min-h-screen relative dot-grid overflow-hidden">
        {/* Glow blobs */}
        {/* ── Page header ── */}
        <div className="relative z-10 border-b border-white/[0.06] px-6 pt-8 pb-0 bg-[#020202]/80 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-orange-500/70 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
                Student Portal
              </p>
              <h1
                className="text-white text-2xl font-black leading-tight"
                style={{ fontFamily: 'Syne,sans-serif' }}
              >
                My Tests
              </h1>
              <p className="text-white/30 text-sm mt-1">
                Track, attempt, and review all your assessments.
              </p>
            </div>

            {/* Live indicator */}
            {LIVE_TESTS.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse-ring shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-live-blip" />
                <span className="text-red-400 text-[11px] font-bold">
                  {LIVE_TESTS.length} Test Live
                </span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0 no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setAnimKey((k) => k + 1);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap border-b-2 -mb-px transition-all ${
                    isActive
                      ? 'text-orange-400 border-orange-500'
                      : 'text-white/30 border-transparent hover:text-white/50'
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-white/5 text-white/20'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Search + Filter bar ── */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-white/[0.04] bg-[#020202]/90 backdrop-blur-md sticky top-0 z-20 relative">
          <div className="flex-1 relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 "
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, subject, or tag…"
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2 text-[12px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  diffFilter === d
                    ? d === 'All'
                      ? 'bg-white/10 text-white'
                      : `${DIFF_STYLES[d]?.bg || 'bg-white/10'} ${DIFF_STYLES[d]?.text || 'text-white'} border border-current/20`
                    : 'text-white/25 hover:text-white/50 hover:bg-white/5'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="flex-1 px-6 py-6 relative z-10" key={animKey}>
          {/* Live Tests */}
          {activeTab === 'live' && (
            <div key={animKey + 'live'} className="tab-enter">
              {filtered.live.length === 0 ? (
                <EmptyState
                  icon={Zap}
                  message="No live tests right now."
                  sub="Check back when a test is scheduled."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 tab-grid-enter">
                  {filtered.live.map((t) => (
                    <LiveCard key={t.id} test={t} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Tests */}
          {activeTab === 'upcoming' && (
            <div key={animKey + 'upcoming'} className="tab-enter">
              {filtered.upcoming.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  message="No upcoming tests found."
                  sub="You're all clear — or try a different filter."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 tab-grid-enter">
                  {filtered.upcoming.map((t, i) => (
                    <UpcomingCard key={t.id} test={t} idx={i + 1} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Tests */}
          {activeTab === 'completed' && (
            <div key={animKey + 'completed'} className="tab-enter">
              {filtered.completed.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      label: 'Tests Taken',
                      value: COMPLETED_TESTS.length,
                      color: 'text-white',
                    },
                    {
                      label: 'Avg Score',
                      value:
                        Math.round(
                          COMPLETED_TESTS.reduce(
                            (a, t) => a + (t.scored / t.totalMarks) * 100,
                            0
                          ) / COMPLETED_TESTS.length
                        ) + '%',
                      color: 'text-emerald-400',
                    },
                    {
                      label: 'Best Grade',
                      value: 'A+',
                      color: 'text-orange-400',
                    },
                    {
                      label: 'Partial Marks Earned',
                      value: COMPLETED_TESTS.reduce(
                        (a, t) => a + t.partialMarks,
                        0
                      ),
                      color: 'text-blue-400',
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-[#0d0d0f]/80 border border-white/[0.07] p-4"
                    >
                      <div className="text-white/25 text-[10px] uppercase tracking-widest mb-1">
                        {s.label}
                      </div>
                      <div
                        className={`text-xl font-black ${s.color}`}
                        style={{ fontFamily: 'Syne,sans-serif' }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filtered.completed.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  message="No completed tests found."
                  sub="Attempt a test to see results here."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 tab-grid-enter">
                  {filtered.completed.map((t, i) => (
                    <CompletedCard key={t.id} test={t} idx={i + 1} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Practice Tests */}
          {activeTab === 'practice' && (
            <div key={animKey + 'practice'} className="tab-enter">
              {filtered.practice.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  message="No practice tests found."
                  sub="Try a different search or filter."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 tab-grid-enter">
                  {filtered.practice.map((t, i) => (
                    <PracticeCard key={t.id} test={t} idx={i + 1} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon size={22} className="text-white/15" />
      </div>
      <p className="text-white/40 text-sm font-semibold mb-1">{message}</p>
      <p className="text-white/20 text-xs">{sub}</p>
    </div>
  );
}
