import { motion } from 'framer-motion';
import { Minus, Plus, Zap } from 'lucide-react';

const ProblemSolution = () => {
  const oldWay = [
    'Binary pass/fail evaluation',
    'Manual grading bottlenecks',
    'Zero constructive feedback',
    'Disconnected, clunky tools',
  ];

  const newWay = [
    'Partial marks for logic & effort',
    'Auto-graded in milliseconds',
    'Detailed line-by-line feedback',
    'All-in-one assessment engine',
  ];

  return (
    <section className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden dot-grid">
      {/* Background Accents (Copied from your Hero) */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] z-0 pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="hero-headline text-4xl md:text-5xl mb-4 font-bold">
            The Evolution of Grading
          </h2>
          <p className="hero-subtext text-lg">
            Why leading institutions are switching to Scribo.
          </p>
        </div>

        {/* Git Diff Editor Container */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono">
          {/* Editor Header Bar */}
          <div className="bg-[#151515] px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              grading_diff.sh
            </div>
          </div>

          {/* Diff Grid */}
          <div className="grid md:grid-cols-2 relative min-h-[400px]">
            {/* VS Divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block z-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-white/20 px-3 py-1 rounded-full text-[10px] text-orange-500 font-bold tracking-widest">
                VS
              </div>
            </div>

            {/* Left Panel: The Old Way */}
            <div className="p-8 md:p-12 bg-red-500/5 border-r border-white/5">
              <h3 className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
                <Minus size={14} /> The Old Way
              </h3>
              <ul className="space-y-6">
                {oldWay.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-gray-500 text-sm md:text-base line-through decoration-red-500/50 flex items-start gap-3"
                  >
                    <span className="text-red-900 font-bold">-</span> {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right Panel: The Scribo Way */}
            <div className="p-8 md:p-12 bg-teal-500/5 relative">
              {/* Teal Glow Accent */}
              <div className="absolute inset-0 bg-teal-500/10 blur-[100px] pointer-events-none" />

              <h3 className="text-teal-400 text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-2 relative z-10">
                <Plus size={14} /> The Scribo Way
              </h3>
              <ul className="space-y-6 relative z-10">
                {newWay.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-teal-50 text-sm md:text-base flex items-start gap-3 group"
                  >
                    <span className="text-teal-400 font-bold">+</span>
                    <span className="group-hover:text-teal-300 transition-colors">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Stats/CTA */}
          <div className="bg-[#151515]/50 px-8 py-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
            <div className="text-[10px] text-gray-500">
              DIFF STATUS: <span className="text-teal-400">OPTIMIZED</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Zap size={14} className="text-orange-500" />
              Significant efficiency gains detected.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
