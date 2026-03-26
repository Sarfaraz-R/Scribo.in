import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="relative w-full py-[160px] px-6 overflow-hidden bg-[#020202] dot-grid">
      {/* --- Restored Signature Background --- */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] z-0 pointer-events-none opacity-25" />

      {/* --- Advanced Effects Engine --- */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-120%) rotate(45deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(350%) rotate(45deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-40px) scale(1.1); opacity: 0.6; }
        }
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .light-sweep {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 40%;
          height: 300%;
          background: linear-gradient(
            to right, 
            transparent 0%, 
            rgba(249,115,22,0.08) 30%, 
            rgba(255,255,255,0.12) 50%, 
            rgba(249,115,22,0.08) 70%, 
            transparent 100%
          );
          transform: rotate(45deg);
          animation: sweep 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 1;
        }
        .text-gradient-shimmer {
          background: linear-gradient(
            90deg, 
            #ffffff 0%, 
            #ffffff 40%, 
            #f97316 50%, 
            #ffffff 60%, 
            #ffffff 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: text-shimmer 8s linear infinite;
        }
      `}</style>

      {/* Floating Particle Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500/10 blur-[60px]"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Diagonal Light Sweep */}
      <div className="light-sweep" />

      {/* --- Content --- */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Beta Label with Enhanced Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 mb-10 bg-orange-500/10 border border-orange-500/30 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.1)]"
        >
          <Sparkles size={14} className="text-orange-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 font-mono">
            Elevate Your Campus
          </span>
        </motion.div>

        {/* Shimmering Headline */}
        <h2
          className="text-gradient-shimmer font-bold tracking-tighter mb-8 leading-[1.1]"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(38px, 6vw, 72px)',
          }}
        >
          Ready to Transform How Your <br className="hidden md:block" /> College
          Does Coding?
        </h2>

        {/* Subtitle with better spacing */}
        <p className="text-gray-400 text-lg md:text-2xl font-medium mb-14 max-w-3xl mx-auto font-['DM_Sans'] leading-relaxed">
          Join hundreds of students and faculty already using{' '}
          <span className="text-white">Scribo</span> to bridge the gap between
          learning and assessment.
        </p>

        {/* Interaction Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-12 py-5 bg-[#f97316] text-white font-black rounded-full transition-all shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:shadow-[0_0_70px_rgba(249,115,22,0.6)] flex items-center justify-center gap-3 text-lg"
          >
            Get Started Free <ArrowRight size={22} strokeWidth={3} />
          </motion.button>

          <motion.button
            whileHover={{
              backgroundColor: 'rgba(255,255,255,1)',
              color: '#0a0a0a',
            }}
            className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-white/20 hover:border-white text-white font-black rounded-full transition-all flex items-center justify-center gap-3 text-lg"
          >
            Request a Demo <PlayCircle size={22} />
          </motion.button>
        </div>

        {/* Micro-Copy */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500 text-[11px] md:text-sm font-['DM_Sans'] uppercase tracking-[0.4em]">
            No credit card required <span className="mx-2 opacity-20">•</span>{' '}
            Setup in 5 mins
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mt-2" />
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
