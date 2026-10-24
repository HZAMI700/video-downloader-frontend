'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Youtube,
  Music2,
  FileVideo,
  Film,
  Scissors,
  Download,
  Play,
  Pause,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import { fetchMetadata, createDownloadJob, fetchJobStatus, buildFileDownloadUrl } from '../../lib/api';
import { MediaMetadata, DownloadJob, FormatOption } from '../../lib/types';

interface MediaToMp3Props {
  toolId: ToolId;
}

export function MediaToMp3Converter({ toolId }: MediaToMp3Props) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('audio_mp3');
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Set default quality/format based on tool
  useEffect(() => {
    setUrl('');
    setMetadata(null);
    setActiveJob(null);
    setError(null);
    if (toolId === 'youtube-to-wav') {
      setSelectedFormat('audio_wav');
    } else {
      setSelectedFormat('audio_mp3');
    }
  }, [toolId]);

  const getToolConfig = () => {
    switch (toolId) {
      case 'youtube-to-mp3':
        return {
          title: 'Free YouTube to MP3 Converter Online',
          subtitle: 'Convert YouTube videos and shorts into 320kbps MP3 audio instantly. Fast, free, and no sign-up required.',
          placeholder: 'Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)',
          badgeText: 'YouTube MP3 320kbps',
          themeColor: 'from-red-600 to-rose-600',
          accentText: 'text-red-600',
          badgeBorder: 'border-red-200 bg-red-50 text-red-700',
          icon: <Youtube className="w-5 h-5 text-red-600" />,
        };
      case 'tiktok-to-mp3':
        return {
          title: 'Free TikTok to MP3 Converter — Download Audio Instantly',
          subtitle: 'No watermark, no account needed. Turn TikTok videos and sounds into high-quality MP3 in seconds.',
          placeholder: 'Paste TikTok video link (e.g. https://www.tiktok.com/@user/video/...)',
          badgeText: 'TikTok Clean Audio',
          themeColor: 'from-cyan-500 via-pink-500 to-purple-600',
          accentText: 'text-pink-600',
          badgeBorder: 'border-pink-200 bg-pink-50 text-pink-700',
          icon: <Music2 className="w-5 h-5 text-pink-600" />,
        };
      case 'youtube-to-wav':
        return {
          title: 'YouTube to WAV Converter — Lossless Studio Audio',
          subtitle: 'Extract uncompressed, bit-perfect WAV audio from any YouTube video with zero frequency loss.',
          placeholder: 'Paste YouTube link for WAV conversion...',
          badgeText: 'Lossless WAV 24-bit',
          themeColor: 'from-amber-500 to-orange-600',
          accentText: 'text-amber-600',
          badgeBorder: 'border-amber-200 bg-amber-50 text-amber-700',
          icon: <Volume2 className="w-5 h-5 text-amber-600" />,
        };
      case 'video-to-mp3':
      case 'mp4-to-mp3':
        return {
          title: 'MP4 to MP3 Converter — Free & Instant Extraction',
          subtitle: 'Extract pristine MP3 audio from any MP4, MOV, MKV, or online video stream with studio clarity.',
          placeholder: 'Paste video link or drop your video file below',
          badgeText: 'MP4 to 320kbps MP3',
          themeColor: 'from-purple-600 to-indigo-600',
          accentText: 'text-purple-600',
          badgeBorder: 'border-purple-200 bg-purple-50 text-purple-700',
          icon: <FileVideo className="w-5 h-5 text-purple-600" />,
        };
      case 'extract-audio':
      default:
        return {
          title: 'Extract Audio from Video — Free Online Tool',
          subtitle: 'Strip the video track and save pure MP3 or WAV audio stream with maximum fidelity.',
          placeholder: 'Paste video link or drop video to extract audio...',
          badgeText: 'Audio Extraction',
          themeColor: 'from-indigo-600 to-blue-600',
          accentText: 'text-indigo-600',
          badgeBorder: 'border-indigo-200 bg-indigo-50 text-indigo-700',
          icon: <Scissors className="w-5 h-5 text-indigo-600" />,
        };
    }
  };

  const config = getToolConfig();

  const handleFetch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid video link.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMetadata(null);
    setActiveJob(null);

    try {
      const data = await fetchMetadata(url.trim());
      setMetadata(data);
      // Auto select preferred audio format
      const hasMp3 = data.formats.some((f) => f.format_id === 'audio_mp3');
      const hasWav = data.formats.some((f) => f.format_id === 'audio_wav');
      if (toolId === 'youtube-to-wav' && hasWav) {
        setSelectedFormat('audio_wav');
      } else if (hasMp3) {
        setSelectedFormat('audio_mp3');
      } else if (data.formats.length > 0) {
        setSelectedFormat(data.formats[0].format_id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze video. Please verify the link is public.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversion = async () => {
    if (!metadata) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await createDownloadJob(metadata.original_url, selectedFormat);
      const initialJob: DownloadJob = {
        job_id: res.job_id,
        url: metadata.original_url,
        format_id: selectedFormat,
        status: 'queued',
        progress_percent: 15,
        downloaded_bytes: 0,
        created_at: Date.now() / 1000,
      };
      setActiveJob(initialJob);

      // Start status polling
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          const updated = await fetchJobStatus(res.job_id);
          setActiveJob(updated);
          if (updated.status === 'completed' || updated.status === 'failed') {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (updated.status === 'failed') {
              setError(updated.error_message || 'Audio conversion failed.');
            }
          }
        } catch (pollErr: any) {
          // Keep polling
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to start conversion.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Tool Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-xs transition-colors">
          <span className={`w-2 h-2 rounded-full bg-current ${config.accentText} animate-pulse`} />
          <span className={config.accentText}>{config.badgeText}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {config.subtitle}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Free & No Sign-up</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-600" />
            <span>Fast 320kbps Bitrate</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>No Watermark</span>
          </span>
        </div>
      </div>

      {/* Main Conversion Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10 space-y-6">
        {/* Link Input Bar */}
        <form onSubmit={handleFetch} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-2xl bg-slate-50 border border-slate-200/90 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-inner">
            <div className="flex items-center gap-2 flex-1 px-3 py-1.5">
              {config.icon}
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder={config.placeholder}
                disabled={isLoading}
                className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r ${config.themeColor} hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Extract MP3</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Video Metadata Preview & Format Selection */}
        {metadata && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {metadata.thumbnail && (
                <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 shadow-xs border border-slate-200">
                  <img
                    src={metadata.thumbnail}
                    alt={metadata.title}
                    className="w-full h-full object-cover"
                  />
                  {metadata.duration && (
                    <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded-md">
                      {formatDuration(metadata.duration)}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 tracking-wider">
                  {metadata.platform}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                  {metadata.title}
                </h3>
                {metadata.uploader && (
                  <p className="text-xs text-slate-500 font-medium">By {metadata.uploader}</p>
                )}
              </div>
            </div>

            {/* Quality & Format Buttons */}
            <div className="space-y-3 pt-2 border-t border-slate-200/70">
              <span className="text-xs font-bold text-slate-700 block">Select Audio / Video Format:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {/* 320kbps MP3 */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('audio_mp3')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedFormat === 'audio_mp3'
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                      : 'border-slate-200 hover:border-purple-200 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">MP3 Audio (320kbps)</span>
                    <span className="text-[11px] text-slate-500">Highest Studio Bitrate</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-md">
                    Recommended
                  </span>
                </button>

                {/* Lossless WAV */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('audio_wav')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedFormat === 'audio_wav'
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                      : 'border-slate-200 hover:border-purple-200 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">WAV Audio</span>
                    <span className="text-[11px] text-slate-500">Uncompressed Lossless</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md">
                    Studio
                  </span>
                </button>

                {/* Video MP4 Option */}
                {metadata.formats.find((f) => f.type === 'video') && (
                  <button
                    type="button"
                    onClick={() => {
                      const v = metadata.formats.find((f) => f.type === 'video');
                      if (v) setSelectedFormat(v.format_id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedFormat !== 'audio_mp3' && selectedFormat !== 'audio_wav'
                        ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                        : 'border-slate-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">HD MP4 Video</span>
                      <span className="text-[11px] text-slate-500">Full Video & Audio</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md">
                      Video
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Conversion Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartConversion}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Conversion...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Convert & Download Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Download Job Progress / Download Ready */}
        {activeJob && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Conversion Status
                </span>
                <h4 className="text-base font-extrabold">
                  {activeJob.status === 'completed'
                    ? 'Conversion Complete! Your file is ready.'
                    : activeJob.status === 'failed'
                    ? 'Conversion Failed'
                    : 'Extracting and encoding high-fidelity audio...'}
                </h4>
              </div>

              {activeJob.status === 'completed' && (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {activeJob.status !== 'completed' && activeJob.status !== 'failed' && (
              <div className="space-y-2">
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(15, activeJob.progress_percent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Converting format...</span>
                  <span>{activeJob.progress_percent}%</span>
                </div>
              </div>
            )}

            {/* Completed Download Button & Audio Player */}
            {activeJob.status === 'completed' && (
              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={buildFileDownloadUrl(activeJob.job_id)}
                    download
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Extracted Audio (MP3)</span>
                  </a>

                  <audio
                    ref={audioRef}
                    src={buildFileDownloadUrl(activeJob.job_id)}
                    controls
                    className="w-full sm:w-auto h-11 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
