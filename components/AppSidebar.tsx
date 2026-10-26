'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronDown,
  Search,
  Plus,
  Sun,
  Moon,
  FileText,
  Headphones,
  Wand2,
  Radio,
  Disc,
  Mic,
  Scissors,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { CategoryId } from '../lib/categories';

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

interface SidebarToolDef {
  id: ToolId;
  name: string;
  category: CategoryId;
  categoryName: string;
  icon: React.ReactNode;
  badge?: string;
  highlight?: boolean;
}

interface SidebarCategoryDef {
  id: CategoryId;
  name: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
  tools: SidebarToolDef[];
}

export function AppSidebar({
  activeCategory,
  activeTool,
  onSelectCategory,
  onSelectTool,
  isMobileOpen,
  onCloseMobile,
  isMoreModalOpen: controlledIsMoreOpen,
  setIsMoreModalOpen: controlledSetIsMoreOpen,
}: AppSidebarProps) {
  const [internalIsMoreModalOpen, setInternalIsMoreModalOpen] = useState(false);
  const isMoreModalOpen =
    controlledIsMoreOpen !== undefined ? controlledIsMoreOpen : internalIsMoreModalOpen;
  const setIsMoreModalOpen = controlledSetIsMoreOpen || setInternalIsMoreModalOpen;
  const { theme, toggleTheme } = useTheme();

  // Search filter inside sidebar
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Collapsible category state (all open by default so user sees every tool)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'ai-section': false,
    'audio-tools': false,
    'ai-voice': false,
  });

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Top standalone tools
  const PRIMARY_TOOLS: SidebarToolDef[] = [
    {
      id: 'video-downloader',
      name: 'Media Downloader',
      category: 'video-downloader',
      categoryName: 'Video Downloader',
      icon: <DownloadCloud className="w-4 h-4 text-sky-500 shrink-0" />,
      badge: '4K & MP3',
      highlight: true,
    },
    {
      id: 'workspace',
      name: 'Saved Workspace',
      category: 'workspace',
      categoryName: 'Workspace History',
      icon: <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />,
      badge: 'Files',
    },
  ];

  // Complete categorized tool suites (all 26 category tools + 2 primary = 28 tools)
  const TOOL_CATEGORIES: SidebarCategoryDef[] = useMemo(
    () => [
      {
        id: 'ai-section',
        name: 'AI Writing & Agents',
        count: 8,
        colorClass: 'text-emerald-500',
        icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
        tools: [
          {
            id: 'ai-chat',
            name: 'AI Chat (Research)',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
            badge: 'Agent',
            highlight: true,
          },
          {
            id: 'paraphrasing-tool',
            name: 'Paraphrasing Tool',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <RefreshCw className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
            badge: 'Fluency',
          },
          {
            id: 'grammar-checker',
            name: 'Grammar Checker',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <CheckCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
            badge: '0 Errors',
          },
          {
            id: 'ai-detector',
            name: 'AI Detector',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
            badge: '0-100%',
            highlight: true,
          },
          {
            id: 'summarizer',
            name: 'Summarizer',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
            badge: '-75%',
          },
          {
            id: 'ai-humanizer',
            name: 'AI Humanizer',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <UserCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />,
            badge: '100% Human',
            highlight: true,
          },
          {
            id: 'translator',
            name: 'Translator',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <Languages className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
            badge: '30+ Lang',
          },
          {
            id: 'plagiarism-checker',
            name: 'Plagiarism Checker',
            category: 'ai-section',
            categoryName: 'AI Section',
            icon: <FileSearch className="w-3.5 h-3.5 text-cyan-500 shrink-0" />,
            badge: 'Deep Scan',
          },
        ],
      },
      {
        id: 'audio-tools',
        name: 'Audio & Transcription',
        count: 10,
        colorClass: 'text-teal-500',
        icon: <Headphones className="w-3.5 h-3.5 text-teal-500 shrink-0" />,
        tools: [
          {
            id: 'transcriber',
            name: 'MP3 to Text',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Headphones className="w-3.5 h-3.5 text-teal-500 shrink-0" />,
            badge: 'MP3 Only',
            highlight: true,
          },
          {
            id: 'mp4-to-text',
            name: 'MP4 to Text',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <FileVideo className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
            badge: 'MP4 Only',
            highlight: true,
          },
          {
            id: 'youtube-to-mp3',
            name: 'YouTube to MP3',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Youtube className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
            badge: 'Link Only',
            highlight: true,
          },
          {
            id: 'tiktok-to-mp3',
            name: 'TikTok to MP3',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Music2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />,
            badge: 'Link Only',
          },
          {
            id: 'podcast-generator',
            name: 'AI Podcast Studio',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Radio className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
            badge: 'Dual Host',
          },
          {
            id: 'audio-translator',
            name: 'AI Audio Translator',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Languages className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
            badge: '40+ Lang',
          },
          {
            id: 'recorder-transcriber',
            name: 'Voice Recorder',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Mic className="w-3.5 h-3.5 text-red-500 shrink-0" />,
            badge: 'Live Mic',
          },
          {
            id: 'mp4-to-mp3',
            name: 'MP4 to MP3',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Disc className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
            badge: 'Convert',
          },
          {
            id: 'youtube-to-wav',
            name: 'YouTube to WAV',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <FileAudio className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
            badge: '24-bit',
          },
          {
            id: 'extract-audio',
            name: 'Extract Audio',
            category: 'audio-tools',
            categoryName: 'Audio Tools',
            icon: <Scissors className="w-3.5 h-3.5 text-cyan-500 shrink-0" />,
            badge: 'Demux',
          },
        ],
      },
      {
        id: 'ai-voice',
        name: 'AI Voice & Audio DSP',
        count: 8,
        colorClass: 'text-purple-500',
        icon: <Volume2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
        tools: [
          {
            id: 'ai-voice-generator',
            name: 'AI Voice Generator',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Volume2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
            badge: '36+ Voices',
            highlight: true,
          },
          {
            id: 'ai-voice-clone',
            name: 'AI Voice Clone',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Mic className="w-3.5 h-3.5 text-pink-500 shrink-0" />,
            badge: 'Instant',
          },
          {
            id: 'volume-booster',
            name: 'Volume Booster',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Sliders className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
            badge: '400%',
          },
          {
            id: 'ai-voice-cleaner',
            name: 'AI Voice Cleaner',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Wand2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
            badge: 'Denoise',
          },
          {
            id: 'ai-vocal-remover',
            name: 'AI Vocal Remover',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Music2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
            badge: 'Stems',
          },
          {
            id: 'ai-voice-changer',
            name: 'AI Voice Changer',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />,
            badge: 'Real-time',
          },
          {
            id: 'background-noise-remover',
            name: 'Noise Remover',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Headphones className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
            badge: 'Spectral',
          },
          {
            id: 'background-music-remover',
            name: 'Music Remover',
            category: 'ai-voice',
            categoryName: 'AI Voice Studio',
            icon: <Disc className="w-3.5 h-3.5 text-orange-500 shrink-0" />,
            badge: 'Speech',
          },
        ],
      },
    ],
    []
  );

  // All tools flat array for fast real-time search
  const ALL_FLAT_TOOLS = useMemo(() => {
    return [...PRIMARY_TOOLS, ...TOOL_CATEGORIES.flatMap((c) => c.tools)];
  }, [PRIMARY_TOOLS, TOOL_CATEGORIES]);

  // Search filtered results
  const searchResults = useMemo(() => {
    const q = sidebarSearch.trim().toLowerCase();
    if (!q) return null;
    return ALL_FLAT_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q) ||
        (tool.badge && tool.badge.toLowerCase().includes(q))
    );
  }, [sidebarSearch, ALL_FLAT_TOOLS]);

  const handleToolClick = (toolId: ToolId, categoryId: CategoryId) => {
    onSelectCategory(categoryId);
    onSelectTool(toolId);
    onCloseMobile();
    setIsMoreModalOpen(false);
  };

  const isToolActive = (toolId: ToolId) => {
    if (activeTool === toolId) return true;
    if (toolId === 'transcriber' && activeTool === 'mp3-to-text') return true;
    if (toolId === 'mp3-to-text' && activeTool === 'transcriber') return true;
    if (toolId === 'video-downloader' && activeCategory === 'video-downloader' && activeTool === null) return true;
    if (toolId === 'workspace' && activeCategory === 'workspace' && activeTool === null) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Skywork Pro Sidebar Rail - All Tools Visible */}
      <aside
        className={`bg-[#F8FAFC] dark:bg-[#0F131A] border-r border-slate-200 dark:border-[#212932] w-[298px] shrink-0 flex flex-col justify-between text-xs text-slate-700 dark:text-slate-300 select-none z-30 transition-all ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 shadow-2xl flex bg-[#F8FAFC] dark:bg-[#0F131A] h-full w-[298px] max-w-[88vw]'
            : 'hidden lg:flex sticky top-14 h-[calc(100vh-3.5rem)]'
        }`}
      >
        {/* Top Fixed Area: Brand Logo + Primary Action + In-sidebar Search */}
        <div className="p-3 pb-2 flex flex-col gap-2.5 shrink-0 border-b border-slate-200/80 dark:border-[#1E252F]">
          {/* Brand Row */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('ai-section');
                handleToolClick('ai-chat', 'ai-section');
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00A9C0] to-[#00c9a7] p-[1.5px] shadow-[0_0_12px_rgba(0,201,167,0.35)] group-hover:shadow-[0_0_18px_rgba(0,201,167,0.55)] transition-all">
                <div className="w-full h-full bg-[#0A0E14] rounded-[6.5px] flex items-center justify-center p-0.5 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 128 128" fill="none">
                    <path
                      d="M28 20C28 15.39 33.02 12.55 37.01 14.89L96.01 49.89C99.98 52.24 99.98 57.76 96.01 60.11L62 80L28 58V20Z"
                      fill="url(#sidebarLogoGrad)"
                    />
                    <path
                      d="M28 58L62 80L37.01 94.41C33.02 96.72 28 93.88 28 89.27V58Z"
                      fill="url(#sidebarLogoFacet)"
                    />
                    <path
                      d="M28 58L62 80L96.01 60.11"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeOpacity="0.75"
                    />
                    <path
                      d="M104 46C109 52 112 59 112 66C112 73 109 80 104 86"
                      stroke="url(#sidebarLogoGrad)"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeOpacity="0.9"
                    />
                    <g transform="translate(62, 58)">
                      <path
                        d="M0 -14C0.8 -5 5 -0.8 14 0C5 0.8 0.8 5 0 14C-0.8 5 -5 0.8 -14 0C-5 -0.8 -0.8 -5 0 -14Z"
                        fill="#FFFFFF"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="sidebarLogoGrad"
                        x1="16"
                        y1="16"
                        x2="112"
                        y2="112"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#00F5D4" />
                        <stop offset="50%" stopColor="#00C9A7" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                      <linearGradient
                        id="sidebarLogoFacet"
                        x1="20"
                        y1="50"
                        x2="70"
                        y2="110"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#7000FF" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#00C9A7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white font-display">
                    playzy
                  </span>
                  <span className="px-1 py-0.2 rounded text-[8px] font-extrabold uppercase bg-[#00c9a7]/15 text-[#009688] dark:text-[#00c9a7]">
                    28 TOOLS
                  </span>
                </div>
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

          {/* [+ New Chat / Project] Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              onSelectCategory('ai-section');
              handleToolClick('ai-chat', 'ai-section');
            }}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#181D24] dark:hover:bg-[#202732] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center justify-between transition-all shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-4.5 h-4.5 rounded-md bg-[#00c9a7]/15 dark:bg-[#00c9a7]/20 flex items-center justify-center text-[#009688] dark:text-[#00c9a7] group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>New Chat / Project</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">⌘K</span>
          </button>

          {/* In-sidebar Tool Filter Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search 28 tools..."
              className="w-full bg-slate-100/80 dark:bg-[#141A22] border border-slate-200 dark:border-[#222B36] rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00c9a7]/60 transition"
            />
            {sidebarSearch && (
              <button
                type="button"
                onClick={() => setSidebarSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Tool Navigation Rail */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3.5 custom-scrollbar">
          {/* SEARCH RESULTS VIEW */}
          {searchResults !== null ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Matching Tools ({searchResults.length})</span>
                <button
                  type="button"
                  onClick={() => setSidebarSearch('')}
                  className="text-[#009688] dark:text-[#00c9a7] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No tools found for &quot;{sidebarSearch}&quot;
                </div>
              ) : (
                <div className="space-y-0.5">
                  {searchResults.map((tool) => {
                    const active = isToolActive(tool.id);
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleToolClick(tool.id, tool.category)}
                        className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer font-medium relative group/item ${
                          active
                            ? 'bg-white dark:bg-[#1C232D] text-[#009688] dark:text-white border border-slate-300 dark:border-[#00c9a7]/40 shadow-xs font-bold before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[#00c9a7] before:rounded-full'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#151B22] hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pl-1">
                          <div className="shrink-0">{tool.icon}</div>
                          <span className="truncate text-xs">{tool.name}</span>
                        </div>
                        <span className="text-[9.5px] font-semibold px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-[#12171F] border border-slate-300/80 dark:border-[#263241] text-slate-500 dark:text-slate-400">
                          {tool.categoryName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* DEFAULT CATEGORIZED ALL-TOOLS VIEW */
            <>
              {/* Standalone Quick Access (Downloader & Workspace) */}
              <div className="space-y-0.5">
                <p className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Media &amp; Workspace
                </p>
                {PRIMARY_TOOLS.map((tool) => {
                  const active = isToolActive(tool.id);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleToolClick(tool.id, tool.category)}
                      className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer font-medium relative group/item ${
                        active
                          ? 'bg-white dark:bg-[#1C232D] text-[#009688] dark:text-white border border-slate-300 dark:border-[#00c9a7]/40 shadow-xs font-bold before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[#00c9a7] before:rounded-full'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#151B22] hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pl-1">
                        <div className="shrink-0 group-hover/item:scale-105 transition-transform">
                          {tool.icon}
                        </div>
                        <span className="truncate text-xs">{tool.name}</span>
                      </div>
                      {tool.badge && (
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-[#12171F] border border-slate-300/80 dark:border-[#263241] text-slate-600 dark:text-slate-400">
                          {tool.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Complete Categorized Sections */}
              {TOOL_CATEGORIES.map((category) => {
                const isCollapsed = collapsedSections[category.id] ?? false;
                return (
                  <div key={category.id} className="space-y-1">
                    {/* Category Header with Accordion Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSection(category.id)}
                      className="w-full px-2 py-1 flex items-center justify-between text-left rounded-md hover:bg-slate-200/40 dark:hover:bg-[#161C24] transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5">
                        {category.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                          {category.name}
                        </span>
                        <span className="text-[9px] font-extrabold px-1 rounded-sm bg-slate-200/60 dark:bg-[#161C24] text-slate-500 dark:text-slate-400">
                          {category.count}
                        </span>
                      </div>
                      <div className="text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </button>

                    {/* Tools in this category */}
                    {!isCollapsed && (
                      <div className="space-y-0.5 pl-1 border-l border-slate-200/60 dark:border-[#1E252F] ml-2">
                        {category.tools.map((tool) => {
                          const active = isToolActive(tool.id);
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => handleToolClick(tool.id, tool.category)}
                              className={`w-full px-2 py-1.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer font-medium relative group/item ${
                                active
                                  ? 'bg-white dark:bg-[#1C232D] text-[#009688] dark:text-white border border-slate-300 dark:border-[#00c9a7]/40 shadow-xs font-bold before:absolute before:left-0.5 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[#00c9a7] before:rounded-full'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#151B22] hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pl-1">
                                <div className="shrink-0 group-hover/item:scale-105 transition-transform">
                                  {tool.icon}
                                </div>
                                <span className="truncate text-[11.5px] leading-tight">
                                  {tool.name}
                                </span>
                              </div>

                              {tool.badge && (
                                <span className="text-[9px] font-bold px-1.2 py-0.2 rounded bg-slate-200/70 dark:bg-[#12171F] border border-slate-300/80 dark:border-[#263241] text-slate-500 dark:text-slate-400 shrink-0">
                                  {tool.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Bottom Pinned Footer: Pro Status + Light/Dark Mode Switcher */}
        <div className="p-2.5 space-y-2 shrink-0 border-t border-slate-200 dark:border-[#212932] bg-[#F8FAFC] dark:bg-[#0F131A]">
          {/* Quick Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#151B22]"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span className="text-xs font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <span className="text-[9.5px] uppercase font-bold text-slate-400">
              {theme}
            </span>
          </button>

          {/* Access Status Card */}
          <div className="p-2 rounded-lg bg-white dark:bg-[#141A22] border border-slate-200 dark:border-[#263241] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00c9a7] shadow-[0_0_8px_#00c9a7]" />
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                Free Pro Access
              </span>
            </div>
            <span className="text-[9.5px] text-[#009688] dark:text-[#00c9a7] font-bold">
              28 TOOLS ACTIVE
            </span>
          </div>
        </div>
      </aside>

      {/* "More Tools" Full Modal (kept as quick search modal shortcut) */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-apple-in">
          <div className="bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#263241]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#00c9a7]/20 text-[#009688] dark:text-[#00c9a7] flex items-center justify-center font-black">
                  ✦
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Playzy All 28 Tools Suite
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pick any audio, video, or AI writing agent to begin
                  </p>
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
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Playzy Video Downloader
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    YouTube, TikTok, 4K &amp; MP3
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('youtube-to-mp3', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    YouTube to MP3
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    320kbps high quality audio
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('tiktok-to-mp3', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    TikTok to MP3
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Audio &amp; watermark-free video
                  </p>
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
                  onClick={() => handleToolClick('transcriber', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">MP3 to Text</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Speech-to-text with timestamps
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('mp4-to-text', 'audio-tools')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">MP4 to Text</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Extract dialogue from video
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-voice-generator', 'ai-voice')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    AI Voice Generator
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ElevenLabs-quality 36+ voices
                  </p>
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
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    AI Content Detector
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    0-100% Probability Score
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-humanizer', 'ai-section')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    AI Humanizer
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Bypass AI Detection
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('paraphrasing-tool', 'ai-section')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#12171F] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 hover:bg-slate-100 dark:hover:bg-[#1A222D] text-left transition"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Paraphraser</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Fluent, Creative, Academic
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
