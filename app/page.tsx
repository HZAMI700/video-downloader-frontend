'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { UrlForm } from '../components/UrlForm';
import { VideoInfoCard } from '../components/VideoInfoCard';
import { DownloadJobProgress } from '../components/DownloadJobProgress';
import { SupportedPlatforms } from '../components/SupportedPlatforms';
import { FaqSection } from '../components/FaqSection';
import { Footer } from '../components/Footer';
import {
  fetchCapabilities,
  fetchMetadata,
  createDownloadJob,
  fetchJobStatus,
  getBackendBaseUrl,
} from '../lib/api';
import { CapabilitiesResponse, MediaMetadata, DownloadJob } from '../lib/types';

export default function Home() {
  const [capabilities, setCapabilities] = useState<CapabilitiesResponse | null>(null);
  const [loadingCapabilities, setLoadingCapabilities] = useState<boolean>(true);
  const [capabilitiesError, setCapabilitiesError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);

  const [isStartingDownload, setIsStartingDownload] = useState<boolean>(false);
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load capabilities once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCaps() {
      try {
        setLoadingCapabilities(true);
        const caps = await fetchCapabilities();
        if (isMounted) {
          setCapabilities(caps);
          setCapabilitiesError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setCapabilitiesError(err.message || 'Could not connect to backend');
        }
      } finally {
        if (isMounted) {
          setLoadingCapabilities(false);
        }
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
    setMetadata(null);
    setActiveJob(null);

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    try {
      const data = await fetchMetadata(url);
      setMetadata(data);
    } catch (err: any) {
      setAnalyzeError(err.message || 'Failed to retrieve media metadata.');
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
        // Continue polling or let user retry
      }
    }, 1000);
  };

  const handleSelectDownload = async (formatId: string) => {
    if (!metadata) return;

    setIsStartingDownload(true);
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
      setIsStartingDownload(false);
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

  const handleRetry = () => {
    if (metadata && activeJob) {
      handleSelectDownload(activeJob.format_id);
    } else {
      handleReset();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        capabilities={capabilities}
        loadingCapabilities={loadingCapabilities}
        capabilitiesError={capabilitiesError}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-12">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <span>Universal Cloud Media Extraction</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Download Any Video in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Full HD Quality
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Convert and extract videos and audio from YouTube, TikTok, Instagram, Twitter/X, and hundreds more.
            Direct streaming powered by FastAPI and yt-dlp.
          </p>
        </div>

        {/* INPUT OR ACTIVE STAGES */}
        <div className="w-full space-y-8">
          {!metadata && !activeJob && (
            <UrlForm
              onAnalyze={handleAnalyze}
              isLoading={isAnalyzing}
              error={analyzeError}
            />
          )}

          {metadata && !activeJob && (
            <VideoInfoCard
              metadata={metadata}
              onSelectDownload={handleSelectDownload}
              onReset={handleReset}
              isStartingDownload={isStartingDownload}
            />
          )}

          {activeJob && (
            <DownloadJobProgress
              job={activeJob}
              onReset={handleReset}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* SUPPORTED PLATFORMS */}
        <SupportedPlatforms />

        {/* FAQ SECTION */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
