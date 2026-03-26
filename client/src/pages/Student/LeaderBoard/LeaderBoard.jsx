import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  ChevronUp,
  ChevronDown,
  Minus,
  Search,
  Filter,
  Lock,
  Flame,
  Zap,
  Bug,
  Target,
  Calendar,
  Award,
  ArrowUpRight,
  Sparkles,
  Menu,
} from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';

// ─── Data (unchanged) ────────────────────────────────────────────────────────
const THEME = {
  bg: '#020202',
  surface: '#0d1117',
  accent: '#f97316',
  border: 'border-white/10',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

const TOP_3 = [
  {
    rank: 2,
    name: 'Arjun Mehta',
    usn: '1RV22CS012',
    score: 2850,
    badges: 14,
    color: THEME.silver,
  },
  {
    rank: 1,
    name: 'Sarfaraz',
    usn: '1RV22CS045',
    score: 3120,
    badges: 18,
    color: THEME.gold,
  },
  {
    rank: 3,
    name: 'Priya Sharma',
    usn: '1RV22IS088',
    score: 2710,
    badges: 12,
    color: THEME.bronze,
  },
];

const BOARD_DATA = [
  {
    rank: 4,
    name: 'Vikram Singh',
    usn: '1RV22CS150',
    score: 2650,
    tests: 42,
    accuracy: 92,
    change: 'up',
    badges: 8,
  },
  {
    rank: 5,
    name: 'Siddharth',
    usn: '1RV22CS001',
    score: 2580,
    tests: 38,
    accuracy: 88,
    change: 'none',
    badges: 10,
    isUser: true,
  },
  {
    rank: 6,
    name: 'Ananya Iyer',
    usn: '1RV22EC022',
    score: 2420,
    tests: 35,
    accuracy: 85,
    change: 'down',
    badges: 7,
  },
  {
    rank: 7,
    name: 'Rohan Gupta',
    usn: '1RV22CS110',
    score: 2390,
    tests: 40,
    accuracy: 82,
    change: 'up',
    badges: 6,
  },
];

const BADGES = [
  { name: '7-Day Streak', icon: Flame, earned: true },
  { name: '100% Score', icon: Target, earned: true },
  { name: 'Speed Coder', icon: Zap, earned: true },
  { name: 'Bug Slayer', icon: Bug, earned: false },
  { name: 'Consistent', icon: Calendar, earned: false },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing:border-box; }
  .syne  { font-family:'Syne',sans-serif; }
  .dm    { font-family:'DM Sans',sans-serif; }
  .mono  { font-family:'JetBrains Mono',monospace; }

  .dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .scroll-thin::-webkit-scrollbar { height:3px; width:3px; }
  .scroll-thin::-webkit-scrollbar-thumb { background:rgba(249,115,22,0.25); border-radius:99px; }
  .no-sb::-webkit-scrollbar { display:none; } .no-sb { -ms-overflow-style:none; scrollbar-width:none; }

  .orb { position:fixed; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes crownBob { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
  @keyframes goldPulse{ 0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.2)} 50%{box-shadow:0 0 40px rgba(255,215,0,0.4)} }
  @keyframes barGrow  { from{width:0} }

  .fu { animation:fadeUp .5s ease both; }

  .podium-card {
    border-radius:24px; overflow:hidden; position:relative;
    transition:transform .2s ease;
  }

  .podium-1 {
    background:linear-gradient(160deg,rgba(255,215,0,0.08) 0%,rgba(255,215,0,0.02) 100%);
    border:1px solid rgba(255,215,0,0.3);
    animation: goldPulse 3s ease infinite;
  }
  .podium-2, .podium-3 {
    background:rgba(255,255,255,0.025);
    border:1px solid rgba(255,255,255,0.1);
  }

  .rank-row {
    position:relative;
    border-bottom:1px solid rgba(255,255,255,0.04);
    transition:background .15s;
    cursor:pointer;
  }
  .rank-row.is-user { background:rgba(249,115,22,0.06); }
  .rank-row.is-user::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    background:#f97316;
  }

  .card {
    background:rgba(13,13,18,0.95);
    border:1px solid rgba(255,255,255,0.06);
    border-radius:24px;
    overflow:hidden;
  }

  .badge-chip {
    display:inline-flex; align-items:center; gap:8px;
    padding:8px 14px; border-radius:14px; white-space:nowrap;
  }

  .standing-card {
    background:rgba(13,13,18,0.95);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:24px; overflow:hidden; position:relative;
  }

  .tf-pill { border-radius:99px; border:1px solid rgba(255,255,255,0.07); display:flex; overflow:hidden; }
  .tf-btn  { padding:6px 18px; font-size:10px; font-weight:700; text-transform:uppercase; cursor:pointer; border:none; transition:all .15s; }

  .slabel { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.3em; color:rgba(249,115,22,0.6); margin-bottom:6px; }

  .search-input {
    width:100%; background:rgba(0,0,0,0.4);
    border:1px solid rgba(255,255,255,0.07); border-radius:14px;
    padding:10px 12px 10px 40px; font-size:12px; color:rgba(255,255,255,0.7);
    outline:none; font-family:'DM Sans',sans-serif;
  }

  .ticker-inner { display:inline-flex; gap:32px; animation:ticker 22s linear infinite; }

  .improved-card {
    border-radius:20px; padding:18px 20px;
    background:rgba(249,115,22,0.05);
    border:1px solid rgba(249,115,22,0.18);
  }
    
`;

function CountUp({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let s = 0,
      e = value;
    const step = Math.ceil(e / 50);
    const t = setInterval(() => {
      s += step;
      if (s >= e) {
        setCount(e);
        clearInterval(t);
      } else setCount(s);
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <span>{count.toLocaleString()}</span>;
}

function PodiumCard({ data, variant }) {
  const isFirst = variant === 1;
  const metalColor =
    variant === 1 ? THEME.gold : variant === 2 ? THEME.silver : THEME.bronze;
  const delay = variant === 1 ? 0 : variant === 2 ? 0.15 : 0.25;

  return (
    <motion.div
      className={`podium-card podium-${variant} fu`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: isFirst ? '36px 28px' : '26px 22px',
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: isFirst ? 20 : 14,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          {variant === 1 ? '1st' : variant === 2 ? '2nd' : '3rd'} Place
        </span>
        {isFirst && (
          <Crown
            size={22}
            fill={THEME.gold}
            stroke={THEME.gold}
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' }}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: isFirst ? 72 : 56,
            height: isFirst ? 72 : 56,
            borderRadius: '50%',
            border: `2.5px solid ${metalColor}`,
            boxShadow: `0 0 20px ${metalColor}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isFirst ? 24 : 18,
            fontWeight: 800,
            color: metalColor,
            fontFamily: 'Syne',
          }}
        >
          {data.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <h3
          className="syne"
          style={{
            color: '#fff',
            fontWeight: 800,
            fontSize: isFirst ? 20 : 16,
            marginTop: 12,
          }}
        >
          {data.name}
        </h3>
        <p
          className="mono"
          style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}
        >
          {data.usn}
        </p>
      </div>
      <div
        style={{
          textAlign: 'center',
          borderTop: `1px solid ${metalColor}22`,
          paddingTop: 12,
        }}
      >
        <div
          className="syne"
          style={{
            fontSize: isFirst ? 40 : 30,
            fontWeight: 800,
            color: metalColor,
          }}
        >
          <CountUp value={data.score} />
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('Weekly');
  const [search, setSearch] = useState('');

  const filtered = BOARD_DATA.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.usn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="flex min-h-screen dot-grid dm md:mt-0 mt-5"
      style={{ background: '#020204', position: 'relative', color: '#fff' }}
    >
      <style>{STYLES}</style>
      <Sidebar />

      <main
        className="flex-1 lg:ml-64 scroll-thin"
        style={{
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          minHeight: '100vh',
        }}
      >
        {/* HERO HEADER - Responsive */}
        <div
          className="px-6 md:px-10 lg:px-12"
          style={{
            paddingTop: '44px',
            paddingBottom: '0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="flex flex-col lg:flex-row items-start justify-between gap-6"
            style={{
              marginBottom: '24px',
            }}
          >
            <div className="fu">
              <div className="slabel">Class of 2026 · CSE</div>
              <h1
                className="syne"
                style={{
                  fontSize: 'clamp(32px, 6vw, 80px)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  margin: 0,
                }}
              >
                LEADER
                <br />
                <span style={{ color: '#f97316' }}>BOARD</span>
              </h1>
            </div>
            <div className="fu tf-pill bg-white/5">
              {['Weekly', 'Monthly', 'All-time'].map((t) => (
                <button
                  key={t}
                  className="tf-btn"
                  onClick={() => setTimeframe(t)}
                  style={{
                    background: timeframe === t ? '#f97316' : 'transparent',
                    color: timeframe === t ? '#000' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="ticker-wrap fu pb-5">
            <div className="ticker-inner">
              {[
                '#1 Sarfaraz · 3120pts',
                '#2 Arjun · 2850pts',
                'Most Improved: Vikram +12',
              ].map((item, i) => (
                <span
                  key={i}
                  style={{
                    color: 'rgba(255,255,255,0.1)',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {item} ◆{' '}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 lg:p-12">
          {/* PODIUM - Stacks on Mobile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              alignItems: 'end',
              marginBottom: 36,
            }}
          >
            <div className="order-2 lg:order-1">
              <PodiumCard data={TOP_3[0]} variant={2} />
            </div>
            <div className="order-1 lg:order-2">
              <PodiumCard data={TOP_3[1]} variant={1} />
            </div>
            <div className="order-3 lg:order-3">
              <PodiumCard data={TOP_3[2]} variant={3} />
            </div>
          </div>

          {/* MAIN GRID - Responsive Column Stacking */}
          <div className="main-grid">
            {/* LEFT: Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card p-4">
                <div style={{ position: 'relative' }}>
                  <Search
                    size={13}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <input
                    className="search-input"
                    placeholder="Search by name or USN…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="card overflow-x-auto no-sb">
                <div className="min-w-[600px] md:min-w-0">
                  <div
                    className="grid grid-cols-[60px_1fr_100px_70px_70px] md:grid-cols-[60px_1fr_120px_80px_80px] gap-4 md:gap-0 p-3 md:p-6"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      Rank
                    </div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      Student
                    </div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">
                      Score
                    </div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">
                      Acc.
                    </div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">
                      Badges
                    </div>
                  </div>
                  {filtered.map((row, i) => (
                    <div
                      key={row.usn}
                      className={`rank-row ${row.isUser ? 'is-user' : ''} grid grid-cols-[60px_1fr_100px_70px_70px] md:grid-cols-[60px_1fr_120px_80px_80px] gap-4 md:gap-0 p-4 md:p-6 items-center`}
                    >
                      <span className="rank-num">{row.rank}</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 800,
                            color: row.isUser ? '#f97316' : '#fff',
                          }}
                        >
                          {row.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            {row.name}
                          </div>
                          <div
                            className="mono"
                            style={{
                              fontSize: 9,
                              color: 'rgba(255,255,255,0.2)',
                            }}
                          >
                            {row.usn}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ textAlign: 'right', fontWeight: 800 }}
                        className="syne"
                      >
                        {row.score.toLocaleString()}
                      </div>
                      <div
                        style={{
                          textAlign: 'right',
                          fontWeight: 700,
                          color: '#f97316',
                        }}
                      >
                        {row.accuracy}%
                      </div>
                      <div
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Award size={14} style={{ color: '#f97316' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar Cards - Now moves below table on mobile automatically via main-grid class */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="standing-card p-7 mt-4">
                <div className="slabel">Your Standing</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    className="syne"
                    style={{
                      fontSize: 80,
                      fontWeight: 800,
                      color: '#f97316',
                      lineHeight: 1,
                    }}
                  >
                    #5
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="slabel">Best</div>
                    <div className="syne" style={{ fontSize: 22 }}>
                      #2
                    </div>
                  </div>
                </div>
                <div className="prog-track mt-6">
                  <motion.div
                    className="prog-fill"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                  />
                </div>
              </div>
              <div className="improved-card">
                <div className="slabel">🔥 Improved</div>
                <div style={{ fontWeight: 700 }}>Vikram Singh +12 Ranks</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
