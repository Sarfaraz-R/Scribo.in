import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RankingAnalytics = () => {
  const [percentile, setPercentile] = useState(100);
  const scores = [55, 58, 60, 62, 61, 65, 68, 64, 70, 68, 72, 74];

  // Percentile Count-down Animation
  useEffect(() => {
    let start = 100;
    const end = 6.5;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const decrement = (start - end) / steps;

    const timer = setInterval(() => {
      start -= decrement;
      if (start <= end) {
        setPercentile(end);
        clearInterval(timer);
      } else {
        setPercentile(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, []);

  // SVG Mapping for Smoothing Curve
  const width = 500;
  const height = 100;
  const points = scores.map((score, i) => ({
    x: (i * width) / (scores.length - 1),
    y: height - ((score - 40) / 60) * height,
  }));

  const polylinePath = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath =
    `M 0,${height} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(' ') +
    ` L ${width},${height} Z`;

  // Bell Curve Simulation for Percentile Bars
  const bellCurveHeights = [
    10, 15, 25, 40, 60, 80, 95, 100, 95, 80, 65, 50, 40, 30, 22, 18, 14, 10, 8,
    5,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-5 bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl overflow-hidden font-['DM_Sans'] shadow-2xl"
    >
      <style>{`
        @keyframes drawLine { from { stroke-dashoffset: 800; } to { stroke-dashoffset: 0; } }
        .animate-curve { stroke-dasharray: 800; stroke-dashoffset: 800; animation: drawLine 1.5s ease-out forwards; }
      `}</style>

      {/* --- LEFT PANEL: SCORE TREND --- */}
      <div className="col-span-3 p-5 flex flex-col border-r border-[#1e2d3d]">
        <div className="flex items-center gap-0">
          <StatMini label="Contest Rating" val="1,725" isBig />
          <div className="mx-4 h-8 w-[1px] bg-[#1e2d3d]" />
          <StatMini label="Global Ranking" val="4/62" />
          <div className="mx-4 h-8 w-[1px] bg-[#1e2d3d]" />
          <StatMini label="Tests Attended" val="18" />
        </div>

        {/* SVG Curve */}
        <div className="relative mt-4 h-[110px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#curveGrad)" />
            <polyline
              points={polylinePath}
              className="animate-curve"
              stroke="#f97316"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Latest Point Tooltip */}
            {points.length > 0 && (
              <g>
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="4"
                  fill="white"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <foreignObject
                  x={points[points.length - 1].x - 15}
                  y={points[points.length - 1].y - 30}
                  width="30"
                  height="20"
                >
                  <div className="bg-[#0b0f16] border border-[#1e2d3d] rounded px-1 py-0.5 text-[9px] text-white text-center font-bold">
                    74
                  </div>
                </foreignObject>
              </g>
            )}
          </svg>
        </div>
        <div className="flex justify-between mt-2 px-1">
          <span className="text-gray-600 text-[10px] font-bold">2025</span>
          <span className="text-gray-600 text-[10px] font-bold">2026</span>
        </div>
      </div>

      {/* --- RIGHT PANEL: GLOBAL RANKING --- */}
      <div className="col-span-2 p-5 flex flex-col items-center justify-center bg-black/20">
        <span className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] mb-1">
          Top
        </span>
        <h2 className="text-white font-['Syne'] text-5xl font-bold tabular-nums">
          {percentile.toFixed(1)}%
        </h2>

        {/* Percentile Distribution Chart */}
        <div className="mt-6 w-full flex items-end justify-between gap-[2px] h-16">
          {bellCurveHeights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.03, duration: 0.5, ease: 'easeOut' }}
              className={`flex-1 rounded-sm ${i === 1 ? 'bg-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.4)]' : 'bg-[#1e2d3d]'}`}
            />
          ))}
        </div>
        <div className="flex justify-between w-full mt-2 px-0.5">
          <span className="text-gray-600 text-[9px] font-bold">0%</span>
          <span className="text-gray-600 text-[9px] font-bold">100%</span>
        </div>
      </div>
    </motion.div>
  );
};

const StatMini = ({ label, val, isBig }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-tight">
      {label}
    </span>
    <span
      className={`text-white font-bold leading-none mt-1 ${isBig ? "text-xl font-['Syne']" : 'text-sm'}`}
    >
      {val}
    </span>
  </div>
);

export default RankingAnalytics;
