import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Flame,
  TrendingUp,
  TrendingDown,
  Award,
  Code2,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Zap,
  Target,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';

// ─── Data (unchanged) ────────────────────────────────────────────────────────
const SUMMARY_STATS = [
  { label: 'Total Tests', value: '42', trend: '+5', up: true, icon: BookOpen },
  {
    label: 'Average Score',
    value: '84%',
    trend: '+2%',
    up: true,
    icon: TrendingUp,
  },
  { label: 'Best Score', value: '100', trend: '0', up: true, icon: Award },
  {
    label: 'Current Streak',
    value: '12',
    trend: 'days',
    up: true,
    icon: Flame,
  },
];
const SCORE_TREND = [
  { name: 'W1', score: 65 },
  { name: 'W2', score: 78 },
  { name: 'W3', score: 72 },
  { name: 'W4', score: 85 },
  { name: 'W5', score: 82 },
  { name: 'W6', score: 94 },
];
const TOPIC_MASTERY = [
  { subject: 'Arrays', A: 95 },
  { subject: 'Strings', A: 80 },
  { subject: 'Recursion', A: 45 },
  { subject: 'Loops', A: 90 },
  { subject: 'Functions', A: 85 },
];
const LANGUAGE_DATA = [
  { name: 'JavaScript', value: 65 },
  { name: 'Python', value: 25 },
  { name: 'Java', value: 10 },
];
const PIE_COLORS = ['#f97316', '#fb923c', '#fdba74'];
const TEST_HISTORY = [
  {
    id: '#450',
    name: 'Linked List Reversal',
    date: 'Feb 20',
    score: 100,
    status: 'Full Marks',
  },
  {
    id: '#442',
    name: 'N-Queens II',
    date: 'Feb 18',
    score: 75,
    status: 'Partial',
  },
  {
    id: '#439',
    name: 'DFS/BFS Traversal',
    date: 'Feb 15',
    score: 40,
    status: 'Needs Work',
  },
];
const FEEDBACK = [
  {
    test: 'Binary Tree Level Order',
    error: 'Failed 2/12 test cases',
    msg: 'Memory limit exceeded on large tree inputs.',
    time: 'Today, 10:24 AM',
  },
  {
    test: 'Palindromic Substrings',
    error: 'Partial Score (70%)',
    msg: 'Time complexity is O(N³). Optimize to O(N²) using DP.',
    time: 'Yesterday',
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  :root { --orange: #f97316; }
  .syne { font-family: 'Syne', sans-serif; }
  .dm { font-family: 'DM Sans', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .dot-grid { background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 30px 30px; }
  .scroll-y { overflow-y: auto; overflow-x: hidden; }
  .scroll-y::-webkit-scrollbar { width: 3px; }
  .scroll-y::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.2); border-radius: 99px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .fu { animation: fadeUp 0.5s ease both; }
  .hero-name { font-size: clamp(32px, 5vw, 72px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.9; color: #fff; }
  .stat-hero { border-radius: 24px; overflow: hidden; transition: transform 0.2s ease; }
  .streak-hero { background: linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%); }
  .stat-normal { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); }
  .ticker-inner { display: inline-flex; gap: 40px; animation: ticker 18s linear infinite; }
  .chart-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; overflow: hidden; }
  .badge-full { background:rgba(52,211,153,.12); color:rgb(52,211,153); border:1px solid rgba(52,211,153,.25); }
  .badge-partial { background:rgba(249,115,22,.12); color:rgb(249,115,22); border:1px solid rgba(249,115,22,.25); }
  .badge-needs { background:rgba(248,113,113,.12);color:rgb(248,113,113); border:1px solid rgba(248,113,113,.25); }
  .review-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5); font-size: 10px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
  .feed-card:hover .review-btn { background: var(--orange); color: #000; border-color: var(--orange); }
`;

export  function StudentAnalytics() {
  return (
    <div
      className="flex min-h-screen dot-grid dm md:mt-0 mt-5"
      style={{ background: '#020204', position: 'relative' }}
    >
      <style>{STYLES}</style>
      <Sidebar />
      <main className="flex-1 lg:ml-64 scroll-y relative z-10">
        {/* HERO SECTION - Responsive Padding */}
        <div className="px-6 md:px-10 pt-12 pb-0 border-b border-white/[0.05]">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="fu">
              <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f97316]/60 mb-2">
                Student Analytics
              </div>
              <h1 className="hero-name syne">
                SIDDHARTH
                <br />
                <span style={{ color: '#f97316' }}>NILEKANI</span>
              </h1>
              <div className="flex items-center gap-3 mt-4 text-[11px] text-white/25 uppercase font-semibold tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                1RV22CS001 · Active 2h ago
              </div>
            </div>

            <motion.div
              className="stat-hero streak-hero fu p-6 md:p-8 min-w-full md:min-w-[280px]"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">
                    Active Streak
                  </div>
                  <div className="syne text-5xl font-extrabold text-white">
                    12
                  </div>
                  <div className="text-xs font-semibold text-white/60">
                    consecutive days
                  </div>
                </div>
                <Flame size={48} className="text-white fill-white" />
              </div>
            </motion.div>
          </div>

          <div
            className="ticker-wrap fu mt-8 pb-5 opacity-0"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="ticker-inner text-[10px] font-bold text-white/10 uppercase tracking-widest">
              {[
                '42 Total Tests',
                '84% Avg Score',
                '100 Best Score',
                '12 Day Streak',
                'JavaScript 65%',
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-4">
                  {item} <span className="text-orange-500/30">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TOP STAT CARDS - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 px-6 md:px-10 py-8">
          {SUMMARY_STATS.slice(0, 3).map((s, i) => (
            <div
              key={i}
              className="stat-hero stat-normal fu p-6"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40">
                  <s.icon size={16} />
                </div>
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold ${s.up ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{' '}
                  {s.trend}
                </div>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-1">
                {s.label}
              </div>
              <div className="syne text-4xl font-extrabold text-[#f97316]">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID - Responsive Column Swapping */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 px-6 md:px-10 pb-10">
          {/* LEFT CONTENT (8 Cols) */}
          <div className="xl:col-span-8 space-y-5">
            <div className="chart-card fu p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#f97316]/60 mb-1">
                    Performance
                  </div>
                  <h2 className="syne text-xl font-bold text-white uppercase">
                    Score Trend
                  </h2>
                </div>
                <div className="text-[12px] font-bold text-emerald-400 flex items-center gap-2">
                  <ArrowUpRight size={14} /> +12pts vs last week
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SCORE_TREND}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.15)"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#f97316"
                      strokeWidth={2}
                      fill="url(#sg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card fu overflow-x-auto">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="syne text-lg font-bold text-white uppercase">
                  Test History
                </h2>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  3 Entries
                </span>
              </div>
              <div className="min-w-[600px]">
                {TEST_HISTORY.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <div className="mono text-[10px] font-bold text-emerald-400 w-12">
                      {t.score}%
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-white/20 mono mt-1">
                        {t.id} · {t.date}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${t.status === 'Full Marks' ? 'badge-full' : t.status === 'Partial' ? 'badge-partial' : 'badge-needs'}`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT (4 Cols) */}
          <div className="xl:col-span-4 space-y-5">
            <div className="chart-card fu p-6">
              <h2 className="syne text-lg font-bold text-white uppercase mb-6">
                Topic Mastery
              </h2>
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={TOPIC_MASTERY}
                  >
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                    />
                    <Radar
                      dataKey="A"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {TOPIC_MASTERY.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                      <span className="text-white/40">{t.subject}</span>
                      <span className="text-white">{t.A}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${t.A}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card fu p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
              <div className="flex items-center gap-2 mb-4 text-[#f97316] font-bold text-[10px] uppercase tracking-widest">
                <Target size={14} /> AI Insight
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Your <span className="text-white font-bold">Recursion</span>{' '}
                score is below average. Solve 3 more recursion problems to
                increase your profile score by{' '}
                <span className="text-emerald-400">+12%</span>.
              </p>
            </div>
          </div>

          {/* FULL WIDTH HEATMAP */}
          <div className="xl:col-span-12 chart-card fu p-6">
            <h2 className="syne text-lg font-bold text-white uppercase mb-6">
              Activity Heatmap
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 91 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] bg-orange-500"
                  style={{
                    opacity: i % 7 === 0 ? 1 : i % 3 === 0 ? 0.4 : 0.05,
                  }}
                />
              ))}
            </div>
          </div>

          {/* FEEDBACK - Stacking Grid */}
          <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
            {FEEDBACK.map((f, i) => (
              <div key={i} className="chart-card fu p-6 feed-card">
                <div className="flex gap-4 items-start mb-4">
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{f.test}</h3>
                    <span className="text-[10px] font-bold uppercase text-red-400 tracking-widest">
                      {f.error}
                    </span>
                  </div>
                </div>
                <p className="text-white/40 text-sm mb-6 leading-relaxed">
                  {f.msg}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold text-white/20 uppercase">
                    {f.time}
                  </span>
                  <button className="review-btn">
                    Review <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
