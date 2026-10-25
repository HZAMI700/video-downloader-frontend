'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Sparkles,
  DownloadCloud,
  FileAudio,
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
} from 'lucide-react';
import { AppSidebar, ToolId } from '../components/AppSidebar';
import { CategoryId, CATEGORIES, getCategoryById, getCategoryForTool, getToolById } from '../lib/categories';
import { CategoryOverview } from '../components/Category/CategoryOverview';
import { AudioTranscriber } from '../components/Transcriber/AudioTranscriber';
import { PodcastGenerator } from '../components/Transcriber/PodcastGenerator';
import { WorkspaceHistory } from '../components/Transcriber/WorkspaceHistory';
import { MediaToMp3Converter } from '../components/Tools/MediaToMp3Converter';
import { AudioTranslator } from '../components/Tools/AudioTranslator';
import { AiVoiceStudio } from '../components/Tools/AiVoiceStudio';
import { AudioDspStudio } from '../components/Tools/AudioDspStudio';
import { QuillBotAiStudio } from '../components/Tools/QuillBotAiStudio';

// Existing Video Downloader Components
import { HeroInput } from '../components/HeroInput';
import { ReadyContainer } from '../components/ReadyContainer';
import { HowItWorks } from '../components/HowItWorks';
import { PlatformShowcase } from '../components/PlatformShowcase';
import { FeatureCards } from '../components/FeatureCards';
import { FaqSection } from '../components/FaqSection';
import { Footer } from '../components/Footer';

import {
  fetchCapabilities,
  fetchMetadata,
  createDownloadJob,
  fetchJobStatus,
} from '../lib/api';
import { CapabilitiesResponse, MediaMetadata, DownloadJob } from '../lib/types';

export default function Home() {
  // Category & Tool Navigation State
  const [activeCategory, setActiveCategory] = useState<CategoryId>('ai-section');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Video Downloader state
  const [capabilities, setCapabilities] = useState<CapabilitiesResponse | null>(null);
  const [loadingCapabilities, setLoadingCapabilities] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [isStartingJob, setIsStartingJob] = useState<boolean>(false);
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load backend capabilities once
  useEffect(() => {
    let isMounted = true;
    async function loadCaps() {
      try {
        setLoadingCapabilities(true);
        const caps = await fetchCapabilities();
        if (isMounted) setCapabilities(caps);
      } catch (err) {
        // Fallback
      } finally {
        if (isMounted) setLoadingCapabilities(false);
      }
    }
    loadCaps();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    setActiveJob(null);

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    try {
      const data = await fetchMetadata(url);
      setMetadata(data);
    } catch (err: any) {
      setAnalyzeError(err.message || 'Failed to retrieve video details. Please ensure the link is public.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startJobPolling = (jobId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const job = await fetchJobStatus(jobId);
        setActiveJob(job);

        if (job.status === 'completed' || job.status === 'failed') {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } catch (err) {
        // Continue polling
      }
    }, 1000);
  };

  const handleDownloadFormat = async (formatId: string) => {
    if (!metadata) {
      setAnalyzeError('Please paste a video URL above first.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsStartingJob(true);
    setAnalyzeError(null);

    try {
      const response = await createDownloadJob(metadata.original_url, formatId);
      const initialJob: DownloadJob = {
        job_id: response.job_id,
        url: metadata.original_url,
        format_id: formatId,
        status: 'queued',
        progress_percent: 0,
        downloaded_bytes: 0,
        created_at: Date.now() / 1000,
      };

      setActiveJob(initialJob);
      startJobPolling(response.job_id);
    } catch (err: any) {
      setAnalyzeError(err.message || 'Failed to start download job.');
    } finally {
      setIsStartingJob(false);
    }
  };

  const handleReset = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setMetadata(null);
    setActiveJob(null);
    setAnalyzeError(null);
  };

  // Switch category and reset active tool so user sees category overview
  const handleSelectCategory = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    setActiveTool(null);
    setSearchQuery('');
  };

  // Switch to a specific tool and ensure its category is active
  const handleSelectTool = (toolId: ToolId) => {
    const cat = getCategoryForTool(toolId);
    if (cat) {
      setActiveCategory(cat.id);
    } else if (toolId === 'video-downloader') {
      setActiveCategory('video-downloader');
    } else if (toolId === 'workspace') {
      setActiveCategory('workspace');
    }
    setActiveTool(toolId);
  };

  const currentCategoryDef = getCategoryById(activeCategory) || CATEGORIES[0];
  const currentToolDef = activeTool ? getToolById(activeTool) : undefined;

  return (
    <div className="min-h-screen w-full p-1 sm:p-2 bg-[#f4f5f8] flex flex-col font-sans">
      {/* Outer Apple macOS Window Frame - Full Screen Edge & Light Stroke */}
      <div
        id="appShell"
        className="apple-shell w-full min-h-[calc(100vh-1rem)] bg-[#181920] rounded-[22px] p-1.5 sm:p-2 flex flex-col lg:flex-row gap-2.5 transition-colors duration-300 border border-zinc-700/30 relative flex-1"
      >
        {/* Left Dark Apple Sidebar */}
        <AppSidebar
          activeCategory={activeCategory}
          activeTool={activeTool}
          onSelectCategory={handleSelectCategory}
          onSelectTool={handleSelectTool}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Inner Apple Canvas (White rounded sheet with light clean stroke) */}
        <main className="flex-1 bg-[#F9FAFC] rounded-[18px] p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between overflow-x-hidden min-h-[calc(100vh-2.5rem)] border border-zinc-200/60 shadow-xs relative">
          <div>
            {/* Top Navigation & Breadcrumb Header */}
            <header className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-200/70">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  aria-label="Open Mobile Menu"
                  className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Dynamic Breadcrumbs */}
                <div className="flex items-center gap-2 text-[14px]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTool(null);
                      setSearchQuery('');
                    }}
                    className={`font-bold transition hover:text-zinc-950 ${
                      activeTool === null
                        ? 'text-zinc-900 text-[16px]'
                        : 'text-zinc-500 hover:underline'
                    }`}
                  >
                    {activeCategory === 'video-downloader'
                      ? 'Playzy Video Downloader'
                      : activeCategory === 'workspace'
                      ? 'Saved Workspace'
                      : currentCategoryDef.name}
                  </button>

                  {activeTool !== null && currentToolDef && (
                    <>
                      <span className="text-zinc-300 font-normal">/</span>
                      <span className="font-bold text-zinc-900 text-[15.5px] truncate max-w-[200px] sm:max-w-none">
                        {currentToolDef.name}
                      </span>
                    </>
                  )}

                  <span className="hidden md:inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-zinc-200/70 text-zinc-600">
                    macOS Design Edition
                  </span>
                </div>
              </div>

              {/* Right Action Pills & Search Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 25+ AI tools..."
                    className="pl-9 pr-8 py-1.5 rounded-full bg-white border border-zinc-200/90 text-[12.5px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-44 sm:w-56 shadow-2xs transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Playzy Quick Switcher Button */}
                {activeCategory !== 'video-downloader' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('video-downloader');
                      setActiveTool('video-downloader');
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200/90 shadow-2xs text-[12px] font-semibold text-zinc-800 transition active:scale-95"
                  >
                    <DownloadCloud className="w-3.5 h-3.5 text-purple-600" />
                    <span className="hidden sm:inline">Playzy Video Downloader</span>
                    <span className="sm:hidden">Downloader</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('ai-section');
                      setActiveTool(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[12px] font-bold transition active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Back to AI Suite</span>
                  </button>
                )}

                {/* No Login Required Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11.5px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">No Login Required</span>
                  <span className="sm:hidden">100% Free</span>
                </div>
              </div>
            </header>

            {/* Dynamic Body Content */}
            <div className="pt-4">
              {/* 1. PLAYZY VIDEO DOWNLOADER FULL SUITE */}
              {activeCategory === 'video-downloader' ? (
                <div className="space-y-10 md:space-y-12 animate-apple-in max-w-5xl mx-auto pt-2">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      <DownloadCloud className="w-4 h-4 text-purple-600" />
                      <span>Playzy Downloader • 4K Video & 320kbps MP3</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                      Free Video &amp; Audio Downloader
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Download videos and audio from YouTube, TikTok, Vimeo, and 1000+ sites with zero registration.
                    </p>
                  </div>

                  <HeroInput
                    onAnalyze={handleAnalyze}
                    isLoading={isAnalyzing}
                    error={analyzeError}
                    onFileDrop={() => {
                      handleSelectTool('mp4-to-mp3');
                    }}
                  />

                  <ReadyContainer
                    metadata={metadata}
                    activeJob={activeJob}
                    isStartingJob={isStartingJob}
                    onDownloadFormat={handleDownloadFormat}
                    onReset={handleReset}
                  />

                  <HowItWorks />
                  <PlatformShowcase />
                  <FeatureCards />
                  <div className="pt-4">
                    <FaqSection />
                  </div>
                </div>
              ) : activeCategory === 'workspace' ? (
                /* 2. LOCAL WORKSPACE HISTORY */
                <div className="animate-apple-in max-w-5xl mx-auto pt-2">
                  <WorkspaceHistory />
                </div>
              ) : activeTool === null ? (
                /* 3. CATEGORY OVERVIEW BENTO GRID (When category is selected) */
                <CategoryOverview
                  category={currentCategoryDef}
                  onSelectTool={handleSelectTool}
                  searchFilter={searchQuery}
                />
              ) : (
                /* 4. DEDICATED TOOL WORKSPACE (When a specific tool is open) */
                <div className="animate-apple-in pt-1">
                  {/* AI SECTION TOOLS */}
                  {activeCategory === 'ai-section' ||
                  activeTool === 'ai-chat' ||
                  activeTool === 'paraphrasing-tool' ||
                  activeTool === 'grammar-checker' ||
                  activeTool === 'ai-detector' ||
                  activeTool === 'summarizer' ||
                  activeTool === 'ai-humanizer' ||
                  activeTool === 'translator' ||
                  activeTool === 'plagiarism-checker' ? (
                    <QuillBotAiStudio
                      toolId={activeTool}
                      onSelectTool={handleSelectTool}
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  ) : activeTool === 'transcriber' ||
                    activeTool === 'recorder-transcriber' ||
                    activeTool === 'voice-to-text' ||
                    activeTool === 'speech-transcriber' ? (
                    /* AUDIO TRANSCRIBER & LIVE RECORDER */
                    <AudioTranscriber
                      toolId={activeTool}
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  ) : activeTool === 'audio-translator' || activeTool === 'english-to-tamil' ? (
                    /* DEDICATED AI AUDIO TRANSLATOR */
                    <AudioTranslator
                      toolId={activeTool}
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  ) : activeTool === 'podcast-generator' ? (
                    /* DEDICATED AI PODCAST STUDIO */
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-zinc-200/70">
                        <button
                          type="button"
                          onClick={() => setActiveTool(null)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 transition active:scale-95 shadow-2xs"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Back to Audio Tools</span>
                        </button>
                        <span className="text-zinc-300">/</span>
                        <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                          Free AI Podcast Generator
                        </span>
                      </div>
                      <PodcastGenerator />
                    </div>
                  ) : activeTool === 'youtube-to-mp3' ||
                    activeTool === 'tiktok-to-mp3' ||
                    activeTool === 'video-to-mp3' ||
                    activeTool === 'mp4-to-mp3' ||
                    activeTool === 'youtube-to-wav' ||
                    activeTool === 'extract-audio' ? (
                    /* DEDICATED MEDIA TO MP3 / WAV EXTRACTORS */
                    <MediaToMp3Converter
                      toolId={activeTool}
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  ) : activeTool === 'ai-voice-generator' ||
                    activeTool === 'ai-voice-clone' ||
                    activeTool === 'text-to-speech' ? (
                    /* DEDICATED ELEVENLABS AI VOICE STUDIO */
                    <AiVoiceStudio
                      toolId={activeTool}
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  ) : activeTool === 'volume-booster' ||
                    activeTool === 'ai-vocal-remover' ||
                    activeTool === 'ai-voice-cleaner' ||
                    activeTool === 'ai-voice-changer' ||
                    activeTool === 'background-noise-remover' ||
                    activeTool === 'background-music-remover' ? (
                    /* DEDICATED AUDIO DSP STUDIO */
                    <AudioDspStudio
                      toolId={activeTool}
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  ) : (
                    /* FALLBACK TO TRANSCRIBER */
                    <AudioTranscriber
                      toolId="transcriber"
                      onBackToCategory={() => setActiveTool(null)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Canvas Footer */}
          <div className="pt-8 mt-8 border-t border-zinc-200/60">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
