'use client';

import React, { useState } from 'react';
import {
  Youtube,
  Radio,
  Languages,
  Disc,
  FolderOpen,
  Globe,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeft,
  Music2,
  Film,
  FileVideo,
  FileAudio,
  Scissors,
  Mic,
  Volume2,
  Sparkles,
  DownloadCloud,
  CheckCircle2,
  Sliders,
  Wand2,
  MessageSquare,
  RefreshCw,
  CheckCheck,
  Image as ImageIcon,
  AlignLeft,
  UserCheck,
  FileSearch,
  Cpu,
} from 'lucide-react';

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
  | 'ai-image-generator'
  | 'summarizer'
  | 'ai-humanizer'
  | 'translator'
  | 'plagiarism-checker'
  | 'workspace'
  | 'video-downloader';

interface AppSidebarProps {
  activeTool: ToolId;
  onSelectTool: (toolId: ToolId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({
  activeTool,
  onSelectTool,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AppSidebarProps) {
  const [isAiSectionOpen, setIsAiSectionOpen] = useState(true);
  const [isAudioToolsOpen, setIsAudioToolsOpen] = useState(false);
  const [isAiVoiceOpen, setIsAiVoiceOpen] = useState(false);

  const handleItemClick = (toolId: ToolId) => {
    onSelectTool(toolId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
            onClick={() => handleItemClick('transcriber')}
          >
            {/* Colorful wave brand icon matching screenshot */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-purple-500/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-base tracking-tight text-slate-900 truncate">
                Audio Transcriber <span className="text-purple-600 font-black">AI</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Toggle Sidebar"
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {/* Main Direct Tools */}
          <SidebarNavButton
            icon={<FileAudio className="w-4 h-4" />}
            label="Audio Transcriber"
            isActive={activeTool === 'transcriber'}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick('transcriber')}
          />

          <SidebarNavButton
            icon={<Youtube className="w-4 h-4 text-red-500" />}
            label="YouTube to MP3 Converter"
            isActive={activeTool === 'youtube-to-mp3'}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick('youtube-to-mp3')}
          />

          <SidebarNavButton
            icon={<Radio className="w-4 h-4 text-purple-500" />}
            label="Free AI Podcast Generator"
            isActive={activeTool === 'podcast-generator'}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick('podcast-generator')}
          />

          <SidebarNavButton
            icon={<Languages className="w-4 h-4 text-blue-500" />}
            label="Free AI Audio Translator"
            isActive={activeTool === 'audio-translator'}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick('audio-translator')}
          />

          <SidebarNavButton
            icon={<Disc className="w-4 h-4 text-emerald-500" />}
            label="Recorder & Transcriber"
            isActive={activeTool === 'recorder-transcriber'}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick('recorder-transcriber')}
          />

          {/* Collapsible Section: AI Section (QuillBot AI Tools Matching Screenshot) */}
          <div className="pt-2">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsAiSectionOpen(!isAiSectionOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-200/80 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-950 font-extrabold">AI Section</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white leading-none">
                    8 Tools
                  </span>
                  {isAiSectionOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                </div>
              </button>
            ) : (
              <div className="w-full h-px bg-slate-200 my-2" />
            )}

            {(isAiSectionOpen || isCollapsed) && (
              <div className="mt-1 space-y-0.5">
                <SidebarNavButton
                  icon={<MessageSquare className="w-4 h-4 text-blue-500" />}
                  label="AI Chat"
                  isActive={activeTool === 'ai-chat'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-chat')}
                />
                <SidebarNavButton
                  icon={<RefreshCw className="w-4 h-4 text-emerald-600" />}
                  label="Paraphrasing tool"
                  isActive={activeTool === 'paraphrasing-tool'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('paraphrasing-tool')}
                />
                <SidebarNavButton
                  icon={<CheckCheck className="w-4 h-4 text-rose-500" />}
                  label="Grammar Checker"
                  isActive={activeTool === 'grammar-checker'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('grammar-checker')}
                />
                <SidebarNavButton
                  icon={<ImageIcon className="w-4 h-4 text-amber-500" />}
                  label="AI Image Generator"
                  isActive={activeTool === 'ai-image-generator'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-image-generator')}
                />
                <SidebarNavButton
                  icon={<AlignLeft className="w-4 h-4 text-purple-500" />}
                  label="Summarizer"
                  isActive={activeTool === 'summarizer'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('summarizer')}
                />
                <SidebarNavButton
                  icon={<UserCheck className="w-4 h-4 text-teal-600" />}
                  label="AI Humanizer"
                  isActive={activeTool === 'ai-humanizer'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-humanizer')}
                />
                <SidebarNavButton
                  icon={<Languages className="w-4 h-4 text-slate-600" />}
                  label="Translator"
                  isActive={activeTool === 'translator'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('translator')}
                />
                <SidebarNavButton
                  icon={<FileSearch className="w-4 h-4 text-orange-500" />}
                  label="Plagiarism Checker"
                  isActive={activeTool === 'plagiarism-checker'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('plagiarism-checker')}
                />
              </div>
            )}
          </div>

          {/* Collapsible Section: Audio Tools */}
          <div className="pt-2">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsAudioToolsOpen(!isAudioToolsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Audio Tools</span>
                </span>
                {isAudioToolsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <div className="w-full h-px bg-slate-200 my-2" />
            )}

            {(isAudioToolsOpen || isCollapsed) && (
              <div className="mt-1 space-y-0.5">
                <SidebarNavButton
                  icon={<Music2 className="w-4 h-4 text-slate-600" />}
                  label="TikTok to MP3 Converter"
                  isActive={activeTool === 'tiktok-to-mp3'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('tiktok-to-mp3')}
                />
                <SidebarNavButton
                  icon={<Film className="w-4 h-4 text-slate-600" />}
                  label="Video to MP3 Converter"
                  isActive={activeTool === 'video-to-mp3'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('video-to-mp3')}
                />
                <SidebarNavButton
                  icon={<FileVideo className="w-4 h-4 text-slate-600" />}
                  label="MP4 to MP3 Converter"
                  isActive={activeTool === 'mp4-to-mp3'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('mp4-to-mp3')}
                />
                <SidebarNavButton
                  icon={<Youtube className="w-4 h-4 text-slate-600" />}
                  label="YouTube to WAV Converter"
                  isActive={activeTool === 'youtube-to-wav'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('youtube-to-wav')}
                />
                <SidebarNavButton
                  icon={<Scissors className="w-4 h-4 text-slate-600" />}
                  label="Extract Audio from Video"
                  isActive={activeTool === 'extract-audio'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('extract-audio')}
                />
                <SidebarNavButton
                  icon={<Languages className="w-4 h-4 text-slate-600" />}
                  label="English to Tamil Translator"
                  isActive={activeTool === 'english-to-tamil'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('english-to-tamil')}
                />
                <SidebarNavButton
                  icon={<Volume2 className="w-4 h-4 text-slate-600" />}
                  label="Voice to Text Converter"
                  isActive={activeTool === 'voice-to-text'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('voice-to-text')}
                />
                <SidebarNavButton
                  icon={<Mic className="w-4 h-4 text-slate-600" />}
                  label="Speech Transcriber"
                  isActive={activeTool === 'speech-transcriber'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('speech-transcriber')}
                />
              </div>
            )}
          </div>

          {/* Collapsible Section: AI Voice Matching User Screenshot */}
          <div className="pt-2">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsAiVoiceOpen(!isAiVoiceOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Voice</span>
                </span>
                {isAiVoiceOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <div className="w-full h-px bg-slate-200 my-2" />
            )}

            {(isAiVoiceOpen || isCollapsed) && (
              <div className="mt-1 space-y-0.5">
                <SidebarNavButton
                  icon={<Sparkles className="w-4 h-4 text-purple-600" />}
                  label="AI Voice Generator"
                  isActive={activeTool === 'ai-voice-generator'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-voice-generator')}
                />
                <SidebarNavButton
                  icon={<Mic className="w-4 h-4 text-indigo-500" />}
                  label="AI Voice Clone"
                  isActive={activeTool === 'ai-voice-clone'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-voice-clone')}
                />
                <SidebarNavButton
                  icon={<Volume2 className="w-4 h-4 text-amber-500" />}
                  label="Volume Booster"
                  isActive={activeTool === 'volume-booster'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('volume-booster')}
                />
                <SidebarNavButton
                  icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
                  label="AI Voice Cleaner"
                  isActive={activeTool === 'ai-voice-cleaner'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-voice-cleaner')}
                />
                <SidebarNavButton
                  icon={<Disc className="w-4 h-4 text-rose-500" />}
                  label="AI Vocal Remover"
                  isActive={activeTool === 'ai-vocal-remover'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-vocal-remover')}
                />
                <SidebarNavButton
                  icon={<Wand2 className="w-4 h-4 text-cyan-500" />}
                  label="AI Voice Changer"
                  isActive={activeTool === 'ai-voice-changer'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('ai-voice-changer')}
                />
                <SidebarNavButton
                  icon={<Radio className="w-4 h-4 text-blue-500" />}
                  label="Background Noise Remover"
                  isActive={activeTool === 'background-noise-remover'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('background-noise-remover')}
                />
                <SidebarNavButton
                  icon={<Music2 className="w-4 h-4 text-violet-500" />}
                  label="Background Music Remover"
                  isActive={activeTool === 'background-music-remover'}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick('background-music-remover')}
                />
              </div>
            )}
          </div>

          {/* Original Video Downloader Link */}
          <div className="pt-3">
            <SidebarNavButton
              icon={<DownloadCloud className="w-4 h-4 text-purple-600" />}
              label="Playzy Video Downloader"
              isActive={activeTool === 'video-downloader'}
              isCollapsed={isCollapsed}
              onClick={() => handleItemClick('video-downloader')}
              badge="Full Suite"
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-2 flex-shrink-0 bg-slate-50/50">
          <SidebarNavButton
            icon={<FolderOpen className="w-4 h-4 text-amber-500" />}
            label="Workspace"
            isActive={activeTool === 'workspace'}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick('workspace')}
          />

          {!isCollapsed ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-purple-50 border border-purple-200/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div className="text-[11px] leading-tight">
                  <p className="font-bold text-purple-900">100% Free</p>
                  <p className="text-purple-700">No login required</p>
                </div>
              </div>
              <Globe className="w-4 h-4 text-purple-500" />
            </div>
          ) : (
            <div className="flex justify-center py-2 text-purple-600" title="100% Free • No Login Required">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

interface SidebarNavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  badge?: string;
}

function SidebarNavButton({
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  badge,
}: SidebarNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
        isActive
          ? 'bg-purple-100/80 text-purple-900 font-semibold shadow-xs'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      }`}
    >
      <div className="flex-shrink-0 flex items-center justify-center">{icon}</div>
      {!isCollapsed && (
        <span className="truncate flex-1 text-left">{label}</span>
      )}
      {!isCollapsed && badge && (
        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-purple-200/80 text-purple-800">
          {badge}
        </span>
      )}
    </button>
  );
}
