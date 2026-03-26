import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UrgentTests = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock Data: Ensuring brand consistency with Syne/DM Sans
  const tests = [
    {
      id: 1,
      name: 'Data Structures Mid-Term',
      subject: 'Advanced DSA',
      faculty: 'Dr. Rajesh Koothrappali',
      startTime: new Date(new Date().setHours(14, 0, 0, 0)), // Today at 2 PM
      duration: 90,
      totalMarks: 100,
      isToday: true,
      urgency: 'orange',
    },
    {
      id: 2,
      name: 'Algorithm Lab Quiz',
      subject: 'Analysis of Algorithms',
      faculty: 'Prof. Snape',
      startTime: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      duration: 45,
      totalMarks: 50,
      isToday: false,
      urgency: 'amber',
    },
  ];

  const formatCountdown = (target) => {
    const diff = target - now;
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600000)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000)
      .toString()
      .padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const todayTest = tests.find((t) => t.isToday);
  const upcomingTests = tests.filter((t) => !t.isToday);

  if (tests.length === 0) {
    return (
      <div className="bg-[#0b0f16] border border-dashed border-[#1e2d3d] rounded-2xl p-8 flex flex-col items-center justify-center text-center font-['DM_Sans']">
        <span className="text-3xl">✅</span>
        <h3 className="text-white text-base font-bold mt-2 font-['Syne']">
          All clear!
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          No upcoming tests. You're free to practice at your own pace.
        </p>
        <button className="mt-4 border border-[#f97316]/40 text-[#f97316] rounded-xl px-5 py-2 text-sm hover:bg-[#f97316]/10 transition-all">
          Start Practicing →
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="font-['DM_Sans']"
    >
      <style>{`
        @keyframes shimmer-line {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
        .animate-shimmer {
          animation: shimmer-line 2.5s linear infinite;
        }
      `}</style>

      {/* --- CASE 1: URGENT BANNER (Today's Test) --- */}
      {todayTest && (
        <div className="bg-[#0d0800] border border-[#f97316]/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(249,115,22,0.08)] relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            {/* Left Side */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
                <span className="text-[#f97316] text-[10px] font-black tracking-widest uppercase">
                  Live Today
                </span>
              </div>
              <div>
                <h2 className="text-white font-bold font-['Syne'] text-[20px] leading-tight">
                  {todayTest.name}
                </h2>
                <p className="text-gray-500 text-xs mt-1">
                  {todayTest.subject} by {todayTest.faculty}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">⚡ Starts in</span>
                <span className="text-[#f97316] font-bold text-sm tabular-nums">
                  {formatCountdown(todayTest.startTime)}
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">
                    Duration:
                  </span>
                  <span className="text-white text-sm font-bold">
                    {todayTest.duration}m
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">
                    Marks:
                  </span>
                  <span className="text-white text-sm font-bold">
                    {todayTest.totalMarks}
                  </span>
                </div>
              </div>
              <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-105 transition-all">
                Join Now →
              </button>
            </div>
          </div>

          {/* Animated Shimmer Line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-[#f97316]/60 to-transparent animate-shimmer" />
          </div>
        </div>
      )}

      {/* --- UPCOMING LIST (Not Today) --- */}
      <div className="mt-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-sm font-bold font-['Syne'] uppercase tracking-wider">
            Next Up
          </h3>
          <button className="text-[#f97316] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">
            View All →
          </button>
        </div>

        <div className="space-y-2">
          {upcomingTests.map((test) => (
            <div
              key={test.id}
              className="bg-[#0b0f16] border border-[#1e2d3d] rounded-xl p-4 flex items-center gap-4 hover:border-[#2a3a4a] transition-all group"
            >
              {/* Urgency Strip */}
              <div
                className={`w-[3px] rounded-full self-stretch ${test.urgency === 'amber' ? 'bg-amber-500' : 'bg-gray-600'}`}
              />

              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-bold truncate">
                  {test.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#161e28] text-gray-500 text-[9px] px-2 py-0.5 rounded border border-[#1e2d3d] uppercase font-bold tracking-tighter">
                    {test.subject}
                  </span>
                  <span className="text-gray-600 text-xs font-medium truncate">
                    • {test.faculty}
                  </span>
                </div>
                <p className="text-gray-600 text-[10px] font-bold mt-2 uppercase tracking-tight">
                  {test.startTime.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at{' '}
                  {test.startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-white/5 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {test.duration}m
                </span>
                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
                  Scheduled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UrgentTests;
