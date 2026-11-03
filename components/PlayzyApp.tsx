'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Play,
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
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { AppSidebar, ToolId } from './AppSidebar';
import {
  CategoryId,
  CATEGORIES,
  getCategoryById,
  getCategoryForTool,
  getToolById,
} from '../lib/categories';
import { CategoryOverview } from './Category/CategoryOverview';
import { AudioTranscriber } from './Transcriber/AudioTranscriber';
import { PodcastGenerator } from './Transcriber/PodcastGenerator';
import { WorkspaceHistory } from './Transcriber/WorkspaceHistory';
import { MediaToMp3Converter } from './Tools/MediaToMp3Converter';
import { AudioTranslator } from './Tools/AudioTranslator';
import { AiVoiceStudio } from './Tools/AiVoiceStudio';
import { AudioDspStudio } from './Tools/AudioDspStudio';
import { QuillBotAiStudio } from './Tools/QuillBotAiStudio';
import { RobinStudio } from './Tools/RobinStudio';
import { BlackbirdEmailStudio } from './Tools/BlackbirdEmailStudio';
import { PlayzyHomeScreen } from './HomeScreen/PlayzyHomeScreen';

// Existing Video Downloader Components
import { HeroInput } from './HeroInput';
import { ReadyContainer } from './ReadyContainer';
import { HowItWorks } from './HowItWorks';
import { PlatformShowcase } from './PlatformShowcase';
import { FeatureCards } from './FeatureCards';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';

import {
  fetchCapabilities,
  fetchMetadata,
  createDownloadJob,
  fetchJobStatus,
} from '../lib/api';
import { CapabilitiesResponse, MediaMetadata, DownloadJob } from '../lib/types';

interface PlayzyAppProps {
  initialTool?: ToolId | null;
  initialCategory?: CategoryId;
}

export function PlayzyApp({ initialTool = 'robin', initialCategory }: PlayzyAppProps) {
  const { theme, toggleTheme } = useTheme();

  // Resolve starting category based on initial tool
  const resolvedCategory: CategoryId =
    initialCategory ||
    (initialTool
      ? getCategoryForTool(initialTool)?.id ||
        (initialTool === 'video-downloader'
          ? 'video-downloader'
          : initialTool === 'workspace'
          ? 'workspace'
          : 'ai-section')
      : 'ai-section');

  // Category & Tool Navigation State
  const [activeCategory, setActiveCategory] = useState<CategoryId>(resolvedCategory);
  const [activeTool, setActiveTool] = useState<ToolId | null>(initialTool ?? null);
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

  // Listen for browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      if (path.startsWith('/tools/')) {
        const slug = path.replace('/tools/', '').split('/')[0] as ToolId;
        if (slug) {
          handleSelectTool(slug, undefined, false);
          return;
        }
      } else if (path === '/' || path === '') {
        setActiveTool(null);
        setActiveCategory('ai-section');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

  // Switch to a specific tool, update URL, and ensure category is active
  const handleSelectTool = (toolId: ToolId, initialText?: string, pushState = true) => {
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

    if (pushState && typeof window !== 'undefined') {
      const targetUrl = `/tools/${toolId}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ toolId }, '', targetUrl);
      }
    }
  };

  const handleCloseTool = (pushState = true) => {
    setActiveTool(null);
    setSearchQuery('');
    if (pushState && typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const currentCategoryDef = getCategoryById(activeCategory) || CATEGORIES[0];
  const currentToolDef = activeTool ? getToolById(activeTool) : undefined;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#0F131A] flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Global Navigation Bar - Matching Target Screenshot */}
      <header className="w-full bg-white/95 dark:bg-[#0F131A]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#212932] sticky top-0 z-40 px-2.5 sm:px-6 h-14 flex items-center justify-between shrink-0 transition-colors duration-200">
        {/* Left: Mobile Toggle + Playzy Logo + Workspace & Model Selectors */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open Mobile Menu"
            className="lg:hidden p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181D24] transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleCloseTool()}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center p-1.5 shadow-sm">
              <Play className="w-4 h-4 fill-[#00c9a7] text-[#00c9a7] translate-x-0.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                playzy
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d2f9ef] text-[#00a887]">
                AI
              </span>
            </div>
          </button>

          {/* Workspace Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1f5f9] text-xs text-slate-800 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00c9a7]" />
            <span>Personal Workspace</span>
          </div>

          {/* Model Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1fbf8] border border-[#d2f9ef] text-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#00c9a7]" />
            <span className="text-slate-500 font-medium">Model:</span>
            <span className="font-bold text-slate-900">Playzy DeepSeek-R1</span>
            <span className="px-1.5 py-0.5 rounded bg-[#d2f9ef] text-[#00897B] text-[10px] font-bold">671B</span>
          </div>
        </div>

        {/* Right: Search + Quick Downloader + Theme Toggle + Upgrade to Pro + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents & tools..."
              className="pl-9 pr-7 py-1.5 rounded-full bg-[#f1f5f9] border border-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00c9a7] w-48 lg:w-56 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Downloader Switcher */}
          <button
            type="button"
            onClick={() => handleSelectTool('video-downloader')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-sky-500" />
            <span>Downloader</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-slate-200 flex items-center justify-center text-purple-600 transition cursor-pointer"
            aria-label="Toggle Theme"
          >
            <Moon className="w-4 h-4 text-purple-600" />
          </button>

          {/* Upgrade to Pro Button */}
          <button
            type="button"
            className="bg-[#00c9a7] hover:bg-[#00b596] active:scale-[0.98] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,201,167,0.35)] transition-all cursor-pointer shrink-0"
          >
            <Crown className="w-3.5 h-3.5 text-slate-950 fill-current shrink-0" />
            <span className="hidden sm:inline">Upgrade to Pro</span>
            <span className="sm:hidden">Pro</span>
          </button>

          {/* User Profile Avatar with Online Ring */}
          <button
            type="button"
            aria-label="User Account"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#181D24] border border-slate-200 dark:border-[#263241] hover:border-[#00c9a7]/50 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer relative shrink-0"
          >
            <User className="w-4 h-4 stroke-[2.2]" />
            <span className="w-2 h-2 rounded-full bg-[#00c9a7] border-2 border-white dark:border-[#0F131A] absolute -bottom-0.5 -right-0.5" />
          </button>
        </div>
      </header>

      {/* Main Body Layout: Sidebar + Main Canvas */}
      <div className="flex-1 flex w-full min-h-0 bg-[#F8FAFC] dark:bg-[#0F131A] transition-colors duration-200">
        {/* Left Sidebar */}
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

        {/* Main Content Area */}
        <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F131A] p-2.5 sm:p-5 lg:p-7 overflow-y-auto min-h-[calc(100vh-3.5rem)] flex flex-col justify-between transition-colors duration-200 w-full min-w-0">
          <div className="w-full min-w-0">
            {/* Breadcrumb Row when inside a tool */}
            {activeTool !== null && (
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-[#212932] gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap min-w-0">
                  <button
                    type="button"
                    onClick={() => handleCloseTool()}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Workspace Home</span>
                    <span className="xs:hidden">Home</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">
                    {activeCategory === 'video-downloader'
                      ? 'Playzy Video Downloader'
                      : activeCategory === 'workspace'
                      ? 'Saved Workspace'
                      : currentCategoryDef.name}
                  </span>
                  {currentToolDef && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">/</span>
                      <span className="font-extrabold text-[#009688] dark:text-[#00c9a7] truncate max-w-[140px] sm:max-w-none">
                        {currentToolDef.name}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCloseTool()}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg bg-white dark:bg-[#181D24] border border-slate-200 dark:border-[#263241] shadow-2xs shrink-0 cursor-pointer"
                >
                  <span className="hidden xs:inline">Close Tool</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* DYNAMIC CONTENT SWITCHER */}
            {/* 1. PLAYZY VIDEO DOWNLOADER FULL SUITE */}
            {activeCategory === 'video-downloader' ? (
              <div className="space-y-10 md:space-y-12 animate-apple-in max-w-5xl mx-auto pt-2">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    <DownloadCloud className="w-4 h-4 text-sky-400" />
                    <span>Playzy Downloader • 4K Video &amp; 320kbps MP3</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Free Video &amp; Audio Downloader
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
              /* 3. HOMESCREEN */
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
              /* 4. DEDICATED TOOL WORKSPACE */
              <div className="animate-apple-in pt-1">
                {/* ROBIN DARKNET OSINT THREAT INTELLIGENCE STUDIO */}
                {activeTool === 'robin' ? (
                  <RobinStudio
                    initialQuery={toolInitialText}
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeTool === 'email-checker' ? (
                  <BlackbirdEmailStudio
                    initialEmail={toolInitialText}
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeCategory === 'ai-section' ||
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
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeTool === 'transcriber' ||
                  activeTool === 'mp3-to-text' ||
                  activeTool === 'mp4-to-text' ||
                  activeTool === 'recorder-transcriber' ||
                  activeTool === 'voice-to-text' ||
                  activeTool === 'speech-transcriber' ? (
                  /* AUDIO TRANSCRIBER */
                  <AudioTranscriber
                    toolId={activeTool}
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeTool === 'audio-translator' || activeTool === 'english-to-tamil' ? (
                  /* AI AUDIO TRANSLATOR */
                  <AudioTranslator
                    toolId={activeTool}
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeTool === 'podcast-generator' ? (
                  /* AI PODCAST STUDIO */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-[#212932]">
                      <button
                        type="button"
                        onClick={() => handleCloseTool()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#181D24] dark:hover:bg-[#202732] border border-slate-200 dark:border-[#263241] text-xs font-bold text-slate-700 dark:text-slate-200 transition active:scale-95 shadow-xs"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back to Audio Tools</span>
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">/</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        Free AI Podcast Generator
                      </span>
                    </div>
                    <PodcastGenerator />
                  </div>
                ) : activeTool === 'youtube-to-mp3' ||
                  activeTool === 'youtube-to-mp4' ||
                  activeTool === 'tiktok-to-mp3' ||
                  activeTool === 'video-to-mp3' ||
                  activeTool === 'mp4-to-mp3' ||
                  activeTool === 'youtube-to-wav' ||
                  activeTool === 'extract-audio' ? (
                  /* MEDIA TO MP3 / WAV EXTRACTORS */
                  <MediaToMp3Converter
                    toolId={activeTool}
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeTool === 'ai-voice-generator' ||
                  activeTool === 'ai-voice-clone' ||
                  activeTool === 'text-to-speech' ? (
                  /* ELEVENLABS AI VOICE STUDIO */
                  <AiVoiceStudio
                    toolId={activeTool}
                    onBackToCategory={() => handleCloseTool()}
                  />
                ) : activeTool === 'volume-booster' ||
                  activeTool === 'ai-vocal-remover' ||
                  activeTool === 'ai-voice-cleaner' ||
                  activeTool === 'ai-voice-changer' ||
                  activeTool === 'background-noise-remover' ||
                  activeTool === 'background-music-remover' ? (
                  /* AUDIO DSP STUDIO */
                  <AudioDspStudio
                    toolId={activeTool}
                    onBackToCategory={() => handleCloseTool()}
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

          {/* Clean Footer */}
          <footer className="pt-10 pb-2 border-t border-slate-200 dark:border-[#212932] text-center text-xs text-slate-400 dark:text-slate-500">
            <p>© {new Date().getFullYear()} Playzy AI Suite. 100% Free &amp; Secure. All workspace tools active.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
