import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      q: 'How is partial marking calculated?',
      a: 'We evaluate 5 dimensions: syntax correctness, compilation success, code structure, logical flow, and test case coverage. Each carries weighted marks.',
    },
    {
      q: 'Which languages are supported?',
      a: 'Currently Python, C, C++, Java, and JavaScript. More languages coming soon.',
    },
    {
      q: 'Can faculty prevent cheating?',
      a: 'Yes — tab switch detection, copy-paste restrictions, and live monitoring allow faculty to flag suspicious activity.',
    },
    {
      q: 'Is it suitable for lab exams?',
      a: 'Absolutely. Scribo was built specifically for college lab assessments with timed tests and auto-evaluation.',
    },
    {
      q: 'How is data stored and secured?',
      a: 'All data is stored on MongoDB Atlas with encrypted connections. JWT-based auth ensures only authorized access.',
    },
    {
      q: 'Can we integrate with our LMS?',
      a: 'LMS integration is available on the Institution plan. We support custom API connections.',
    },
    {
      q: 'Is there a free trial for Pro?',
      a: 'Yes — all new faculty accounts get a 14-day Pro trial, no credit card required.',
    },
    {
      q: 'How accurate is the auto-evaluation?',
      a: 'Our evaluation engine has a 98% accuracy rate validated across 10,000+ submissions.',
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden dot-grid">
      {/* Signature Background Glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] z-0 pointer-events-none opacity-10" />

      <div className="relative z-10 max-w-[680px] mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 font-['DM_Sans']">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group overflow-hidden rounded-xl border transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-[#0d1117] border-[#f97316]/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                  : 'bg-[#0d1117] border-[#1e2d3d] hover:border-gray-700'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
              >
                <span
                  className={`font-bold text-[15px] font-['DM_Sans'] transition-colors ${
                    activeIndex === index ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {faq.q}
                </span>
                <div className="ml-4 text-[#f97316] shrink-0">
                  {activeIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5">
                      <div className="w-full h-[1px] bg-[#1e2d3d] mb-4" />
                      <p className="text-[#8899aa] text-[14px] leading-relaxed font-['DM_Sans']">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
