'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Play, Search, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { AppSidebar, ALL_NAV_TOOLS, ToolId } from './AppSidebar';
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
import { TorrentStudio } from './Tools/TorrentStudio';
import { IconButton } from './ui/Button';
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

export function PlayzyApp({ initialTool = null, initialCategory }: PlayzyAppProps) {
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

  // Ctrl/Cmd+K opens the tool search from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsMoreModalOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
    if (pushState && typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const currentCategoryDef = getCategoryById(activeCategory) || CATEGORIES[0];
  const currentToolDef = activeTool ? getToolById(activeTool) : undefined;

  const isHome = activeTool === null && activeCategory !== 'video-downloader' && activeCategory !== 'workspace';
  const isDark = theme === 'dark';
  const navTool = activeTool ? ALL_NAV_TOOLS.find((t) => t.id === activeTool) : undefined;
  const pageName =
    navTool?.name ??
    currentToolDef?.name ??
    (activeCategory === 'video-downloader'
      ? 'Video Downloader'
      : activeCategory === 'workspace'
      ? 'Saved work'
      : currentCategoryDef.name);

  return (
    <div className="min-h-screen w-full bg-bg flex flex-col font-sans text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-2 focus:rounded-ctl focus:bg-surface focus:border focus:border-line focus:text-sm"
      >
        Skip to content
      </a>

      <header className="w-full bg-bg/95 backdrop-blur-sm border-b border-line sticky top-0 z-40 px-3 sm:px-5 h-14 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1 min-w-0">
          <IconButton
            label="Open menu"
            className="lg:hidden -ml-1"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </IconButton>

          <button
            type="button"
            onClick={() => handleCloseTool()}
            aria-label="Playzy home"
            className="flex items-center gap-2 h-10 px-1.5 rounded-ctl shrink-0"
          >
            <span className="w-7 h-7 rounded-ctl bg-fg flex items-center justify-center" aria-hidden="true">
              <Play className="w-3.5 h-3.5 fill-bg text-bg translate-x-px" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-fg">playzy</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMoreModalOpen(true)}
            className="hidden sm:flex items-center gap-2 h-9 w-56 lg:w-72 px-3 rounded-ctl bg-surface border border-line text-sm text-muted hover:border-line-strong transition-colors"
          >
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left truncate">Search tools</span>
            <kbd className="font-mono text-xs text-muted border border-line rounded-sm px-1.5 py-0.5">Ctrl K</kbd>
          </button>
          <IconButton label="Search tools" className="sm:hidden" onClick={() => setIsMoreModalOpen(true)}>
            <Search className="w-5 h-5" />
          </IconButton>
          <IconButton
            label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 dark:hidden" />
          </IconButton>
        </div>
      </header>

      <div className="flex-1 flex w-full min-h-0">
        <AppSidebar
          activeCategory={activeCategory}
          activeTool={activeTool}
          onSelectCategory={handleSelectCategory}
          onSelectTool={handleSelectTool}
          onGoHome={() => handleCloseTool()}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isMoreModalOpen={isMoreModalOpen}
          setIsMoreModalOpen={setIsMoreModalOpen}
        />

        <main
          id="main"
          className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)] flex flex-col px-4 sm:px-6 lg:px-8 py-5 lg:py-6"
        >
          <div className="w-full min-w-0 flex-1">
            {!isHome && (
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleCloseTool()}
                  className="text-muted hover:text-fg transition-colors rounded-sm shrink-0"
                >
                  Home
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                <span className="text-fg font-medium truncate" aria-current="page">
                  {pageName}
                </span>
              </nav>
            )}


            {/* 1. PLAYZY VIDEO DOWNLOADER FULL SUITE */}
            {activeCategory === 'video-downloader' ? (
              <div className="space-y-10 md:space-y-12 animate-enter max-w-5xl mx-auto pt-4">
                <div className="max-w-2xl mx-auto text-center">
                  <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
                    Video and audio downloader
                  </h1>
                  <p className="mt-3 text-base text-muted">
                    Paste a link from YouTube, TikTok, Vimeo or 1,000+ other sites. No account needed.
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
              <div className="animate-enter max-w-5xl mx-auto pt-2">
                <WorkspaceHistory />
              </div>
            ) : activeTool === null ? (
              /* 3. HOMESCREEN */
              <PlayzyHomeScreen
                onSelectTool={(toolId, initialText) => {
                  handleSelectTool(toolId, initialText);
                }}
                onOpenAllToolsModal={() => setIsMoreModalOpen(true)}
              />
            ) : (
              /* 4. DEDICATED TOOL WORKSPACE */
              <div className="animate-enter pt-1">
                {/* TORRENT TO MP4 VIDEO DOWNLOADER */}
                {activeTool === 'torrent-downloader' ? (
                  <TorrentStudio />
                ) : activeTool === 'robin' ? (
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
                  <PodcastGenerator />
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
                    searchFilter=""
                  />
                )}
              </div>
            )}
          </div>

          <footer className="pt-10 pb-1 text-xs text-muted">
            <p>© {new Date().getFullYear()} Playzy. Free to use, no account needed.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
