'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Sparkles, Download, ArrowRight } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const steps = [
  {
    step: '01',
    title: 'Copy the Video Link',
    description: 'Find any video, reel, or pin on TikTok, Pinterest, Facebook, or Instagram and copy its share URL.',
    icon: Copy,
    accent: 'from-purple-500 to-indigo-500',
    tag: 'Step 1',
  },
  {
    step: '02',
    title: 'Paste into Playzy',
    description: 'Paste the copied URL into the search bar above. Playzy instantly analyzes and extracts available formats.',
    icon: Sparkles,
    accent: 'from-pink-500 to-rose-500',
    tag: 'Step 2',
  },
  {
    step: '03',
    title: 'Download in Full HD',
    description: 'Select your preferred quality (1080p, 720p MP4 or 320kbps MP3) and save your high-speed download directly.',
    icon: Download,
    accent: 'from-cyan-500 to-teal-500',
    tag: 'Step 3',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full max-w-5xl mx-auto py-12 px-2">
      <div className="text-center space-y-3 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-[#181D24] text-[#009688] dark:text-[#00c9a7] text-xs font-bold border border-slate-200 dark:border-[#263241] shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#009688] dark:text-[#00c9a7]" />
          <span>Simple 3-Step Process</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How to Download Videos with <span className="skywork-gradient-text">Playzy</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Save public media in three simple steps without registering, installing software, or viewing intrusive ads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <SpotlightCard
              key={item.step}
              spotlightColor="rgba(99, 102, 241, 0.12)"
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-300 dark:text-slate-700 tracking-tight">
                    {item.step}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white bg-gradient-to-r ${item.accent} shadow-xs`}>
                    {item.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] flex items-center justify-center text-[#009688] dark:text-[#00c9a7] shadow-xs">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {index < 2 && (
                <div className="hidden md:flex justify-end pt-4 text-slate-400 dark:text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
