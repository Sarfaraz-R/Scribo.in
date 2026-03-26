import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Lightbulb } from 'lucide-react';

const Spotlight = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const metrics = [
    { label: 'Syntax', target: 90, color: 'bg-orange-500', delay: 0.1 },
    { label: 'Compilation', target: 100, color: 'bg-green-500', delay: 0.2 },
    { label: 'Structure', target: 80, color: 'bg-orange-500', delay: 0.3 },
    { label: 'Logic', target: 70, color: 'bg-amber-500', delay: 0.4 },
    { label: 'Test Cases', target: 60, color: 'bg-amber-500', delay: 0.5 },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#020202] py-[100px] px-6 md:px-20 overflow-hidden dot-grid"
    >
      {/* Background Glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] z-0 pointer-events-none opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* --- LEFT SIDE: THE PITCH --- */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-[#f97316] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
              <Sparkles size={12} /> Partial Marking Engine
            </span>
            <h2
              className="text-white font-bold leading-[1.1] tracking-tighter"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(32px, 4vw, 52px)',
              }}
            >
              Your students wrote 80% correct logic. Why give them zero?
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md font-['DM_Sans']">
              Scribo breaks every submission into 5 scoring dimensions —
              rewarding real effort at every level.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Syntax', 'Compilation', 'Structure', 'Logic', 'Test Cases'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#f97316]/5 border border-[#f97316]/30 text-[#f97316] text-[10px] font-bold rounded-full uppercase tracking-widest"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Traditional judges say
              </span>
              <span className="text-3xl font-black text-red-600 line-through decoration-red-600/50 font-['Syne']">
                0/100
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Scribo says
              </span>
              <span className="text-5xl font-black text-[#f97316] font-['Syne'] shadow-orange-500/20 drop-shadow-xl">
                74/100
              </span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE PROOF --- */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-teal-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />

          <div className="relative bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-6 md:p-8 space-y-8">
            {/* Mini Editor */}
            <div className="rounded-xl overflow-hidden border border-white/5 bg-[#010409]">
              <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] font-mono text-gray-500">
                  solution.py
                </span>
              </div>
              <div className="p-4 font-mono text-[12px] leading-relaxed">
                <div className="text-gray-500 italic">
                  # Partial logic implementation
                </div>
                <div>
                  <span className="text-purple-400">def</span>{' '}
                  <span className="text-teal-400">find_max</span>(arr):
                </div>
                <div className="pl-4">
                  max_val = arr[<span className="text-orange-300">0</span>]
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">for</span> i{' '}
                  <span className="text-purple-400">in</span>{' '}
                  <span className="text-teal-400">range</span>(
                  <span className="text-teal-400">len</span>(arr)):
                </div>
                <div className="pl-8 bg-red-500/10">
                  <span className="text-purple-400">if</span> arr[i] &gt;
                  max_val <span className="text-gray-500"># missing colon</span>
                </div>
                <div className="pl-12">
                  max_val = arr[i]{' '}
                  <span className="text-gray-500"># missing return</span>
                </div>
              </div>
            </div>

            {/* Score Bars */}
            <div className="space-y-4">
              {metrics.map((m, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-gray-500">
                      {m.label} · · · · · · · · · · →
                    </span>
                    <span className="text-white">{m.target}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1e2d3d] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${m.target}%` } : {}}
                      transition={{
                        duration: 1,
                        delay: m.delay,
                        ease: 'easeOut',
                      }}
                      className={`h-full ${m.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Row */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest font-['DM_Sans']">
                  Final Score
                </span>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-black text-white font-['Syne']">
                    <Counter target={74} isVisible={isInView} />
                    <span className="text-lg text-gray-600 ml-1">/100</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 text-green-500 text-[9px] font-black rounded uppercase tracking-tighter">
                    ✓ Partial Pass
                  </span>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1e2d3d] rounded-lg p-3 flex gap-3">
                <Lightbulb size={16} className="text-teal-400 shrink-0" />
                <p className="text-teal-400/80 text-[11px] leading-relaxed font-['DM_Sans'] italic">
                  "Fix the loop condition on line 4 and add a return statement."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --- Animated Counter Component --- */
const Counter = ({ target, isVisible }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return <span>{count}</span>;
};

export default Spotlight;
