'use client';

import React from 'react';
import { Play, Sparkles, DownloadCloud, FileAudio } from 'lucide-react';
import { CapabilitiesResponse } from '../lib/types';

interface NavbarProps {
  capabilities?: CapabilitiesResponse | null;
  loadingCapabilities?: boolean;
  activeTab?: 'downloader' | 'transcriber';
  onTabChange?: (tab: 'downloader' | 'transcriber') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  capabilities,
  loadingCapabilities,
  activeTab = 'downloader',
  onTabChange,
}) => {
  return (
    <header className="w-full bg-white/75 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-white/10 transition-colors">
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

        {/* Center Mode Switcher Tabs */}
        {onTabChange && (
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => onTabChange('downloader')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'downloader'
                  ? 'bg-white dark:bg-white/15 text-purple-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Downloader</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange('transcriber')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'transcriber'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileAudio className="w-4 h-4" />
              <span>AI Transcriber</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                New
              </span>
            </button>
          </div>
        )}

        {/* Right CTA / Links */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-gray-400">
            <a href="#how-it-works" className="hover:text-purple-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-purple-600 transition-colors">
              FAQ
            </a>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (onTabChange) {
                onTabChange(activeTab === 'downloader' ? 'transcriber' : 'downloader');
              }
            }}
            className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] hover:opacity-95 shadow-md shadow-purple-500/20 transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeTab === 'downloader' ? 'Transcribe AI' : 'Download Video'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
