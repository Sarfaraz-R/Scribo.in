import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Users,
  FileBarChart,
  Key,
  Code,
  CheckCircle,
  Target,
  Laptop,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('faculty');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#how-it-works-students') {
      setActiveTab('students');
    } else if (hash === '#how-it-works-faculty') {
      setActiveTab('faculty');
    } else if (hash === '#how-it-works-practice') {
      setActiveTab('practice');
    }
  }, []);

  const content = {
    faculty: [
      {
        icon: <PlusCircle size={24} />,
        title: 'Create',
        desc: 'Set up test, define problems & time limits.',
      },
      {
        icon: <Users size={24} />,
        title: 'Assign & Monitor',
        desc: 'Share with class, watch live submissions.',
      },
      {
        icon: <FileBarChart size={24} />,
        title: 'Auto-Grade & Report',
        desc: 'Instant grades, analytics, exportable sheets.',
      },
    ],
    students: [
      {
        icon: <Key size={24} />,
        title: 'Join',
        desc: 'Enter test code, access your exam.',
      },
      {
        icon: <Code size={24} />,
        title: 'Code & Submit',
        desc: 'Write in the editor, submit before time.',
      },
      {
        icon: <CheckCircle size={24} />,
        title: 'See Results',
        desc: 'View score breakdown, feedback & suggestions.',
      },
    ],
    practice: [
      {
        icon: <Target size={24} />,
        title: 'Pick a Topic',
        desc: 'Choose language and difficulty.',
      },
      {
        icon: <Laptop size={24} />,
        title: 'Code Freely',
        desc: 'Use the smart editor, run anytime.',
      },
      {
        icon: <TrendingUp size={24} />,
        title: 'Track Growth',
        desc: 'See progress graphs and improvement tips.',
      },
    ],
  };

  const tabs = [
    { id: 'faculty', label: 'For Faculty' },
    { id: 'students', label: 'For Students' },
    { id: 'practice', label: 'For Practice' },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden dot-grid"
    >
      {/* Background Glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] z-0 pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="hero-headline text-4xl md:text-5xl mb-8 font-bold tracking-tighter">
            How It Works
          </h2>

          {/* Tab Switcher */}
          <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#f97316] rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 font-['DM_Sans']">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Flow */}
        <div className="relative mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 relative"
            >
              {content[activeTab].map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center relative group"
                >
                  {/* Step Number & Connector */}
                  <div className="relative mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-white/10 flex items-center justify-center text-[#f97316] group-hover:border-[#f97316]/50 transition-colors duration-500 shadow-xl relative z-10">
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#f97316] text-black text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#020202] z-20">
                      0{index + 1}
                    </div>

                    {/* Dotted Connection Line */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 left-[120%] w-[100%] border-t-2 border-dashed border-white/10 z-0">
                        <ArrowRight
                          className="absolute -right-2 -top-[9px] text-white/10"
                          size={16}
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <h3 className="text-white font-bold text-xl mb-3 font-['Syne'] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-[240px] leading-relaxed font-['DM_Sans']">
                    {step.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
