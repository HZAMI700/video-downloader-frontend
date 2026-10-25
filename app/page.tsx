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
  Crown,
  User,
  Sliders,
  FolderOpen,
} from 'lucide-react';
import { AppSidebar, ToolId } from '../components/AppSidebar';
import {
  CategoryId,
  CATEGORIES,
  getCategoryById,
  getCategoryForTool,
  getToolById,
} from '../lib/categories';
import { CategoryOverview } from '../components/Category/CategoryOverview';
import { AudioTranscriber } from '../components/Transcriber/AudioTranscriber';
import { PodcastGenerator } from '../components/Transcriber/PodcastGenerator';
import { WorkspaceHistory } from '../components/Transcriber/WorkspaceHistory';
import { MediaToMp3Converter } from '../components/Tools/MediaToMp3Converter';
import { AudioTranslator } from '../components/Tools/AudioTranslator';
import { AiVoiceStudio } from '../components/Tools/AiVoiceStudio';
import { AudioDspStudio } from '../components/Tools/AudioDspStudio';
import { QuillBotAiStudio } from '../components/Tools/QuillBotAiStudio';
import { PlayzyHomeScreen } from '../components/HomeScreen/PlayzyHomeScreen';

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
  const [toolInitialText, setToolInitialText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

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

  // Switch category and reset active tool
  const handleSelectCategory = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    setActiveTool(null);
    setSearchQuery('');
  };

  // Switch to a specific tool and ensure its category is active
  const handleSelectTool = (toolId: ToolId, initialText?: string) => {
    const cat = getCategoryForTool(toolId);
    if (cat) {
      setActiveCategory(cat.id);
    } else if (toolId === 'video-downloader') {
      setActiveCategory('video-downloader');
    } else if (toolId === 'workspace') {
      setActiveCategory('workspace');
    }
    setToolInitialText(initialText || '');
    setActiveTool(toolId);
  };

  const currentCategoryDef = getCategoryById(activeCategory) || CATEGORIES[0];
  const currentToolDef = activeTool ? getToolById(activeTool) : undefined;

  return (
    <div className="min-h-screen w-full bg-[#EFF5F1] flex flex-col font-sans text-[#1F2937]">
      {/* Top Global Navigation Bar Matching Screenshot & Replica */}
      <header className="w-full bg-[#EFF5F1] sticky top-0 z-40 px-3 sm:px-6 h-14 flex items-center justify-between shrink-0">
        {/* Left: Mobile Toggle + Playzy Logo + Nav links */}
        <div className="flex items-center gap-4 sm:gap-7">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open Mobile Menu"
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Playzy Brand Logo Matching Screenshot */}
          <button
            type="button"
            onClick={() => {
              setActiveTool(null);
              setActiveCategory('ai-section');
              setSearchQuery('');
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1B241E] flex items-center justify-center relative shadow-xs group-hover:bg-[#2E7D32] transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="8.5" cy="11.5" r="1.2" fill="currentColor" />
                <circle cx="13.5" cy="11.5" r="1.2" fill="currentColor" />
                <path d="M9 14.5C9.8 15.2 12.2 15.2 13 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M16 3C18.5 3 20.5 5 20.5 7.5C18 7.5 16 5.5 16 3Z" fill="#4CAF50" />
                <path d="M11 6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[21px] font-extrabold tracking-tight text-[#111827]">
              playzy
            </span>
          </button>

          {/* Desktop Nav Links Matching Screenshot */}
          <nav className="hidden xl:flex items-center gap-7 text-[13.5px] font-semibold text-[#1F2937]">
            <button
              type="button"
              onClick={() => {
                setActiveTool(null);
                setSearchQuery('');
              }}
              className="hover:text-[#2E7D32] transition py-1 font-semibold cursor-pointer"
            >
              Tools
            </button>
            <span className="hover:text-[#2E7D32] transition cursor-pointer py-1">Professional</span>
            <span className="hover:text-[#2E7D32] transition cursor-pointer py-1">Academic</span>
            <span className="hover:text-[#2E7D32] transition cursor-pointer py-1">Creators</span>
            <span className="hover:text-[#2E7D32] transition cursor-pointer py-1">Personal</span>
            <span className="hover:text-[#2E7D32] transition cursor-pointer py-1">Extensions &amp; apps</span>
          </nav>
        </div>

        {/* Right: Search + Upgrade to Premium + Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="pl-9 pr-7 py-1.5 rounded-full bg-white border border-gray-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] w-40 lg:w-52 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Downloader Switcher */}
          {activeCategory !== 'video-downloader' && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('video-downloader');
                setActiveTool('video-downloader');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-gray-300 text-xs font-semibold text-slate-700 transition active:scale-95 cursor-pointer shadow-2xs"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-purple-600" />
              <span>Downloader</span>
            </button>
          )}

          {/* Upgrade to Premium Button Matching Screenshot */}
          <button
            type="button"
            className="bg-[#2E7D32] hover:bg-[#256628] active:scale-[0.99] text-white text-[13.5px] font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4 text-white fill-current" />
            <span>Upgrade to Premium</span>
          </button>

          {/* User Profile Avatar Matching Screenshot */}
          <button
            type="button"
            aria-label="User Account"
            className="w-8 h-8 rounded-full border border-gray-400/70 hover:border-gray-600 hover:bg-white/60 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* Main Body Layout: Slim Left Rail + Main Rounded Canvas */}
      <div className="flex-1 flex w-full min-h-0">
        {/* Left Slim Vertical Rail Matching Screenshot */}
        <AppSidebar
          activeCategory={activeCategory}
          activeTool={activeTool}
          onSelectCategory={handleSelectCategory}
          onSelectTool={handleSelectTool}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isMoreModalOpen={isMoreModalOpen}
          setIsMoreModalOpen={setIsMoreModalOpen}
        />

        {/* Main Content Area: Rounded Top-Left White Surface Matching Replica */}
        <main className="flex-1 bg-white rounded-tl-[26px] border-t border-l border-[#DCE5DF] shadow-xs p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
          <div>
            {/* Breadcrumb Row when inside a tool */}
            {activeTool !== null && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTool(null);
                      setSearchQuery('');
                    }}
                    className="text-slate-500 hover:text-slate-900 font-bold transition flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-500">
                    {activeCategory === 'video-downloader'
                      ? 'Playzy Video Downloader'
                      : activeCategory === 'workspace'
                      ? 'Saved Workspace'
                      : currentCategoryDef.name}
                  </span>
                  {currentToolDef && (
                    <>
                      <span className="text-slate-300">/</span>
                      <span className="font-extrabold text-[#499557]">
                        {currentToolDef.name}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  <span>Close Tool</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* DYNAMIC CONTENT SWITCHER */}
            {/* 1. PLAYZY VIDEO DOWNLOADER FULL SUITE */}
            {activeCategory === 'video-downloader' ? (
              <div className="space-y-10 md:space-y-12 animate-apple-in max-w-5xl mx-auto pt-2">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    <DownloadCloud className="w-4 h-4 text-purple-600" />
                    <span>Playzy Downloader • 4K Video &amp; 320kbps MP3</span>
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
              /* 3. HOMESCREEN MATCHING SCREENSHOT */
              searchQuery ? (
                <CategoryOverview
                  category={currentCategoryDef}
                  onSelectTool={handleSelectTool}
                  searchFilter={searchQuery}
                />
              ) : (
                <PlayzyHomeScreen
                  onSelectTool={(toolId, initialText) => {
                    handleSelectTool(toolId, initialText);
                  }}
                  onOpenAllToolsModal={() => setIsMoreModalOpen(true)}
                />
              )
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
                    initialText={toolInitialText}
                    onSelectTool={handleSelectTool}
                    onBackToCategory={() => setActiveTool(null)}
                  />
                ) : activeTool === 'transcriber' ||
                  activeTool === 'mp3-to-text' ||
                  activeTool === 'mp4-to-text' ||
                  activeTool === 'recorder-transcriber' ||
                  activeTool === 'voice-to-text' ||
                  activeTool === 'speech-transcriber' ? (
                  /* AUDIO TRANSCRIBER (MP3 to Text / MP4 to Text) */
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
                  /* DEDICATED MEDIA TO MP3 / WAV EXTRACTORS (Link only for YouTube & TikTok) */
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
                  <CategoryOverview
                    category={currentCategoryDef}
                    onSelectTool={handleSelectTool}
                    searchFilter={searchQuery}
                  />
                )}
              </div>
            )}
          </div>

          {/* Minimal Clean Footer */}
          <footer className="pt-10 pb-2 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Playzy AI Suite. 100% Free &amp; Secure. All tools active.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
