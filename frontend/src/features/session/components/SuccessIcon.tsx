import React from 'react';
import { motion } from 'framer-motion';

const SuccessIcon: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mb-8">
      {/* Outer Glow Ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
      />
      
      {/* Circle Background */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
        className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/20"
      >
        {/* Checkmark Path */}
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              delay: 0.4
            }}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default SuccessIcon;
