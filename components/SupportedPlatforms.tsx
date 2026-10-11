'use client';

import React from 'react';
import { Youtube, Instagram, Film, Twitter, Facebook, Radio, Tv, Globe } from 'lucide-react';

const platforms = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500', desc: 'Videos & Shorts' },
  { name: 'TikTok', icon: Film, color: 'text-cyan-400', desc: 'HD Without Watermark' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', desc: 'Reels, Posts & Stories' },
  { name: 'X / Twitter', icon: Twitter, color: 'text-sky-400', desc: 'Clips & Media' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-500', desc: 'Watch & Videos' },
  { name: 'Reddit', icon: Radio, color: 'text-orange-500', desc: 'Media & Audio Mux' },
  { name: 'Vimeo', icon: Tv, color: 'text-teal-400', desc: 'High Quality Streams' },
  { name: 'Web Media', icon: Globe, color: 'text-indigo-400', desc: 'Direct MP4 & Audio' },
];

export const SupportedPlatforms: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">Supported Media Platforms</h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
          Built on yt-dlp to support hundreds of streaming services, video portals, and public social feeds.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {platforms.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 transition flex items-center gap-3 group"
            >
              <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition duration-300 ${p.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <p className="text-[11px] text-slate-400">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
