'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  RefreshCw,
  CheckCheck,
  Image as ImageIcon,
  AlignLeft,
  UserCheck,
  Languages,
  FileSearch,
  FileAudio,
  Youtube,
  Radio,
  Disc,
  Music2,
  FileVideo,
  Scissors,
  Mic,
  Volume2,
  Wand2,
  DownloadCloud,
  FolderOpen,
  CheckCircle2,
  Globe,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { CategoryId } from '../lib/categories';

export type ToolId =
  | 'transcriber'
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
  const [isAiSectionOpen, setIsAiSectionOpen] = useState(true);
  const [isAudioToolsOpen, setIsAudioToolsOpen] = useState(true);
  const [isAiVoiceOpen, setIsAiVoiceOpen] = useState(true);

  const handleToolClick = (toolId: ToolId, categoryId: CategoryId) => {
    onSelectTool(toolId);
    onCloseMobile();
  };

  const handleCategoryClick = (categoryId: CategoryId) => {
    onSelectCategory(categoryId);
    onCloseMobile();
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

      {/* Apple Dark Sidebar Container */}
      <aside
        className={`apple-sidebar-dark text-zinc-300 w-full lg:w-[276px] shrink-0 rounded-[18px] px-3.5 py-4 flex flex-col justify-between select-none transition-all duration-300 border border-white/5 z-50 ${
          isCollapsed ? 'lg:w-[84px]' : 'lg:w-[276px]'
        } ${
          isMobileOpen
            ? 'fixed inset-y-2 left-2 z-50 w-[290px] shadow-2xl'
            : 'hidden lg:flex'
        }`}
      >
        <div className="overflow-y-auto custom-scrollbar pr-0.5 space-y-4">
          {/* macOS Window Controls + Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <div className="flex items-center gap-3">
              {/* macOS window traffic light dots */}
              <div className="flex items-center gap-1.5 mr-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block" />
              </div>

              {!isCollapsed && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleCategoryClick('ai-section')}
                >
                  <div className="w-7 h-7 rounded-[10px] bg-gradient-to-tr from-indigo-600 via-violet-500 to-fuchsia-400 flex items-center justify-center shadow-md shadow-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="leading-none">
                    <span className="font-bold text-[14px] text-white">Audio Transcriber </span>
                    <span className="font-extrabold text-[14px] bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      AI
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 items-center justify-center text-zinc-400 hover:text-white transition"
            >
              {isCollapsed ? (
                <PanelLeft className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftClose className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 1. AI SECTION CATEGORY ACCORDION */}
          <div>
            {!isCollapsed ? (
              <div className="flex items-center gap-1 mb-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('ai-section')}
                  className={`flex-1 flex items-center justify-between px-3 py-2 rounded-2xl border transition-all text-left ${
                    activeCategory === 'ai-section' && activeTool === null
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold shadow-md'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      AI SECTION
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeCategory === 'ai-section' && activeTool === null
                        ? 'bg-zinc-950 text-white'
                        : 'bg-emerald-500 text-zinc-950'
                    }`}
                  >
                    8 TOOLS
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiSectionOpen(!isAiSectionOpen)}
                  aria-label="Toggle AI Section list"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                  {isAiSectionOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleCategoryClick('ai-section')}
                title="AI Section (8 Tools)"
                className="w-full py-2.5 flex justify-center text-emerald-400 hover:bg-white/5 rounded-xl mb-1"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            {(isAiSectionOpen || isCollapsed) && (
              <nav aria-label="AI Suite Tools" className="space-y-0.5">
                <SidebarToolPill
                  icon={<MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                  label="AI Chat"
                  isActive={activeCategory === 'ai-section' && activeTool === 'ai-chat'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-chat', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<RefreshCw className="w-3.5 h-3.5 text-emerald-400" />}
                  label="Paraphrasing tool"
                  isActive={
                    activeCategory === 'ai-section' && activeTool === 'paraphrasing-tool'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('paraphrasing-tool', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<CheckCheck className="w-3.5 h-3.5 text-rose-400" />}
                  label="Grammar Checker"
                  isActive={
                    activeCategory === 'ai-section' && activeTool === 'grammar-checker'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('grammar-checker', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />}
                  label="AI Detector"
                  isActive={activeCategory === 'ai-section' && activeTool === 'ai-detector'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-detector', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<AlignLeft className="w-3.5 h-3.5 text-purple-400" />}
                  label="Summarizer"
                  isActive={activeCategory === 'ai-section' && activeTool === 'summarizer'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('summarizer', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<UserCheck className="w-3.5 h-3.5 text-teal-400" />}
                  label="AI Humanizer"
                  isActive={activeCategory === 'ai-section' && activeTool === 'ai-humanizer'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-humanizer', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<Languages className="w-3.5 h-3.5 text-zinc-300" />}
                  label="Translator"
                  isActive={activeCategory === 'ai-section' && activeTool === 'translator'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('translator', 'ai-section')}
                />
                <SidebarToolPill
                  icon={<FileSearch className="w-3.5 h-3.5 text-orange-400" />}
                  label="Plagiarism Checker"
                  isActive={
                    activeCategory === 'ai-section' && activeTool === 'plagiarism-checker'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('plagiarism-checker', 'ai-section')}
                />
              </nav>
            )}
          </div>

          {/* 2. AUDIO TOOLS CATEGORY ACCORDION */}
          <div>
            {!isCollapsed ? (
              <div className="flex items-center gap-1 mb-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('audio-tools')}
                  className={`flex-1 flex items-center justify-between px-3 py-2 rounded-2xl border transition-all text-left ${
                    activeCategory === 'audio-tools' && activeTool === null
                      ? 'bg-blue-500 text-white border-blue-400 font-bold shadow-md'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      AUDIO TOOLS
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeCategory === 'audio-tools' && activeTool === null
                        ? 'bg-zinc-950 text-white'
                        : 'bg-blue-500 text-zinc-950'
                    }`}
                  >
                    9 TOOLS
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAudioToolsOpen(!isAudioToolsOpen)}
                  aria-label="Toggle Audio Tools list"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                  {isAudioToolsOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleCategoryClick('audio-tools')}
                title="Audio Tools (9 Tools)"
                className="w-full py-2.5 flex justify-center text-blue-400 hover:bg-white/5 rounded-xl mb-1"
              >
                <FileAudio className="w-4 h-4" />
              </button>
            )}

            {(isAudioToolsOpen || isCollapsed) && (
              <nav aria-label="Audio Tools Navigation" className="space-y-0.5">
                <SidebarToolPill
                  icon={<FileAudio className="w-3.5 h-3.5 text-zinc-300" />}
                  label="Audio Transcriber"
                  isActive={activeCategory === 'audio-tools' && activeTool === 'transcriber'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('transcriber', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Youtube className="w-3.5 h-3.5 text-rose-400" />}
                  label="YouTube to MP3 Converter"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'youtube-to-mp3'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('youtube-to-mp3', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Radio className="w-3.5 h-3.5 text-violet-400" />}
                  label="Free AI Podcast Generator"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'podcast-generator'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('podcast-generator', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Languages className="w-3.5 h-3.5 text-teal-400" />}
                  label="Free AI Audio Translator"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'audio-translator'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('audio-translator', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Disc className="w-3.5 h-3.5 text-emerald-400" />}
                  label="Recorder & Transcriber"
                  isActive={
                    activeCategory === 'audio-tools' &&
                    activeTool === 'recorder-transcriber'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('recorder-transcriber', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Music2 className="w-3.5 h-3.5 text-amber-400" />}
                  label="TikTok to MP3"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'tiktok-to-mp3'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('tiktok-to-mp3', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<FileVideo className="w-3.5 h-3.5 text-orange-400" />}
                  label="MP4 to MP3 Converter"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'mp4-to-mp3'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('mp4-to-mp3', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Youtube className="w-3.5 h-3.5 text-blue-400" />}
                  label="YouTube to WAV Converter"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'youtube-to-wav'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('youtube-to-wav', 'audio-tools')}
                />
                <SidebarToolPill
                  icon={<Scissors className="w-3.5 h-3.5 text-emerald-400" />}
                  label="Extract Audio from Video"
                  isActive={
                    activeCategory === 'audio-tools' && activeTool === 'extract-audio'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('extract-audio', 'audio-tools')}
                />
              </nav>
            )}
          </div>

          {/* 3. AI VOICE STUDIO CATEGORY ACCORDION */}
          <div>
            {!isCollapsed ? (
              <div className="flex items-center gap-1 mb-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('ai-voice')}
                  className={`flex-1 flex items-center justify-between px-3 py-2 rounded-2xl border transition-all text-left ${
                    activeCategory === 'ai-voice' && activeTool === null
                      ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-md'
                      : 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      AI VOICE STUDIO
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      activeCategory === 'ai-voice' && activeTool === null
                        ? 'bg-zinc-950 text-white'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    36+ VOICES
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiVoiceOpen(!isAiVoiceOpen)}
                  aria-label="Toggle AI Voice list"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                  {isAiVoiceOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleCategoryClick('ai-voice')}
                title="AI Voice Studio (36+ Voices)"
                className="w-full py-2.5 flex justify-center text-purple-400 hover:bg-white/5 rounded-xl mb-1"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            {(isAiVoiceOpen || isCollapsed) && (
              <nav aria-label="AI Voice Tools" className="space-y-0.5">
                <SidebarToolPill
                  icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                  label="AI Voice Generator"
                  isActive={
                    activeCategory === 'ai-voice' && activeTool === 'ai-voice-generator'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-voice-generator', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Mic className="w-3.5 h-3.5 text-indigo-400" />}
                  label="AI Voice Clone"
                  isActive={
                    activeCategory === 'ai-voice' && activeTool === 'ai-voice-clone'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-voice-clone', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                  label="Volume Booster"
                  isActive={
                    activeCategory === 'ai-voice' && activeTool === 'volume-booster'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('volume-booster', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                  label="AI Voice Cleaner"
                  isActive={
                    activeCategory === 'ai-voice' && activeTool === 'ai-voice-cleaner'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-voice-cleaner', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Disc className="w-3.5 h-3.5 text-rose-400" />}
                  label="AI Vocal Remover"
                  isActive={
                    activeCategory === 'ai-voice' && activeTool === 'ai-vocal-remover'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-vocal-remover', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Wand2 className="w-3.5 h-3.5 text-cyan-400" />}
                  label="AI Voice Changer"
                  isActive={
                    activeCategory === 'ai-voice' && activeTool === 'ai-voice-changer'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('ai-voice-changer', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Radio className="w-3.5 h-3.5 text-blue-400" />}
                  label="Background Noise Remover"
                  isActive={
                    activeCategory === 'ai-voice' &&
                    activeTool === 'background-noise-remover'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('background-noise-remover', 'ai-voice')}
                />
                <SidebarToolPill
                  icon={<Music2 className="w-3.5 h-3.5 text-orange-400" />}
                  label="Background Music Remover"
                  isActive={
                    activeCategory === 'ai-voice' &&
                    activeTool === 'background-music-remover'
                  }
                  isCollapsed={isCollapsed}
                  onClick={() => handleToolClick('background-music-remover', 'ai-voice')}
                />
              </nav>
            )}
          </div>
        </div>

        {/* Sidebar Bottom Controls: Downloader, Workspace & 100% Free Pill */}
        <div className="pt-3 border-t border-white/10 space-y-2 shrink-0">
          <button
            type="button"
            onClick={() => handleCategoryClick('video-downloader')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-[13px] font-semibold transition group ${
              activeCategory === 'video-downloader'
                ? 'bg-white text-zinc-950 shadow-md'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DownloadCloud
                className={`w-4 h-4 ${
                  activeCategory === 'video-downloader'
                    ? 'text-purple-600'
                    : 'text-purple-400'
                }`}
              />
              {!isCollapsed && <span>Playzy Downloader</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                4K HD
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleCategoryClick('workspace')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-[13px] font-semibold transition group ${
              activeCategory === 'workspace'
                ? 'bg-white text-zinc-950 shadow-md'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderOpen
                className={`w-4 h-4 ${
                  activeCategory === 'workspace' ? 'text-amber-600' : 'text-amber-400'
                }`}
              />
              {!isCollapsed && <span>Workspace</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                Ready
              </span>
            )}
          </button>

          {/* 100% Free Pill */}
          {!isCollapsed ? (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-white leading-tight">
                    100% Free
                  </div>
                  <div className="text-[10.5px] text-zinc-400">No login required</div>
                </div>
              </div>
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          ) : (
            <div
              className="flex justify-center py-1 text-emerald-400"
              title="100% Free • No Login Required"
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

interface SidebarToolPillProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarToolPill({
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
}: SidebarToolPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-2xl text-[13px] transition group ${
        isActive
          ? 'bg-white text-zinc-950 font-semibold shadow-md'
          : 'font-medium text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span
        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
          isActive ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-800/60'
        }`}
      >
        {icon}
      </span>
      {!isCollapsed && <span className="truncate text-left">{label}</span>}
    </button>
  );
}
