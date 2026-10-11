'use client';

import React from 'react';
import { Download, Sparkles, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CapabilitiesResponse } from '../lib/types';

interface NavbarProps {
  capabilities: CapabilitiesResponse | null;
  loadingCapabilities: boolean;
  capabilitiesError: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  capabilities,
  loadingCapabilities,
  capabilitiesError,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                VidStream Pro
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                Cloud
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Universal High-Definition Media Downloader
            </p>
          </div>
        </div>

        {/* Backend & FFmpeg Status Indicator */}
        <div className="flex items-center gap-3">
          {loadingCapabilities ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Connecting to API...</span>
            </div>
          ) : capabilitiesError ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-xs text-red-300">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Backend Offline:</span>
              <span className="font-mono text-[11px]">Check NEXT_PUBLIC_BACKEND_URL</span>
            </div>
          ) : capabilities ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium hidden sm:inline">API Online</span>
                <span className="text-[10px] text-emerald-400/80 font-mono">v{capabilities.ytdlp_version.slice(0, 8)}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${
                capabilities.ffmpeg_available
                  ? 'bg-indigo-950/40 border-indigo-800/50 text-indigo-300'
                  : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">
                  {capabilities.ffmpeg_available ? 'FFmpeg Active' : 'Direct Streams'}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
