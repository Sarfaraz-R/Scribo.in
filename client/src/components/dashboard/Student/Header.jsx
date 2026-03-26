import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Stats from './Stats';
import { useSelector } from 'react-redux';
const Header = () => {
  const [now, setNow] = useState(new Date());
  const user = useSelector((s)=>s.auth.user.name);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const isMorning = hours < 12;
  const isAfternoon = hours >= 12 && hours < 17;

  const greeting = isMorning
    ? `Good Morning, ${user}.`
    : isAfternoon
      ? `Good Afternoon, ${user}.`
      : `Good Evening, ${user}.`;

  const solveDays = [1, 3, 4, 7, 8, 11, 14, 16, 18, 20, 21];

  return (
    <>
      <style>{`
        @keyframes emoji-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 md:mt-0 relative w-full flex flex-col lg:flex-row items-start justify-between gap-6"
      >
        {/* LEFT COLUMN: GREETING + CLOCK + STATS */}
        <div className="flex gap-5 flex-1 min-w-0">
          {/* Orange accent line */}
          <div className="w-[2px] bg-[#f97316] rounded-full mt-8 shadow-[0_0_10px_rgba(249,115,22,0.4)] shrink-0 self-stretch" />

          {/* Content */}
          <div className="flex flex-col pt-2 gap-4 flex-1 min-w-0">
            {/* Greeting */}
            <div>
              <span className="text-[10px] font-black tracking-[0.4em] text-[#3a4a5a] uppercase mb-1 block">
                Dashboard
              </span>
              <h2 className="text-white text-2xl md:text-[32px] font-bold font-['Syne'] tracking-tight leading-tight">
                {greeting}
              </h2>
              <p className="text-[#f97316] text-lg md:text-[22px] font-bold font-['Syne'] tabular-nums tracking-widest mt-1">
                {now.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </p>
              <p className="text-[#3a4a5a] text-[10px] font-bold tracking-[0.15em] uppercase mt-1">
                {now.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Stats sits directly below clock — fills the empty space */}
            <Stats />
          </div>
        </div>

        {/* RIGHT: STREAK CALENDAR */}
        <div className="w-full lg:w-[340px] bg-[#020202] border border-[#1e2d3d] rounded-2xl p-5 backdrop-blur-[10px] shadow-[inset_0_0_40px_rgba(249,115,22,0.03)] hover:border-[#2a3a4a] transition-all duration-300 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-[13px] font-bold font-['Syne'] uppercase tracking-wider">
              {now.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div className="bg-[#1c1000] border border-[#f97316]/40 rounded-xl px-3 py-1 flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <span className="text-xs">🔥</span>
              <span className="text-[#f97316] text-[11px] font-black italic tracking-tight">
                21 day streak
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div
                key={i}
                className="text-center text-[10px] font-black text-[#3a4a5a]"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {[...Array(28)].map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 21;
              const isPast = dayNum <= 21;
              const isSolved = solveDays.includes(dayNum);

              return (
                <div
                  key={i}
                  className={`h-8 w-full rounded-lg flex items-center justify-center transition-all duration-300
                    ${isSolved && isPast ? 'bg-[#f97316]/10' : ''}
                    ${isToday ? 'ring-1 ring-[#f97316]/60 shadow-[0_0_10px_rgba(249,115,22,0.25)]' : ''}
                  `}
                >
                  {isSolved ? (
                    <span
                      className={`text-sm ${isToday ? 'animate-pulse' : ''}`}
                    >
                      🔥
                    </span>
                  ) : (
                    <span
                      className={`text-[11px] font-bold ${isPast ? 'text-gray-600' : 'text-gray-700'}`}
                    >
                      {dayNum}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-[#1e2d3d] flex justify-between items-center">
            <span className="text-[#f97316] text-[10px] font-black uppercase tracking-wider">
              🔥 21 days strong
            </span>
            <span className="text-[#3a4a5a] text-[10px] font-bold">
              Best: 28 days 🏆
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Header;
