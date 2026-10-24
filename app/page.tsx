'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sparkles, DownloadCloud, FileAudio } from 'lucide-react';
import { AppSidebar, ToolId } from '../components/AppSidebar';
import { AudioTranscriber } from '../components/Transcriber/AudioTranscriber';
import { PodcastGenerator } from '../components/Transcriber/PodcastGenerator';
import { TextToSpeechTool } from '../components/Transcriber/TextToSpeechTool';
import { WorkspaceHistory } from '../components/Transcriber/WorkspaceHistory';
import { MediaToMp3Converter } from '../components/Tools/MediaToMp3Converter';
import { AudioTranslator } from '../components/Tools/AudioTranslator';
import { AiVoiceStudio } from '../components/Tools/AiVoiceStudio';
import { AudioDspStudio } from '../components/Tools/AudioDspStudio';

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
  // Sidebar state
  const [activeTool, setActiveTool] = useState<ToolId>('transcriber');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Existing Video Downloader state
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

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* Target Platform Left Sidebar */}
      <AppSidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-sm font-bold text-slate-700 hidden sm:inline-block">
              {activeTool === 'video-downloader'
                ? 'Playzy Video Downloader'
                : activeTool === 'podcast-generator'
                ? 'AI Podcast Generator'
                : activeTool === 'youtube-to-mp3'
                ? 'YouTube to MP3 Converter'
                : activeTool === 'tiktok-to-mp3'
                ? 'TikTok to MP3 Converter'
                : activeTool === 'audio-translator' || activeTool === 'english-to-tamil'
                ? 'Free AI Audio Translator'
                : activeTool === 'ai-voice-generator' || activeTool === 'ai-voice-clone'
                ? 'AI Voice Studio'
                : activeTool === 'volume-booster' || activeTool === 'ai-vocal-remover' || activeTool === 'ai-voice-cleaner' || activeTool === 'ai-voice-changer' || activeTool === 'background-noise-remover' || activeTool === 'background-music-remover'
                ? 'Audio DSP Studio'
                : activeTool === 'workspace'
                ? 'Local Workspace'
                : 'Audio Transcriber AI'}
            </span>
          </div>

          {/* Quick switcher to/from Video Downloader */}
          <div className="flex items-center gap-2">
            {activeTool === 'video-downloader' ? (
              <button
                type="button"
                onClick={() => setActiveTool('transcriber')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-all"
              >
                <FileAudio className="w-4 h-4" />
                <span>Switch to AI Transcriber</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTool('video-downloader')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
              >
                <DownloadCloud className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Playzy Video Downloader</span>
                <span className="sm:hidden">Downloader</span>
              </button>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>No Login Required</span>
            </span>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
          {activeTool === 'video-downloader' ? (
            /* Full Existing Video Downloader Experience (Preserved completely) */
            <div className="space-y-10 md:space-y-12">
              <HeroInput
                onAnalyze={handleAnalyze}
                isLoading={isAnalyzing}
                error={analyzeError}
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
              <div className="pt-6">
                <FaqSection />
              </div>
            </div>
          ) : activeTool === 'youtube-to-mp3' ||
            activeTool === 'tiktok-to-mp3' ||
            activeTool === 'video-to-mp3' ||
            activeTool === 'mp4-to-mp3' ||
            activeTool === 'youtube-to-wav' ||
            activeTool === 'extract-audio' ? (
            /* Dedicated Media to MP3 & Audio Extractors */
            <MediaToMp3Converter toolId={activeTool} />
          ) : activeTool === 'audio-translator' || activeTool === 'english-to-tamil' ? (
            /* Dedicated AI Audio Translator */
            <AudioTranslator toolId={activeTool} />
          ) : activeTool === 'ai-voice-generator' || activeTool === 'ai-voice-clone' || activeTool === 'text-to-speech' ? (
            /* Dedicated AI Voice Studio */
            <AiVoiceStudio toolId={activeTool} />
          ) : activeTool === 'volume-booster' ||
            activeTool === 'ai-vocal-remover' ||
            activeTool === 'ai-voice-cleaner' ||
            activeTool === 'ai-voice-changer' ||
            activeTool === 'background-noise-remover' ||
            activeTool === 'background-music-remover' ? (
            /* Dedicated Audio DSP Studio */
            <AudioDspStudio toolId={activeTool} />
          ) : activeTool === 'podcast-generator' ? (
            /* AI Podcast Studio */
            <PodcastGenerator />
          ) : activeTool === 'workspace' ? (
            /* Local Workspace History */
            <WorkspaceHistory />
          ) : (
            /* Audio & Video Transcriber + Tools Matching Screenshot */
            <AudioTranscriber toolId={activeTool} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
