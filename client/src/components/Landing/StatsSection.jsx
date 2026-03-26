import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const StatsSection = () => {
  const ref = useRef(null);

  // amount: 0.1 or 0.2 ensures the count starts as soon as the top of the
  // section enters the viewport rather than waiting for 50% visibility.
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    {
      target: 10000,
      suffix: '+',
      label: 'Lines of code evaluated',
      animate: true,
    },
    { target: 500, suffix: '+', label: 'Students onboarded', animate: true },
    { target: 98, suffix: '%', label: 'Evaluation accuracy', animate: true },
    {
      target: 3,
      suffix: 'x',
      label: 'Faster than manual grading',
      animate: false,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#020202] py-24 px-6 overflow-hidden border-y  dot-grid"
    >
      {/* Reusing the background glow from your Hero */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] z-0 pointer-events-none opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            {/* Stat Item */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-1 flex flex-col items-center text-center px-4"
            >
              <div className="flex items-baseline text-white font-bold leading-none">
                <span
                  className="text-[64px] lg:text-[72px] tracking-tighter"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.animate ? (
                    <Counter target={stat.target} isVisible={isInView} />
                  ) : (
                    stat.target
                  )}
                </span>
                <span
                  className="text-4xl lg:text-5xl text-orange-500 ml-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.suffix}
                </span>
              </div>
              <p
                className="mt-4 text-[11px] uppercase tracking-[0.3em] text-gray-500 font-bold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {stat.label}
              </p>
            </motion.div>

            {/* Vertical Divider in your signature color */}
            {index < stats.length - 1 && (
              <div className="hidden md:block w-[1px] h-20 bg-[#1e2d3d]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

/* --- Animated Counter Component --- */
const Counter = ({ target, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This ensures the logic only runs once when isVisible becomes true
    if (!isVisible) return;

    let startTime;
    const duration = 2000; // 2 seconds for the count-up

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Using an easing function (easeOutQuad) for a smoother feel
      const easedProgress = percentage * (2 - percentage);
      const currentCount = Math.floor(easedProgress * target);

      setCount(currentCount);

      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, target]);

  return <span>{count.toLocaleString()}</span>;
};

export default StatsSection;
