'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Top-Left Glowing Pastel Orb */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-pink-300/20 via-purple-300/25 to-indigo-300/15 blur-[80px]"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom-Right Glowing Pastel Orb */}
      <motion.div
        className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-cyan-300/25 via-blue-300/20 to-teal-200/15 blur-[90px]"
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 35, -25, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center Subtle Aura */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[30vw] rounded-full bg-gradient-to-r from-purple-200/10 via-pink-200/10 to-cyan-200/10 blur-[100px]"
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
