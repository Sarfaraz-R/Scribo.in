import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 500;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + step;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        
        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .glow-main {
          background: radial-gradient(circle at center, rgba(249, 115, 22, 0.12) 0%, transparent 70%);
          filter: blur(80px);
        }
        .glow-secondary {
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
          filter: blur(100px);
        }
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6.5vw, 85px);
          font-weight: 500;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: #fff;
        }
        .hero-subtext {
          font-family: 'DM Sans', sans-serif;
          color: rgba(255, 255, 255, 0.45);
        }
        .keyword-box::before {
          content: "";
          position: absolute;
          inset: -2px;
          border: 1.5px solid #f97316;
          border-radius: 2px;
          pointer-events: none;
          z-index: 10;
        }
        .corner-handle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #ffffff;
          border: 1px solid #000;
          z-index: 30;
          pointer-events: none;
        }
        .btn-glow {
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.2);
          transition: all 0.3s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 45px rgba(249, 115, 22, 0.4);
          transform: translateY(-2px);
        }
        .btn-institution {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(249,115,22,0.35);
          color: rgba(249,115,22,0.9);
          background: rgba(249,115,22,0.05);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .btn-institution:hover {
          background: rgba(249,115,22,0.1);
          border-color: rgba(249,115,22,0.6);
          transform: translateY(-2px);
        }
      `}</style>

      <section className="relative min-h-screen bg-[#020202] flex items-center justify-center overflow-hidden dot-grid pt-16">
        {/* Background Glows */}
        <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] z-0 pointer-events-none opacity-80" />
        <div className="glow-secondary absolute top-1/3 left-1/4 w-[400px] h-[400px] z-0 pointer-events-none" />

        <div className="relative z-20 flex flex-col items-center text-center gap-6 px-6 max-w-5xl">
          {/* Top Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-500 text-[10px] font-bold tracking-[0.4em] uppercase">
              Think &nbsp;·&nbsp; Code &nbsp;·&nbsp; Build
            </span>
          </div>

          {/* Headline */}
          <div className="hero-headline flex flex-col items-center font-bold">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Just Code !t
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4 justify-center flex-wrap"
            >
              We'll
              <span className="keyword-box relative inline-block px-4 py-2 mx-1 bg-[#57430b7a]">
                <span className="relative z-10">Correct it</span>
                <div className="corner-handle -top-1 -left-1" />
                <div className="corner-handle -top-1 -right-1" />
                <div className="corner-handle -bottom-1 -left-1" />
                <div className="corner-handle -bottom-1 -right-1" />
              </span>
            </motion.div>
          </div>

          {/* Body Text */}
          <p className="hero-subtext text-base md:text-lg font-light leading-relaxed mt-2 max-w-[480px]">
            Practice coding & ace assessments - built for college students.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-8 mt-6">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Primary CTA — unchanged */}
              <Link
                to="/auth/register"
                className="btn-glow bg-[#f97316] text-white font-bold text-sm px-10 py-4 rounded-full flex items-center gap-2 cursor-pointer border-none outline-none"
              >
                Get Started Free
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block"
                >
                  →
                </motion.span>
              </Link>

              {/* Secondary CTA — Register Institution */}
              <Link to="/auth/register-institution" className="btn-institution">
                🏫 Register Institution
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {[
                  {
                    char: 'A',
                    bg: 'linear-gradient(135deg, #1e3a5f, #050d18)',
                  },
                  {
                    char: 'S',
                    bg: 'linear-gradient(135deg, #3a1e1e, #100505)',
                  },
                  {
                    char: 'R',
                    bg: 'linear-gradient(135deg, #1a3a2a, #050d0a)',
                  },
                ].map((u, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white/70 -ml-2 first:ml-0"
                    style={{ background: u.bg }}
                  >
                    {u.char}
                  </div>
                ))}
              </div>
              <p className="text-[12px] hero-subtext">
                Trusted by{' '}
                <span className="text-white font-semibold">{count}+ users</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
