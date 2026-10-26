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
  Search,
  Plus,
  Compass,
  Cpu,
  Layers,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
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
  isMoreModalOpen?: boolean;
  setIsMoreModalOpen?: (open: boolean) => void;
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
  isMoreModalOpen: controlledIsMoreOpen,
  setIsMoreModalOpen: controlledSetIsMoreOpen,
}: AppSidebarProps) {
  const [internalIsMoreModalOpen, setInternalIsMoreModalOpen] = useState(false);
  const isMoreModalOpen = controlledIsMoreOpen !== undefined ? controlledIsMoreOpen : internalIsMoreModalOpen;
  const setIsMoreModalOpen = controlledSetIsMoreOpen || setInternalIsMoreModalOpen;
  const { theme, toggleTheme } = useTheme();

  // Skywork Workspace Agents Navigation
  const SKYWORK_AGENTS: {
    id: ToolId;
    name: string;
    icon: React.ReactNode;
    category: CategoryId;
    badge?: string;
  }[] = [
    {
      id: 'ai-chat',
      name: 'Deep Research',
      icon: <Search className="w-4 h-4" />,
      category: 'ai-section',
      badge: 'Agent',
    },
    {
      id: 'paraphrasing-tool',
      name: 'Document Agent',
      icon: <RefreshCw className="w-4 h-4" />,
      category: 'ai-section',
    },
    {
      id: 'ai-voice-generator',
      name: 'AI Voice Studio',
      icon: <Volume2 className="w-4 h-4" />,
      category: 'ai-voice',
      badge: '36+ Voices',
    },
    {
      id: 'mp3-to-text',
      name: 'Transcriber',
      icon: <FileAudio className="w-4 h-4" />,
      category: 'audio-tools',
      badge: 'MP3 / MP4',
    },
    {
      id: 'video-downloader',
      name: 'Media Downloader',
      icon: <DownloadCloud className="w-4 h-4" />,
      category: 'video-downloader',
      badge: '4K',
    },
    {
      id: 'ai-detector',
      name: 'AI Detector',
      icon: <ShieldAlert className="w-4 h-4" />,
      category: 'ai-section',
      badge: '0-100%',
    },
    {
      id: 'ai-humanizer',
      name: 'AI Humanizer',
      icon: <UserCheck className="w-4 h-4" />,
      category: 'ai-section',
    },
    {
      id: 'grammar-checker',
      name: 'Grammar Engine',
      icon: <CheckCheck className="w-4 h-4" />,
      category: 'ai-section',
    },
    {
      id: 'workspace',
      name: 'Saved Workspace',
      icon: <FolderOpen className="w-4 h-4" />,
      category: 'workspace',
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
          className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Skywork Dark/Light Sidebar (Matching Skywork.ai layout) */}
      <aside
        className={`bg-[#F8FAFC] dark:bg-[#0F131A] border-r border-slate-200 dark:border-[#212932] w-[230px] shrink-0 py-3.5 px-3 flex flex-col justify-between text-xs text-slate-700 dark:text-slate-300 select-none z-30 transition-all ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 shadow-2xl flex bg-[#F8FAFC] dark:bg-[#0F131A]'
            : 'hidden lg:flex'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Top Logo & Title */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('ai-section');
                handleToolClick('ai-chat', 'ai-section');
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00A9C0] to-[#00c9a7] p-0.5 shadow-[0_0_15px_rgba(0,201,167,0.3)]">
                <div className="w-full h-full bg-white dark:bg-[#0F131A] rounded-[10px] flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#00c9a7]" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 2L20.3 11.7L30 16L20.3 20.3L16 30L11.7 20.3L2 16L11.7 11.7L16 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[17px] font-black tracking-tight text-slate-900 dark:text-white font-display">
                  playzy
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Skywork Agent Hub</span>
              </div>
            </button>

            {isMobileOpen && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* [+ New Chat / Project] Button (Skywork Primary Action) */}
          <button
            type="button"
            onClick={() => {
              onSelectCategory('ai-section');
              handleToolClick('ai-chat', 'ai-section');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#181D24] dark:hover:bg-[#202732] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 text-slate-900 dark:text-slate-100 font-semibold text-xs flex items-center gap-2.5 transition-all shadow-2xs cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-lg bg-[#00c9a7]/15 dark:bg-[#00c9a7]/20 flex items-center justify-center text-[#009688] dark:text-[#00c9a7] group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>New Chat / Project</span>
          </button>

          {/* Workspace Agent Navigation Section */}
          <div className="space-y-1">
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace Agents
            </p>

            <div className="space-y-0.5">
              {SKYWORK_AGENTS.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleToolClick(tool.id, tool.category)}
                    className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer font-medium ${
                      isActive
                        ? 'bg-white dark:bg-[#1C232D] text-[#009688] dark:text-white border border-slate-300 dark:border-[#00c9a7]/40 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#151B22] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={isActive ? 'text-[#009688] dark:text-[#00c9a7]' : 'text-slate-400'}>
                        {tool.icon}
                      </div>
                      <span className="truncate text-xs">{tool.name}</span>
                    </div>

                    {tool.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-[#12171F] border border-slate-300/80 dark:border-[#263241] text-slate-600 dark:text-slate-400">
                        {tool.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Pro Status & Theme Switcher & All Tools Modal Trigger */}
        <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-[#212932]">
          {/* Quick Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#151B22]"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
              <span className="text-xs font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {theme}
            </span>
          </button>

          {/* All Tools Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreModalOpen(true)}
            className="w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#151B22]"
          >
            <div className="flex items-center gap-2.5">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium">All 20+ Tools</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          </button>

          {/* Access Status Card */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#141A22] border border-slate-200 dark:border-[#263241] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]" />
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Free Pro Access</span>
            </div>
            <span className="text-[10px] text-[#009688] dark:text-[#00c9a7] font-bold">ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* "More Tools" Full Modal */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-apple-in">
          <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#263241]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#00c9a7]/20 text-[#009688] dark:text-[#00c9a7] flex items-center justify-center font-black">
                  ✦
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Playzy All Tools Suite</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pick any audio, video, or AI writing agent to begin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#202732] dark:hover:bg-[#2A3442] text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio & Video Extraction Suite */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <DownloadCloud className="w-4 h-4 text-sky-500" />
                <span>Media Download &amp; Conversion</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToolClick('video-downloader', 'video-downloader')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Playzy Video Downloader</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">YouTube, TikTok, 4K &amp; MP3</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('youtube-to-mp3', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">YouTube to MP3</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">320kbps high quality audio</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('tiktok-to-mp3', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">TikTok to MP3</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Audio &amp; watermark-free video</p>
                </button>
              </div>
            </div>

            {/* Transcription & Speech */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <FileAudio className="w-4 h-4 text-emerald-500" />
                <span>Transcription &amp; Voice Studio</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToolClick('mp3-to-text', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">MP3 to Text</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Speech-to-text with timestamps</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('mp4-to-text', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">MP4 to Text</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Extract dialogue from video</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-voice-generator', 'ai-voice')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Voice Generator</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ElevenLabs-quality 36+ voices</p>
                </button>
              </div>
            </div>

            {/* AI Writing & Detection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-[#009688] dark:text-[#00c9a7]" />
                <span>AI Writing &amp; Content Detection</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-detector', 'ai-section')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Content Detector</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">0-100% Probability Score</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-humanizer', 'ai-section')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Humanizer</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Bypass AI Detection</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('paraphrasing-tool', 'ai-section')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Paraphraser</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Fluent, Creative, Academic</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
