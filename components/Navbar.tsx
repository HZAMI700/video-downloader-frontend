'use client';

import React from 'react';
import { Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { CapabilitiesResponse } from '../lib/types';

interface NavbarProps {
  capabilities?: CapabilitiesResponse | null;
  loadingCapabilities?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ capabilities, loadingCapabilities }) => {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo: GrabVid */}
        <div className="flex items-center gap-2">
          <a href="/" className="text-3xl font-extrabold tracking-tight flex items-center">
            <span className="text-[#8B5CF6]">Grab</span>
            <span className="text-[#06B6D4]">Vid</span>
          </a>
          {capabilities && (
            <span className="ml-2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Ready
            </span>
          )}
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a href="#how-it-works" className="hover:text-[#8B5CF6] transition-colors">
            How It Works
          </a>
          <a href="#supported-sites" className="hover:text-[#8B5CF6] transition-colors">
            Supported Sites
          </a>
          <a href="#extension" className="hover:text-[#8B5CF6] transition-colors">
            Browser Extension
          </a>
          <a href="#api" className="hover:text-[#8B5CF6] transition-colors">
            API
          </a>
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] hover:opacity-95 shadow-md shadow-purple-500/20 transition-all transform active:scale-95"
          >
            Install Extension
          </button>
          <button
            type="button"
            className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
};
