import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, GraduationCap, CheckCircle2, 
  ArrowRight, BookOpen, Clock, Target, 
  TrendingUp, Plus, Users, Monitor, 
  Download, AlertCircle 
} from 'lucide-react';

const DualPersona = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const studentData = {
    title: "I'm a Student",
    icon: <Terminal size={40} />,
    accent: "teal",
    cta: "Get Started as Student",
    features: [
      { icon: <BookOpen size={18} />, label: "Practice at your own pace" },
      { icon: <Clock size={18} />, label: "Take timed tests" },
      { icon: <Target size={18} />, label: "See where you lost marks" },
      { icon: <TrendingUp size={18} />, label: "Track progress with graphs" },
      { icon: <CheckCircle2 size={18} />, label: "Get learning suggestions" },
    ]
  };

  const facultyData = {
    title: "I'm a Faculty",
    icon: <GraduationCap size={44} />,
    accent: "orange",
    cta: "Get Started as Faculty",
    features: [
      { icon: <Plus size={18} />, label: "Create tests in minutes" },
      { icon: <CheckCircle2 size={18} />, label: "Auto-evaluate instantly" },
      { icon: <Monitor size={18} />, label: "Monitor students live" },
      { icon: <Download size={18} />, label: "Download grade sheets" },
      { icon: <AlertCircle size={18} />, label: "Identify struggling students early" },
    ]
  };

  return (
    <section className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden dot-grid">
      {/* Background Glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] z-0 pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="hero-headline text-4xl md:text-5xl font-bold mb-16 text-center">
          Who are you?
        </h2>

        <div className="flex flex-col md:flex-row gap-6 w-full min-h-[500px]">
          {/* Student Tile */}
          <RoleTile 
            data={studentData}
            isSelected={selectedRole === 'student'}
            isOtherSelected={selectedRole === 'faculty'}
            onClick={() => setSelectedRole('student')}
          />

          {/* Faculty Tile */}
          <RoleTile 
            data={facultyData}
            isSelected={selectedRole === 'faculty'}
            isOtherSelected={selectedRole === 'student'}
            onClick={() => setSelectedRole('faculty')}
          />
        </div>
      </div>
    </section>
  );
};

const RoleTile = ({ data, isSelected, isOtherSelected, onClick }) => {
  const isTeal = data.accent === "teal";
  
  return (
    <motion.div
      onClick={onClick}
      initial={false}
      animate={{ 
        width: isSelected ? '100%' : isOtherSelected ? '50%' : '100%',
        flex: isSelected ? 2 : isOtherSelected ? 1 : 1
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`relative cursor-pointer rounded-3xl p-8 overflow-hidden border-2 transition-all duration-500
        ${isSelected 
          ? (isTeal ? 'border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.2)]' : 'border-[#f97316] shadow-[0_0_30px_rgba(249,115,22,0.2)]') 
          : 'border-white/10 bg-[#0d1117] hover:border-white/20'
        }
      `}
    >
      <div className={`h-full flex flex-col ${isSelected ? 'items-start text-left' : 'items-center justify-center text-center'}`}>
        
        {/* Icon & Title */}
        <div className={`flex flex-col items-center transition-all duration-500 ${isSelected ? 'mb-8 md:flex-row gap-4' : 'gap-4'}`}>
          <div className={`${isSelected ? 'text-white' : (isTeal ? 'text-teal-500' : 'text-[#f97316]')}`}>
            {data.icon}
          </div>
          <h3 className={`font-['Syne'] font-bold tracking-tight transition-all duration-500 ${isSelected ? 'text-3xl' : 'text-xl text-white'}`}>
            {data.title}
          </h3>
        </div>

        {/* Feature List (Visible only when selected) */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              exit="hidden"
              className="flex-1 w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                {data.features.map((f, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                    }}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`${isTeal ? 'text-teal-400' : 'text-[#f97316]'}`}>
                      {f.icon}
                    </div>
                    <span className="text-gray-300 font-['DM_Sans'] font-medium">{f.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all
                  ${isTeal ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/20' : 'bg-[#f97316] hover:bg-[#fb8c00] shadow-orange-500/20'}
                `}
              >
                {data.cta} <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unselected State Prompt */}
        {!isSelected && !isOtherSelected && (
          <p className="mt-4 text-gray-500 text-sm font-['DM_Sans']">Click to see details</p>
        )}
      </div>

      {/* Subtle Bottom Glow for Tile */}
      {isSelected && (
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 blur-[100px] opacity-20 pointer-events-none
          ${isTeal ? 'bg-teal-500' : 'bg-orange-500'}`} 
        />
      )}
    </motion.div>
  );
};

export default DualPersona;