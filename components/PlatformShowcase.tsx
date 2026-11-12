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
    color: 'bg-surface',
    tagColor: 'bg-black text-white',
    iconColor: 'bg-black text-white',
  },
  {
    name: 'Pinterest',
    badge: 'Direct MP4',
    description: 'Download aesthetic Pinterest video pins and idea pins directly in 720p/1080p crystal quality.',
    color: 'bg-danger',
    tagColor: 'bg-danger-soft text-danger border border-danger/30',
    iconColor: 'bg-[#E60023] text-white',
  },
  {
    name: 'Facebook',
    badge: 'Reels & Watch',
    description: 'Save Facebook Reels, public watch videos, and stories in high definition with complete audio.',
    color: 'bg-info',
    tagColor: 'bg-info-soft text-info border border-info/30',
    iconColor: 'bg-[#1877F2] text-white',
  },
  {
    name: 'Instagram',
    badge: '9:16 Portrait',
    description: 'Download Instagram Reels, feeds, and video posts in full phone 9:16 portrait resolution.',
    color: 'bg-warning',
    tagColor: 'bg-sunken text-muted border border-line',
    iconColor: ' bg-[#FFDC80] text-white',
  },
  {
    name: 'YouTube',
    badge: 'Shorts & MP3',
    description: 'Convert and download YouTube Shorts and full videos in 1080p MP4 or high-fidelity 320kbps MP3.',
    color: 'bg-danger',
    tagColor: 'bg-danger-soft text-danger border border-danger/30',
    iconColor: 'bg-[#FF0000] text-white',
  },
  {
    name: '100+ More',
    badge: 'Fast & Free',
    description: 'Full compatibility with X (Twitter), Reddit, Vimeo, SoundCloud, Twitch, and web media links.',
    color: 'bg-accent',
    tagColor: 'bg-sunken text-muted border border-line',
    iconColor: ' bg-accent text-on-accent',
  },
];

export const PlatformShowcase: React.FC = () => {
  return (
    <section id="supported-sites" className="w-full max-w-5xl mx-auto py-12 px-2">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sunken text-accent text-xs font-medium border border-line">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span>Universal Platform Support</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
          Supported Video &amp; Audio Platforms
        </h2>
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
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
                <span className="text-lg font-semibold text-fg">{p.name}</span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${p.tagColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-line flex items-center gap-2 text-xs font-medium text-accent">
              <Check className="w-4 h-4" />
              <span>Full Speed &amp; No Throttling</span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};
