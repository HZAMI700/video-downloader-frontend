'use client';

import React from 'react';
import { Zap, Wand2, Shield } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const features = [
  {
    title: 'Ultra Fast Speed',
    description: 'Direct high-throughput pipeline for instantaneous video and audio downloads.',
    icon: Zap,
    iconBg: 'bg-purple-100/90 text-purple-600',
    spotlight: 'rgba(168, 85, 247, 0.15)',
    iconFill: true,
  },
  {
    title: 'No Watermarks',
    description: 'Save TikTok, Reels, and Pinterest videos in their pristine original bitrate and frame rate.',
    icon: Wand2,
    iconBg: 'bg-pink-100/90 text-pink-600',
    spotlight: 'rgba(236, 72, 153, 0.15)',
    iconFill: false,
  },
  {
    title: 'Safe & Secure',
    description: 'Zero malware, zero tracking cookies, and SSRF-hardened infrastructure.',
    icon: Shield,
    iconBg: 'bg-cyan-100/90 text-cyan-600',
    spotlight: 'rgba(6, 182, 212, 0.15)',
    iconFill: true,
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <section id="features" className="w-full max-w-5xl mx-auto px-2 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <SpotlightCard
              key={item.title}
              spotlightColor={item.spotlight}
              className="flex items-start gap-4 p-5 sm:p-6"
            >
              <div className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className={`w-5 h-5 ${item.iconFill ? 'fill-current' : ''}`} />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
