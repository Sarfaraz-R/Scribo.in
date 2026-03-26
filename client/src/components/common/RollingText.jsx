import { motion } from 'framer-motion';

const RollingText = ({ children }) => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative inline-block overflow-hidden cursor-pointer h-[1.5em] leading-[1.5em]"
    >
      {/* First Layer (Visible by default) */}
      <motion.span
        variants={{
          rest: { y: 0 },
          hover: { y: '-100%' },
        }}
        transition={{
          duration: 0.3,
          ease: [0.6, 0.01, 0.05, 0.95],
        }}
        className="block"
      >
        {children}
      </motion.span>

      {/* Second Layer (Hidden below) */}
      <motion.span
        variants={{
          rest: { y: '0%' }, // It sits directly below the first layer in the flow
          hover: { y: '-100%' },
        }}
        transition={{
          duration: 0.3,
          ease: [0.6, 0.01, 0.05, 0.95],
        }}
        className="block font-bold text-amber-500"
      >
        {children}
      </motion.span>
    </motion.div>
  );
};

export default RollingText;
