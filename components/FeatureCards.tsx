'use client';

import React from 'react';
import { Zap, Wand2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Ultra Fast Speed',
    description: 'Unlimited bandwidth for instant high-speed downloads.',
    icon: Zap,
    iconBg: 'bg-purple-100/90 text-purple-600',
    hoverBorder: 'hover:border-purple-200',
    iconFill: true,
  },
  {
    title: 'No Watermarks',
    description: 'Save videos in their clean original resolution and bitrate.',
    icon: Wand2,
    iconBg: 'bg-pink-100/90 text-pink-600',
    hoverBorder: 'hover:border-pink-200',
    iconFill: false,
  },
  {
    title: 'Safe & Secure',
    description: 'Zero malware, no tracking cookies, and SSRF-hardened.',
    icon: Shield,
    iconBg: 'bg-cyan-100/90 text-cyan-600',
    hoverBorder: 'hover:border-cyan-200',
    iconFill: true,
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                y: -4,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }}
              className={`bg-white/85 backdrop-blur-sm rounded-2xl p-5 border border-slate-100/90 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 cursor-default ${item.hoverBorder}`}
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon className={`w-5 h-5 ${item.iconFill ? 'fill-current' : ''}`} />
              </motion.div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

