'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/80 py-8 px-4 mt-16 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[#8B5CF6]">Grab</span>
            <span className="text-[#06B6D4]">Vid</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-slate-600">Vercel + Botkeep Cloud</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted &amp; Sandboxed Storage</span>
          </span>
          <span>•</span>
          <span>No Watermarks</span>
          <span>•</span>
          <span>No Ads or Trackers</span>
        </div>

        <p className="text-center md:text-right text-slate-400">
          © {new Date().getFullYear()} GrabVid. Designed for high-speed media archiving.
        </p>
      </div>
    </footer>
  );
};
