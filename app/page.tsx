'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroInput } from '../components/HeroInput';
import { ReadyContainer } from '../components/ReadyContainer';
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
  const [capabilities, setCapabilities] = useState<CapabilitiesResponse | null>(null);
  const [loadingCapabilities, setLoadingCapabilities] = useState<boolean>(true);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);

  const [isStartingJob, setIsStartingJob] = useState<boolean>(false);
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
        }
      } catch (err) {
        // Fallback gracefully
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
        // Continue polling until resolved
      }
    }, 1000);
  };

  const handleDownloadFormat = async (formatId: string) => {
    // If no media is currently loaded, prompt with sample or message
    if (!metadata) {
      setAnalyzeError('Please paste a YouTube, TikTok, Facebook, or Instagram video URL above first.');
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
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar
        capabilities={capabilities}
        loadingCapabilities={loadingCapabilities}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 w-full space-y-10 md:space-y-12">
        {/* HERO AND SEARCH INPUT */}
        <HeroInput
          onAnalyze={handleAnalyze}
          isLoading={isAnalyzing}
          error={analyzeError}
        />

        {/* READY CONTAINER / DOWNLOAD OPTIONS */}
        <ReadyContainer
          metadata={metadata}
          activeJob={activeJob}
          isStartingJob={isStartingJob}
          onDownloadFormat={handleDownloadFormat}
          onReset={handleReset}
        />

        {/* 3 FEATURE CARDS (Ultra Fast, No Watermarks, Safe & Secure) */}
        <FeatureCards />

        {/* FAQ SECTION */}
        <div className="pt-6">
          <FaqSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
