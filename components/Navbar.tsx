'use client';

import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { CapabilitiesResponse } from '../lib/types';

interface NavbarProps {
  capabilities?: CapabilitiesResponse | null;
  loadingCapabilities?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ capabilities, loadingCapabilities }) => {
  return (
    <header className="w-full bg-white/75 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo: Playzy */}
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9333EA] via-[#6366F1] to-[#06B6D4] flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              Playzy
            </span>
          </a>
          {capabilities && (
            <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Ready
            </span>
          )}
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-purple-600 transition-colors">
            How It Works
          </a>
          <a href="#supported-sites" className="hover:text-purple-600 transition-colors">
            Supported Sites
          </a>
          <a href="#features" className="hover:text-purple-600 transition-colors">
            Features
          </a>
          <a href="#faq" className="hover:text-purple-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#download-input"
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] hover:opacity-95 shadow-md shadow-purple-500/20 transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Free</span>
          </a>
        </div>
      </div>
    </header>
  );
};
