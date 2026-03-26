import React from 'react';

const PerformanceGraph = () => {
  const studentData = [55, 62, 70, 58, 74, 68, 74];
  const classAvgData = [62, 63, 63, 64, 64, 65, 65];

  const width = 400; // Reduced for better mobile fit
  const height = 120;
  const xPadding = 15;
  const yBase = 110;
  const yMaxRange = 90;

  // Mapping logic: Score 40-100 mapped to SVG Y 110-20
  const getPoints = (data) =>
    data.map((val, i) => {
      const x = xPadding + (i * (width - xPadding * 2)) / (data.length - 1);
      const y = yBase - ((val - 40) / 60) * yMaxRange;
      return { x, y };
    });

  const studentPoints = getPoints(studentData);
  const classPoints = getPoints(classAvgData);

  const polylinePath = (pts) => pts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl p-5 font-['DM_Sans'] shadow-2xl overflow-hidden">
      <style>{`
        @keyframes drawLine { 
          from { stroke-dashoffset: 600; } 
          to { stroke-dashoffset: 0; } 
        }
        .animate-draw { 
          stroke-dasharray: 600; 
          stroke-dashoffset: 600; 
          animation: drawLine 1.8s ease-out forwards; 
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-white font-bold font-['Syne'] text-sm uppercase tracking-widest">
          Performance
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            <span className="text-white text-[10px] font-black uppercase tracking-tighter">
              You
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3a4a5a]" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-tighter">
              Class Avg
            </span>
          </div>
        </div>
      </div>

      {/* --- SVG GRAPH --- */}
      <div className="relative h-[150px] w-full mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal Grid Lines */}
          {[20, 50, 80, 110].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="#1e2d3d"
              strokeWidth="1"
            />
          ))}

          {/* Class Avg Line (Dashed) */}
          <polyline
            points={polylinePath(classPoints)}
            stroke="#3a4a5a"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            fill="none"
          />

          {/* Student Line (Animated) */}
          <polyline
            points={polylinePath(studentPoints)}
            className="animate-draw"
            stroke="#f97316"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Student Data Points */}
          {studentPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === studentPoints.length - 1 ? 5 : 3}
              fill="#f97316"
              stroke="#0b0f16"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* --- X LABELS --- */}
      <div className="flex justify-between mt-2 px-1">
        {studentPoints.map((_, i) => (
          <span
            key={i}
            className="text-[9px] text-[#3a4a5a] font-black uppercase tracking-widest"
          >
            T{i + 1}
          </span>
        ))}
      </div>

      {/* --- BOTTOM STRIP --- */}
      <div className="mt-3 pt-3 border-t border-[#1e2d3d] flex justify-between items-center px-1">
        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-tighter">
          Above avg in 5/7 tests
        </span>
        <div className="flex items-center gap-1">
          <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mr-2">
            Your Avg:
          </span>
          <span className="text-[#f97316] text-xs font-black font-['Syne'] uppercase">
            66.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceGraph;
