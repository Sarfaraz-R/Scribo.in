import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="w-full flex items-center bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl relative overflow-hidden font-['DM_Sans']"
    >
      {/* Left accent bar */}
      <div className="hidden md:block w-[3px] h-8 bg-[#f97316] rounded-full ml-4 shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />

      {/* Stats row — always 1x4, shrinks on small screens */}
      <div className="flex-1 flex items-center justify-between px-2 py-3 md:px-4 md:py-4">
        <StatSection
          label="Last Score"
          targetValue={74}
          suffix="/100"
          accentClass="text-[#f97316]"
          trend="+6 pts"
          trendUp
        />

        <div className="w-[1px] h-6 bg-[#1e2d3d] shrink-0" />

        <StatSection
          label="Tests"
          targetValue={18}
          accentClass="text-white"
          trend="3 this month"
        />

        <div className="w-[1px] h-6 bg-[#1e2d3d] shrink-0" />

        <StatSection
          label="Avg Score"
          targetValue={68}
          suffix="%"
          accentClass="text-teal-400"
          trend="Above avg"
          trendUp
        />

        <div className="w-[1px] h-6 bg-[#1e2d3d] shrink-0" />

        <StatSection
          label="Rank"
          targetValue={4}
          prefix="#"
          accentClass="text-white"
          trend="Top 10%"
          trendUp
        />
      </div>
    </motion.div>
  );
};

const StatSection = ({
  label,
  targetValue,
  prefix,
  suffix,
  accentClass,
  trend,
  trendUp,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = targetValue / (1500 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <div className="flex-1 flex flex-col items-center hover:bg-[#111820] rounded-xl py-1.5 px-1 transition-all duration-200 cursor-default">
      <span className="text-[8px] md:text-[10px] text-[#3a4a5a] font-black uppercase tracking-widest mb-1 text-center">
        {label}
      </span>
      <div className="flex items-baseline gap-0.5">
        {prefix && (
          <span className="text-gray-500 text-[10px] md:text-sm font-bold">
            {prefix}
          </span>
        )}
        <h4
          className={`text-base md:text-xl font-bold font-['Syne'] leading-none ${accentClass}`}
        >
          {count}
        </h4>
        {suffix && (
          <span className="text-gray-500 text-[10px] md:text-sm font-bold">
            {suffix}
          </span>
        )}
      </div>
      <span
        className={`text-[8px] md:text-[10px] mt-0.5 font-bold text-center ${trendUp ? 'text-emerald-500' : 'text-[#3a4a5a]'}`}
      >
        {trend}
      </span>
    </div>
  );
};

export default Stats;
