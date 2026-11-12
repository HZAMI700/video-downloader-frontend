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
    accent: 'bg-accent',
    tag: 'Step 1',
  },
  {
    step: '02',
    title: 'Paste into Playzy',
    description: 'Paste the copied URL into the search bar above. Playzy instantly analyzes and extracts available formats.',
    icon: Sparkles,
    accent: 'bg-accent',
    tag: 'Step 2',
  },
  {
    step: '03',
    title: 'Download in Full HD',
    description: 'Select your preferred quality (1080p, 720p MP4 or 320kbps MP3) and save your high-speed download directly.',
    icon: Download,
    accent: 'bg-info',
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sunken text-accent text-xs font-medium border border-line"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Simple 3-Step Process</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
          How to Download Videos with <span className="text-fg">Playzy</span>
        </h2>
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
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
                  <span className="text-3xl font-semibold text-muted tracking-tight">
                    {item.step}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full text-fg ${item.accent}`}>
                    {item.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-sunken border border-line flex items-center justify-center text-accent">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-fg tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {index < 2 && (
                <div className="hidden md:flex justify-end pt-4 text-muted">
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
