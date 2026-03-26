import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Terminal,
  Users,
  BarChart3,
  MessageSquare,
} from 'lucide-react';

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden dot-grid"
    >
      {/* Background Glows matching earlier branding */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] z-0 pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="hero-headline text-4xl md:text-5xl mb-4 font-bold tracking-tighter">
            Everything You Need
          </h2>
          <p className="hero-subtext text-lg max-w-xl">
            A specialized toolkit designed to bridge the gap between learning
            and assessment.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">
          {/* Card 1: Smart Code Editor (Small) */}
          <FeatureCard
            icon={<Code2 className="text-orange-500" />}
            title="Smart Code Editor"
            desc="Monaco-powered IDE with multi-language support."
            className="md:col-span-1"
          />

          {/* Card 2: Partial Marking Engine (Large - Spans 2 Cols) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#0d1117] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Cpu className="text-orange-500" size={24} />
                </div>
                <h3 className="text-white font-bold text-2xl font-['Syne']">
                  Partial Marking Engine
                </h3>
              </div>

              {/* Animated Score Breakdown */}
              <div className="flex-1 flex flex-col justify-center gap-6 max-w-md">
                <ScoreBar label="Syntax Accuracy" percentage={95} delay={0.2} />
                <ScoreBar label="Code Structure" percentage={80} delay={0.4} />
                <ScoreBar
                  label="Logic Implementation"
                  percentage={70}
                  delay={0.6}
                />
                <ScoreBar label="Edge Cases" percentage={60} delay={0.8} />
              </div>

              <p className="text-gray-500 text-sm mt-8 font-['DM_Sans']">
                Evaluates your code intelligently — rewarding partial logic and
                effort.
              </p>
            </div>
            {/* Subtle glow behind the bars */}
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />
          </div>

          {/* Card 3: Automated Evaluation (Small) */}
          <FeatureCard
            icon={<Terminal className="text-orange-500" />}
            title="Automated Evaluation"
            desc="Instant test-case results with zero manual grading."
            className="md:col-span-1"
          />

          {/* Card 4: Performance Analytics (Tall) */}
          <FeatureCard
            icon={<BarChart3 className="text-orange-500" />}
            title="Performance Analytics"
            desc="Deep insights into individual student weaknesses."
            className="md:col-span-1 md:row-span-1"
          />

          {/* Card 5: Real-Time Collaboration (Small) */}
          <FeatureCard
            icon={<Users className="text-orange-500" />}
            title="Collaboration"
            desc="Live pair-programming for labs and assessments."
            className="md:col-span-1"
          />

          {/* Card 6: Detailed Feedback (Wide) */}
          <FeatureCard
            icon={<MessageSquare className="text-orange-500" />}
            title="Detailed Feedback"
            desc="Line-by-line automated comments explaining errors."
            className="md:col-span-1"
          />
        </div>
      </div>
    </section>
  );
};

/* Reusable Compact Card Component */
const FeatureCard = ({ icon, title, desc, className }) => (
  <div
    className={`bg-[#0d1117] border border-white/10 rounded-3xl p-6 flex flex-col justify-between group hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.05)] ${className}`}
  >
    <div className="p-2 bg-white/5 w-fit rounded-xl group-hover:bg-orange-500/10 transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="text-white font-bold text-lg mb-2 font-['Syne'] tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 text-sm font-['DM_Sans'] leading-snug">
        {desc}
      </p>
    </div>
  </div>
);

/* Animated Progress Bar for the Engine Card */
const ScoreBar = ({ label, percentage, delay }) => (
  <div className="w-full">
    <div className="flex justify-between mb-2">
      <span className="text-xs text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-xs text-orange-500 font-bold">{percentage}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
      />
    </div>
  </div>
);

export default Features;
