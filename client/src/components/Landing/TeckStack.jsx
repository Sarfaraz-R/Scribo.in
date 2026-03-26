import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TechStack = () => {
  const [linesVisible, setLinesVisible] = useState(0);

  const codeLines = [
    {
      label: 'const',
      color: 'text-purple-400',
      isKey: false,
      text: ' techStack ',
    },
    { label: '=', color: 'text-gray-400', isKey: false, text: ' {' },
    { key: 'frontend', value: 'React + Tailwind CSS' },
    { key: 'editor', value: 'Monaco Editor' },
    { key: 'backend', value: 'Node.js + Express.js' },
    { key: 'realtime', value: 'Socket.IO' },
    { key: 'database', value: 'MongoDB Atlas' },
    { key: 'auth', value: 'JWT + Bcrypt' },
    { key: 'deployment', value: 'Vercel + Render' },
    { key: 'bundler', value: 'Vite' },
    { label: '}', color: 'text-gray-400', isKey: false, text: '' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLinesVisible((prev) => (prev < codeLines.length ? prev + 1 : prev));
    }, 150); // Staggered line-by-line delay
    return () => clearInterval(interval);
  }, [codeLines.length]);

  return (
    <section className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden dot-grid">
      {/* Background Glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] z-0 pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Built with modern tech, designed for scale
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium font-['DM_Sans']">
            Every tool chosen for performance, scale, and developer experience.
          </p>
        </div>

        {/* --- Code Editor Card --- */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Editor Header */}
          <div className="bg-[#161b22] px-4 py-3 border-b border-[#1e2d3d] flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="px-3 py-1 bg-[#0d1117] rounded-t-lg border-x border-t border-[#1e2d3d] -mb-[13px] text-[10px] text-gray-400 font-mono">
              tech-stack.config.js
            </div>
            <div className="w-10" />
          </div>

          {/* Editor Content */}
          <div className="p-6 md:p-10 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
            <div className="flex">
              {/* Line Numbers */}
              <div className="text-gray-600 text-right pr-6 select-none border-r border-[#1e2d3d] mr-6">
                {codeLines.map((_, i) => (
                  <div key={i}>{(i + 1).toString().padStart(2, '0')}</div>
                ))}
              </div>

              {/* Code Logic */}
              <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {codeLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={
                      i < linesVisible ? { opacity: 1, x: 0 } : { opacity: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className="whitespace-nowrap"
                  >
                    {line.key ? (
                      <div className="pl-4">
                        <span className="text-teal-400">{line.key}</span>
                        <span className="text-gray-400">: </span>
                        <span className="text-orange-400">"{line.value}"</span>
                        <span className="text-gray-400">,</span>
                      </div>
                    ) : (
                      <div>
                        <span className={line.color}>{line.label}</span>
                        <span className="text-white">{line.text}</span>
                      </div>
                    )}
                    {/* Blinking Cursor on Active Line */}
                    {i === linesVisible - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-orange-500 ml-1 translate-y-0.5"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
