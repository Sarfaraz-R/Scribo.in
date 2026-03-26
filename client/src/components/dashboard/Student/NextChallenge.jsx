import React from 'react';
import { motion } from 'framer-motion';

const NextChallenge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl p-6 relative overflow-hidden font-['DM_Sans'] shadow-2xl"
    >
      {/* Decorative Background Element */}
      <div className="absolute -bottom-6 -right-4 text-[140px] font-mono text-white/[0.015] font-black rotate-12 select-none pointer-events-none leading-none z-0">
        {'</>'}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* --- LEFT SIDE: CONTENT --- */}
        <div className="flex-1">
          <span className="text-[#f97316] text-[10px] font-black tracking-[0.2em] uppercase">
            Recommended for you
          </span>

          <h2 className="text-white font-['Syne'] text-2xl font-bold mt-1 tracking-tight">
            Maximum Subarray Sum
          </h2>

          {/* Tag Chips Row */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
              Arrays
            </span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
              Medium
            </span>
            <span className="bg-white/5 text-gray-400 border border-white/10 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
              45 min
            </span>
          </div>

          <p className="mt-4 text-sm text-[#3a4a5a] font-medium leading-relaxed max-w-lg">
            Find the contiguous subarray (containing at least one number) which
            has the largest sum and return its sum.
          </p>

          {/* Stats Row */}
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-teal-400 text-xs font-black">
                ⚡ 120 XP
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-xs font-black uppercase tracking-tighter">
                🏆 Medium
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#3a4a5a] text-xs font-bold uppercase tracking-tighter">
                👥 4,521 solved
              </span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: ACTIONS --- */}
        <div className="shrink-0 flex flex-col items-center">
          <button className="bg-[#f97316] text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] hover:scale-105 transition-all duration-200 active:scale-95">
            Start Challenge →
          </button>

          <button className="mt-3 text-[#3a4a5a] text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors duration-200">
            Skip →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NextChallenge;
