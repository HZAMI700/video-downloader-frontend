'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Plus,
  ArrowRight,
  FileText,
  FileCheck2,
  Share2,
  Upload,
  Crown,
  ChevronRight,
  Compass,
  Grid,
  Check,
  MessageSquare,
  FileAudio,
  FileVideo,
  Youtube,
  Music2,
  Volume2,
  Languages,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import { CATEGORIES } from '../../lib/categories';

interface PlayzyHomeScreenProps {
  onSelectTool: (toolId: ToolId, initialText?: string) => void;
  onOpenAllToolsModal?: () => void;
}

export function PlayzyHomeScreen({
  onSelectTool,
  onOpenAllToolsModal,
}: PlayzyHomeScreenProps) {
  const [promptText, setPromptText] = useState('');
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleActionClick = (toolId: ToolId) => {
    onSelectTool(toolId, promptText);
  };

  const handleCardClick = (presetText: string, toolId: ToolId = 'ai-chat') => {
    setPromptText(presetText);
    onSelectTool(toolId, presetText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setPromptText(text.slice(0, 10000));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-7 animate-apple-in">
      {/* Hidden Doc/Text File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Banner Matching Screenshot */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-2xs">
          {/* Laurel wreath icon */}
          <span className="text-emerald-600 text-sm">🌿</span>
          <span>Perfect your writing everywhere</span>
          <span className="text-emerald-600 text-sm">🌿</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Add to Browser. It&apos;s Free</span>
        </div>
      </div>

      {/* Hero Headline & Subtitle Matching Screenshot */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto pt-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Create something great today
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Write, design, build, and so much more with AI tools for every task.
        </p>
      </div>

      {/* Central Command Prompt Box Matching Screenshot */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#f2f7f4] rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3 border border-slate-200/90 shadow-sm transition-all focus-within:ring-3 focus-within:ring-[#499557]/20 focus-within:border-[#499557]">
          {/* Text Area Card */}
          <div className="bg-white rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 shadow-2xs border border-slate-100 flex flex-col justify-between min-h-[140px] sm:min-h-[160px]">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Write, paste, upload, or start with an action below"
              className="w-full bg-transparent resize-none border-none text-slate-800 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-normal min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleActionClick(promptText ? 'paraphrasing-tool' : 'ai-chat');
                }
              }}
            />

            {/* Bottom Inner Controls: Attachment + Character Count + Arrow button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Document (.txt, .md, .doc)"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 font-medium">
                  {promptText ? `${promptText.trim().split(/\s+/).filter(Boolean).length} words` : 'Upload doc'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleActionClick(promptText ? 'paraphrasing-tool' : 'ai-chat')}
                  className="w-9 h-9 rounded-full bg-[#e3eae5] hover:bg-[#499557] hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs active:scale-95"
                  title="Submit and create"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Pills Row Matching Screenshot */}
          <div className="flex flex-wrap items-center justify-start gap-2 pt-2.5 px-1">
            <button
              type="button"
              onClick={() => handleActionClick('ai-chat')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
            >
              <span>📝</span>
              <span>Create</span>
            </button>

            <button
              type="button"
              onClick={() => handleActionClick('paraphrasing-tool')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paraphraser</span>
            </button>

            <button
              type="button"
              onClick={() => handleActionClick('ai-humanizer')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>AI Humanizer</span>
            </button>

            <button
              type="button"
              onClick={() => handleActionClick('ai-detector')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Detector</span>
            </button>

            <button
              type="button"
              onClick={() => setShowToolsDrawer(!showToolsDrawer)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-[13px] font-bold shadow-2xs transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Tools Drawer (When clicking "+ More") */}
      {showToolsDrawer && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-lg space-y-4 animate-apple-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#499557]" />
              <span>All Playzy AI &amp; Media Tools</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowToolsDrawer(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectTool('mp3-to-text')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition"
            >
              <FileAudio className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">MP3 to Text</p>
                <p className="text-[10px] text-slate-400">Strictly .mp3</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('mp4-to-text')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition"
            >
              <FileVideo className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">MP4 to Text</p>
                <p className="text-[10px] text-slate-400">Strictly .mp4</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('youtube-to-mp3')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 text-left transition"
            >
              <Youtube className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">YouTube MP3</p>
                <p className="text-[10px] text-slate-400">Link Only</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('tiktok-to-mp3')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 text-left transition"
            >
              <Music2 className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">TikTok MP3</p>
                <p className="text-[10px] text-slate-400">Link Only</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('ai-voice-generator')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 text-left transition"
            >
              <Volume2 className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">AI Voice Studio</p>
                <p className="text-[10px] text-slate-400">36+ Voices</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('translator')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 text-left transition"
            >
              <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Translator</p>
                <p className="text-[10px] text-slate-400">40+ Langs</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('grammar-checker')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 text-left transition"
            >
              <FileCheck2 className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Grammar</p>
                <p className="text-[10px] text-slate-400">0 Errors</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('video-downloader')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition"
            >
              <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Playzy Video</p>
                <p className="text-[10px] text-slate-400">Downloader</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* "Need an Idea? Try one of these..." Section Matching Screenshot */}
      <div className="max-w-3xl mx-auto space-y-3 pt-3">
        <p className="text-xs font-medium text-slate-400 text-center">
          Need an Idea? Try one of these...
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Create presentations */}
          <div
            onClick={() =>
              handleCardClick(
                'Create a pitch deck outline for an innovative B2B AI SaaS product with market opportunity and revenue model.',
                'ai-chat'
              )
            }
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg">📑</span>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  Create presentations
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Create a pitch deck for a SaaS marketin...
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Create resumes */}
          <div
            onClick={() =>
              handleCardClick(
                'Draft a professional resume summary for a software engineer specializing in Next.js, FastAPI, and machine learning.',
                'paraphrasing-tool'
              )
            }
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg">📄</span>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  Create resumes
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Create a resume for a business internsh...
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Create social media posts */}
          <div
            onClick={() =>
              handleCardClick(
                'Create an engaging Instagram post announcing our new AI audio transcription and voice generator release with hashtags.',
                'ai-chat'
              )
            }
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg">💬</span>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  Create social media posts
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Create an Instagram post announcing a...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Matching Screenshot */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-slate-400">
          Ensure you have the rights to images or files you upload. Comply with our{' '}
          <span className="underline hover:text-slate-600 cursor-pointer">Copyright Policy</span> and{' '}
          <span className="underline hover:text-slate-600 cursor-pointer">Community Guidelines</span>.
        </p>
      </div>
    </div>
  );
}
