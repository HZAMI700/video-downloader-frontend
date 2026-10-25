'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCheck,
  ShieldAlert,
  FileSearch,
  UserCheck,
  MessageSquare,
  Volume2,
  Languages,
  MoreHorizontal,
  FileAudio,
  FileVideo,
  Youtube,
  Music2,
  DownloadCloud,
  FolderOpen,
  Sliders,
  X,
  ChevronRight,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { CategoryId, CATEGORIES } from '../lib/categories';

export type ToolId =
  | 'transcriber'
  | 'mp3-to-text'
  | 'mp4-to-text'
  | 'youtube-to-mp3'
  | 'podcast-generator'
  | 'audio-translator'
  | 'recorder-transcriber'
  | 'tiktok-to-mp3'
  | 'video-to-mp3'
  | 'mp4-to-mp3'
  | 'youtube-to-wav'
  | 'extract-audio'
  | 'english-to-tamil'
  | 'voice-to-text'
  | 'speech-transcriber'
  | 'ai-voice-generator'
  | 'ai-voice-clone'
  | 'volume-booster'
  | 'ai-voice-cleaner'
  | 'ai-vocal-remover'
  | 'ai-voice-changer'
  | 'background-noise-remover'
  | 'background-music-remover'
  | 'text-to-speech'
  | 'ai-section'
  | 'ai-chat'
  | 'paraphrasing-tool'
  | 'grammar-checker'
  | 'ai-detector'
  | 'summarizer'
  | 'ai-humanizer'
  | 'translator'
  | 'plagiarism-checker'
  | 'workspace'
  | 'video-downloader';

interface AppSidebarProps {
  activeCategory: CategoryId;
  activeTool: ToolId | null;
  onSelectCategory: (categoryId: CategoryId) => void;
  onSelectTool: (toolId: ToolId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({
  activeCategory,
  activeTool,
  onSelectCategory,
  onSelectTool,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AppSidebarProps) {
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

  // Exact vertical rail tools matching screenshot
  const PRIMARY_TOOLS: {
    id: ToolId;
    name: string;
    icon: React.ReactNode;
    category: CategoryId;
  }[] = [
    {
      id: 'paraphrasing-tool',
      name: 'Paraphraser',
      icon: <RefreshCw className="w-5 h-5" />,
      category: 'ai-section',
    },
    {
      id: 'grammar-checker',
      name: 'Grammar Checker',
      icon: <CheckCheck className="w-5 h-5" />,
      category: 'ai-section',
    },
    {
      id: 'ai-detector',
      name: 'AI Detector',
      icon: <ShieldAlert className="w-5 h-5" />,
      category: 'ai-section',
    },
    {
      id: 'plagiarism-checker',
      name: 'Plagiarism Checker',
      icon: <FileSearch className="w-5 h-5" />,
      category: 'ai-section',
    },
    {
      id: 'ai-humanizer',
      name: 'AI Humanizer',
      icon: <UserCheck className="w-5 h-5" />,
      category: 'ai-section',
    },
    {
      id: 'ai-chat',
      name: 'AI Chat',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'ai-section',
    },
    {
      id: 'ai-voice-generator',
      name: 'AI Voice Generator',
      icon: <Volume2 className="w-5 h-5" />,
      category: 'ai-voice',
    },
    {
      id: 'translator',
      name: 'Translate',
      icon: <Languages className="w-5 h-5" />,
      category: 'ai-section',
    },
  ];

  const handleToolClick = (toolId: ToolId, categoryId: CategoryId) => {
    onSelectCategory(categoryId);
    onSelectTool(toolId);
    onCloseMobile();
    setIsMoreModalOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Slim Light Sidebar Rail Matching Screenshot */}
      <aside
        className={`bg-white border-r border-slate-200/80 w-[78px] sm:w-[84px] shrink-0 py-3 flex flex-col justify-between items-center select-none z-50 transition-all ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 shadow-2xl flex'
            : 'hidden lg:flex'
        }`}
      >
        {/* Top Logo / Brand mark */}
        <div className="flex flex-col items-center gap-1 pb-3 mb-1 border-b border-slate-100 w-full px-2">
          <button
            type="button"
            onClick={() => {
              onSelectTool(null as any);
              onCloseMobile();
            }}
            title="Playzy Home"
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#499557] to-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
          >
            {/* Playzy Brand Icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
            </svg>
          </button>
          <span className="text-[11px] font-black tracking-tight text-slate-800">playzy</span>
        </div>

        {/* Vertical Tool Navigation List Matching Screenshot */}
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center gap-1.5 px-1.5">
          {PRIMARY_TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleToolClick(tool.id, tool.category)}
                title={tool.name}
                className={`w-full py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition-all ${
                  isActive
                    ? 'bg-[#edf7ee] text-[#499557] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <div className={isActive ? 'text-[#499557]' : 'text-slate-500'}>
                  {tool.icon}
                </div>
                <span className="text-[10px] leading-tight line-clamp-2 max-w-[68px]">
                  {tool.name}
                </span>
              </button>
            );
          })}

          {/* "More" Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMoreModalOpen(true)}
            title="More Tools"
            className="w-full py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 text-center text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all font-medium mt-1"
          >
            <MoreHorizontal className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] leading-tight">More</span>
          </button>
        </div>

        {/* Bottom User / Premium Indicator */}
        <div className="pt-2 border-t border-slate-100 w-full px-2 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMoreModalOpen(true)}
            title="Open all tools"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* "More Tools" Full Suite Flyout / Modal */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-apple-in">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#edf7ee] text-[#499557] flex items-center justify-center font-black">
                  ✦
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Playzy All Tools Suite</h3>
                  <p className="text-xs text-slate-500">Pick any audio, video, or AI writing tool to begin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio & Video Extraction Suite */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Audio &amp; Video Transcriber
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToolClick('mp3-to-text', 'audio-tools')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 text-left transition"
                >
                  <FileAudio className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">MP3 to Text</p>
                    <p className="text-[10.5px] text-slate-400">Strictly .mp3 audio only</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('mp4-to-text', 'audio-tools')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 text-left transition"
                >
                  <FileVideo className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">MP4 to Text</p>
                    <p className="text-[10.5px] text-slate-400">Strictly .mp4 video only</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('youtube-to-mp3', 'audio-tools')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/80 border border-slate-200/80 text-left transition"
                >
                  <Youtube className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">YouTube to MP3</p>
                    <p className="text-[10.5px] text-slate-400">Link input only (320kbps)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('tiktok-to-mp3', 'audio-tools')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200/80 text-left transition"
                >
                  <Music2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">TikTok to MP3</p>
                    <p className="text-[10.5px] text-slate-400">Link input only (No watermark)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('video-downloader', 'video-downloader')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200/80 text-left transition"
                >
                  <DownloadCloud className="w-5 h-5 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Playzy Video Downloader</p>
                    <p className="text-[10.5px] text-slate-400">YouTube, TikTok, Vimeo, 1000+</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('workspace', 'workspace')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition"
                >
                  <FolderOpen className="w-5 h-5 text-slate-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Saved Workspace</p>
                    <p className="text-[10.5px] text-slate-400">History &amp; exported files</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Audio DSP & Voice Mastering */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Audio DSP &amp; Studio Tools
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToolClick('volume-booster', 'ai-voice')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200/80 text-left transition"
                >
                  <Volume2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Volume Booster</p>
                    <p className="text-[10.5px] text-slate-400">Up to 400% loudness</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('ai-voice-cleaner', 'ai-voice')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 text-left transition"
                >
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">AI Voice Cleaner</p>
                    <p className="text-[10.5px] text-slate-400">Remove hiss, hum &amp; clicks</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToolClick('ai-vocal-remover', 'ai-voice')}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/80 border border-slate-200/80 text-left transition"
                >
                  <Music2 className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">AI Vocal Remover</p>
                    <p className="text-[10.5px] text-slate-400">Acapella &amp; Karaoke isolation</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
