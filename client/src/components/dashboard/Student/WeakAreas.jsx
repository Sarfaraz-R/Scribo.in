import React from 'react';
import { motion } from 'framer-motion';

const WeakAreas = () => {
  // Topic data focused on DSA priorities
  const topics = [
    { name: 'DP', val: 38 },
    { name: 'Arrays', val: 45 },
    { name: 'Recursion', val: 52 },
    { name: 'Graphs', val: 65 },
    { name: 'Strings', val: 78 },
  ];

  const getColorClasses = (val) => {
    if (val < 50) return { bg: 'bg-red-500', text: 'text-red-400' };
    if (val <= 70) return { bg: 'bg-amber-500', text: 'text-amber-400' };
    return { bg: 'bg-teal-500', text: 'text-teal-400' };
  };

  return (
    <div className="bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl p-5 font-['DM_Sans'] shadow-2xl h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold font-['Syne'] text-sm uppercase tracking-widest">
          Weak Areas
        </h3>
        <span className="text-sm">🎯</span>
      </div>

      {/* --- TOPIC ROWS --- */}
      <div className="flex-1 space-y-4 mt-2">
        {topics.map((topic, index) => {
          const colors = getColorClasses(topic.val);

          return (
            <div key={topic.name} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white font-medium">
                  {topic.name}
                </span>
                <span
                  className={`text-xs font-black tabular-nums ${colors.text}`}
                >
                  {topic.val}%
                </span>
              </div>

              {/* Mastery Track */}
              <div className="w-full h-[3px] bg-[#1e2d3d] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.val}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                  className={`h-full rounded-full ${colors.bg}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* --- FOOTER STRIP --- */}
      <div className="mt-4 pt-3 border-t border-[#1e2d3d] flex justify-between items-center">
        <button className="text-[#f97316] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">
          Start with {topics[0].name} →
        </button>
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          {topics.length} topics tracked
        </span>
      </div>
    </div>
  );
};

export default WeakAreas;
