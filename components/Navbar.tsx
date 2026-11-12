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
    <header className="w-full bg-surface/75 sticky top-0 z-50 border-b border-line transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo: Playzy */}
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-on-accent transition-transform duration-200">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-accent">
              Playzy
            </span>
          </a>
          {capabilities && (
            <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-soft text-accent border border-accent/30">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              API Ready
            </span>
          )}
        </div>

        {/* Center Mode Switcher Tabs */}
        {onTabChange && (
          <div className="flex p-1 bg-sunken border border-line rounded-2xl">
            <button
              type="button"
              onClick={() => onTabChange('downloader')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'downloader'
                  ? 'bg-surface text-muted'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Downloader</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange('transcriber')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'transcriber'
                  ? ' bg-accent text-on-accent'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <FileAudio className="w-4 h-4" />
              <span>AI Transcriber</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-xs uppercase font-medium bg-accent/20 text-accent">
                New
              </span>
            </button>
          </div>
        )}

        {/* Right CTA / Links */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-muted">
            <a href="#how-it-works" className="hover:text-muted transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-muted transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-muted transition-colors">
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
            className="px-4 py-2 rounded-xl font-medium text-xs sm:text-sm text-on-accent bg-accent hover:bg-accent transition-all transform flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeTab === 'downloader' ? 'Transcribe AI' : 'Download Video'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
