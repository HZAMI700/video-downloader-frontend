'use client';

import React from 'react';
import { Download, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-10 px-4 mt-20 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Download className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-300">VidStream Pro</span>
          <span>•</span>
          <span>Vercel + Botkeep Cloud</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sandboxed Temporary Storage</span>
          </span>
          <span>•</span>
          <span>No DRM Bypass</span>
          <span>•</span>
          <span>No Credentials Stored</span>
        </div>

        <p className="text-center md:text-right">
          For educational, archive, and personal fair-use media downloading.
        </p>
      </div>
    </footer>
  );
};
