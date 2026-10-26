'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const platforms = [
  {
    name: 'TikTok',
    badge: 'No Watermark',
    description: 'Save viral TikTok videos in original HD quality without the distracting watermark logo.',
    color: 'from-slate-900 to-black',
    tagColor: 'bg-black text-white',
    iconColor: 'bg-black text-white',
  },
  {
    name: 'Pinterest',
    badge: 'Direct MP4',
    description: 'Download aesthetic Pinterest video pins and idea pins directly in 720p/1080p crystal quality.',
    color: 'from-red-500 to-rose-600',
    tagColor: 'bg-red-50 text-red-600 border border-red-200',
    iconColor: 'bg-[#E60023] text-white',
  },
  {
    name: 'Facebook',
    badge: 'Reels & Watch',
    description: 'Save Facebook Reels, public watch videos, and stories in high definition with complete audio.',
    color: 'from-blue-600 to-indigo-600',
    tagColor: 'bg-blue-50 text-blue-600 border border-blue-200',
    iconColor: 'bg-[#1877F2] text-white',
  },
  {
    name: 'Instagram',
    badge: '9:16 Portrait',
    description: 'Download Instagram Reels, feeds, and video posts in full phone 9:16 portrait resolution.',
    color: 'from-amber-500 via-rose-500 to-purple-600',
    tagColor: 'bg-pink-50 text-pink-600 border border-pink-200',
    iconColor: 'bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white',
  },
  {
    name: 'YouTube',
    badge: 'Shorts & MP3',
    description: 'Convert and download YouTube Shorts and full videos in 1080p MP4 or high-fidelity 320kbps MP3.',
    color: 'from-red-600 to-rose-700',
    tagColor: 'bg-red-50 text-red-600 border border-red-200',
    iconColor: 'bg-[#FF0000] text-white',
  },
  {
    name: '100+ More',
    badge: 'Fast & Free',
    description: 'Full compatibility with X (Twitter), Reddit, Vimeo, SoundCloud, Twitch, and web media links.',
    color: 'from-indigo-500 to-cyan-500',
    tagColor: 'bg-purple-50 text-purple-600 border border-purple-200',
    iconColor: 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white',
  },
];

export const PlatformShowcase: React.FC = () => {
  return (
    <section id="supported-sites" className="w-full max-w-5xl mx-auto py-12 px-2">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#181D24] text-[#00c9a7] text-xs font-bold border border-[#263241] shadow-xs">
          <Zap className="w-3.5 h-3.5 text-[#00c9a7]" />
          <span>Universal Platform Support</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Supported Video &amp; Audio Platforms
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Playzy automatically detects the source URL and extracts the highest possible bitrate for every platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {platforms.map((p) => (
          <SpotlightCard
            key={p.name}
            spotlightColor="rgba(0, 201, 167, 0.12)"
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-black text-white">{p.name}</span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${p.tagColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#263241] flex items-center gap-2 text-xs font-bold text-[#00c9a7]">
              <Check className="w-4 h-4" />
              <span>Full Speed &amp; No Throttling</span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};
