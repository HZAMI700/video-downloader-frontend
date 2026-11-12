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
  UploadCloud,
  FileAudio,
  X,
  Link2,
  ChevronLeft,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import {
  fetchMetadata,
  createDownloadJob,
  fetchJobStatus,
  buildFileDownloadUrl,
  convertMediaFile,
} from '../../lib/api';
import { MediaMetadata, DownloadJob, FormatOption } from '../../lib/types';

interface MediaToMp3Props {
  toolId: ToolId;
  onBackToCategory?: () => void;
}

export function MediaToMp3Converter({ toolId, onBackToCategory }: MediaToMp3Props) {
  const isLinkOnly =
    toolId.toLowerCase().includes('youtube') || toolId.toLowerCase().includes('tiktok');

  const [inputMode, setInputMode] = useState<'url' | 'file'>(
    isLinkOnly
      ? 'url'
      : toolId === 'video-to-mp3' || toolId === 'mp4-to-mp3' || toolId === 'extract-audio'
      ? 'file'
      : 'url'
  );
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('audio_mp3');
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // File Drop & Direct Conversion State
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [fileTargetFormat, setFileTargetFormat] = useState<'mp3' | 'mp4' | 'wav' | 'm4a'>('mp3');
  const [isFileConverting, setIsFileConverting] = useState(false);
  const [convertedBlobUrl, setConvertedBlobUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (convertedBlobUrl) URL.revokeObjectURL(convertedBlobUrl);
    };
  }, [convertedBlobUrl]);

  // Set default quality/format based on tool
  useEffect(() => {
    setUrl('');
    setMetadata(null);
    setActiveJob(null);
    setError(null);
    setDroppedFile(null);
    setConvertedBlobUrl(null);
    if (toolId === 'youtube-to-wav') {
      setSelectedFormat('audio_wav');
      setFileTargetFormat('wav');
    } else if (toolId === 'youtube-to-mp4') {
      setSelectedFormat('video_1080p');
      setFileTargetFormat('mp4');
    } else {
      setSelectedFormat('audio_mp3');
      setFileTargetFormat('mp3');
    }

    if (isLinkOnly) {
      setInputMode('url');
    } else if (toolId === 'video-to-mp3' || toolId === 'mp4-to-mp3' || toolId === 'extract-audio') {
      setInputMode('file');
    } else {
      setInputMode('url');
    }
  }, [toolId, isLinkOnly]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (isLinkOnly) {
      setError('This tool only accepts video links. Please paste a valid link in the field above.');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setDroppedFile(file);
      setInputMode('file');
      setError(null);
      setConvertedBlobUrl(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDroppedFile(file);
      setInputMode('file');
      setError(null);
      setConvertedBlobUrl(null);
    }
  };

  const handleConvertDroppedFile = async () => {
    if (!droppedFile) {
      setError('Please select or drop a video or audio file first.');
      return;
    }

    setIsFileConverting(true);
    setError(null);
    setConvertedBlobUrl(null);

    try {
      const blob = await convertMediaFile(droppedFile, fileTargetFormat, '320k');
      const url = URL.createObjectURL(blob);
      setConvertedBlobUrl(url);
      const baseName = droppedFile.name.replace(/\.[^/.]+$/, '');
      setConvertedFileName(`${baseName}.${fileTargetFormat}`);
    } catch (err: any) {
      setError(err.message || 'File conversion failed. Please try a different media file.');
    } finally {
      setIsFileConverting(false);
    }
  };

  const getToolConfig = () => {
    switch (toolId) {
      case 'youtube-to-mp3':
        return {
          title: 'Free YouTube to MP3 Converter Online',
          subtitle: 'Convert YouTube videos and shorts into 320kbps MP3 audio instantly. Fast, free, and no sign-up required.',
          placeholder: 'Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)',
          badgeText: 'YouTube MP3 320kbps',
          themeColor: 'bg-danger',
          accentText: 'text-danger',
          badgeBorder: 'border-danger/30 bg-danger-soft text-danger',
          icon: <Youtube className="w-5 h-5 text-danger" />,
        };
      case 'youtube-to-mp4':
        return {
          title: 'Free YouTube to MP4 Converter Online',
          subtitle: 'Download and convert YouTube videos to 1080p Full HD MP4 instantly. Fast, free, no limits.',
          placeholder: 'Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)',
          badgeText: 'YouTube MP4 1080p Full HD',
          themeColor: 'bg-info',
          accentText: 'text-info',
          badgeBorder: 'border-info/30 bg-info-soft text-info',
          icon: <FileVideo className="w-5 h-5 text-info" />,
        };
      case 'tiktok-to-mp3':
        return {
          title: 'Free TikTok to MP3 Converter — Download Audio Instantly',
          subtitle: 'No watermark, no account needed. Turn TikTok videos and sounds into high-quality MP3 in seconds.',
          placeholder: 'Paste TikTok video link (e.g. https://www.tiktok.com/@user/video/...)',
          badgeText: 'TikTok Clean Audio',
          themeColor: 'bg-info',
          accentText: 'text-muted',
          badgeBorder: 'border-line bg-sunken text-muted',
          icon: <Music2 className="w-5 h-5 text-muted" />,
        };
      case 'youtube-to-wav':
        return {
          title: 'YouTube to WAV Converter — Lossless Studio Audio',
          subtitle: 'Extract uncompressed, bit-perfect WAV audio from any YouTube video with zero frequency loss.',
          placeholder: 'Paste YouTube link for WAV conversion...',
          badgeText: 'Lossless WAV 24-bit',
          themeColor: 'bg-warning',
          accentText: 'text-warning',
          badgeBorder: 'border-warning/30 bg-warning-soft text-warning',
          icon: <Volume2 className="w-5 h-5 text-warning" />,
        };
      case 'video-to-mp3':
      case 'mp4-to-mp3':
        return {
          title: 'MP4 to MP3 Converter — Free & Instant Extraction',
          subtitle: 'Extract pristine MP3 audio from any MP4, MOV, MKV, or online video stream with studio clarity.',
          placeholder: 'Paste video link or drop your video file below',
          badgeText: 'MP4 to 320kbps MP3',
          themeColor: 'bg-accent',
          accentText: 'text-muted',
          badgeBorder: 'border-line bg-sunken text-muted',
          icon: <FileVideo className="w-5 h-5 text-muted" />,
        };
      case 'extract-audio':
      default:
        return {
          title: 'Extract Audio from Video — Free Online Tool',
          subtitle: 'Strip the video track and save pure MP3 or WAV audio stream with maximum fidelity.',
          placeholder: 'Paste video link or drop video to extract audio...',
          badgeText: 'Audio Extraction',
          themeColor: 'bg-accent',
          accentText: 'text-muted',
          badgeBorder: 'border-line bg-sunken text-muted',
          icon: <Scissors className="w-5 h-5 text-muted" />,
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
      // Auto select preferred format
      const has1080p = data.formats.some((f) => f.format_id === 'video_1080p');
      const has720p = data.formats.some((f) => f.format_id === 'video_720p');
      const hasMp3 = data.formats.some((f) => f.format_id === 'audio_mp3');
      const hasWav = data.formats.some((f) => f.format_id === 'audio_wav');
      if (toolId === 'youtube-to-mp4') {
        if (has1080p) setSelectedFormat('video_1080p');
        else if (has720p) setSelectedFormat('video_720p');
        else if (data.formats.length > 0) setSelectedFormat(data.formats[0].format_id);
      } else if (toolId === 'youtube-to-wav' && hasWav) {
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

  const handleStartConversion = async (overrideFormat?: string) => {
    if (!metadata) return;

    const targetFmt = overrideFormat || selectedFormat;
    setSelectedFormat(targetFmt);
    setIsLoading(true);
    setError(null);

    try {
      const res = await createDownloadJob(metadata.original_url, targetFmt);
      const initialJob: DownloadJob = {
        job_id: res.job_id,
        url: metadata.original_url,
        format_id: targetFmt,
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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-enter">
      {/* Tool Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-accent/30 bg-accent-soft text-accent">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{config.badgeText}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          {config.subtitle}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>100% Free & No Sign-up</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-accent" />
            <span>Fast 320kbps Bitrate</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>No Watermark</span>
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*,.mp4,.mov,.mkv,.avi,.webm,.flv,.wmv,.mp3,.wav,.m4a,.aac,.flac,.ogg"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Main Conversion Card with Drag and Drop Support */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`bg-surface rounded-card border border-line p-6 sm:p-8 space-y-6 transition-all ${
          isDragOver
            ? 'border-accent ring-4 ring-accent/30 bg-accent-soft'
            : 'border-line'
        }`}
      >
        {/* Mode Switcher: Link vs File Drop (Hidden on YouTube / TikTok tools which are Link-Only) */}
        {!isLinkOnly && (
          <div className="flex justify-center pb-2">
            <div className="inline-flex p-1 bg-sunken rounded-2xl border border-line">
              <button
                type="button"
                onClick={() => {
                  setInputMode('url');
                  setError(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  inputMode === 'url'
                    ? 'bg-accent text-on-accent'
                    : 'text-muted hover:text-fg'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Paste Media Link</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode('file');
                  setError(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  inputMode === 'file'
                    ? 'bg-accent text-on-accent'
                    : 'text-muted hover:text-fg'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Drop Video / Audio File</span>
              </button>
            </div>
          </div>
        )}

        {isLinkOnly && (
          <div className="flex justify-center pb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-soft border border-warning/30 text-warning text-xs font-medium">
              <Link2 className="w-3 h-3 text-warning" />
              <span>Link-Only Extraction • Paste URL Below</span>
            </div>
          </div>
        )}

        {/* INPUT MODE: URL */}
        {inputMode === 'url' ? (
          <div className="space-y-3">
            <form onSubmit={handleFetch} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-2xl bg-sunken border border-line focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 transition-all">
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
                    className="w-full bg-transparent border-none text-xs sm:text-sm text-fg placeholder:text-muted py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-accent hover:bg-accent text-on-accent font-medium text-xs sm:text-sm transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{toolId === 'youtube-to-mp4' ? 'Convert to MP4' : 'Extract MP3'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick File Drop Hint */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="text-center py-2 cursor-pointer text-xs text-muted hover:text-muted font-medium transition-colors"
            >
              <span>Or drag & drop your video / audio file here to convert directly</span>
            </div>
          </div>
        ) : (
          /* INPUT MODE: FILE DROP */
          <div className="space-y-5">
            {!droppedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-line bg-sunken'
                    : 'border-line hover:border-line bg-sunken/50'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${config.themeColor} text-fg flex items-center justify-center mb-3`}
                >
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-fg">
                  {isDragOver ? 'Release to drop media file!' : 'Drop your Video or Audio file here'}
                </h3>
                <p className="text-xs text-muted mt-1 max-w-sm">
                  Drag and drop any MP4, MOV, MKV, AVI, WEBM, WAV, M4A or MP3 file, or click to browse
                </p>
                <div className="mt-4 px-4 py-2 rounded-xl bg-surface border border-line text-xs font-medium text-fg hover:bg-sunken">
                  Browse Local Files (Up to 100 MB)
                </div>
              </div>
            ) : (
              /* Selected Dropped File Card */
              <div className="p-5 sm:p-6 rounded-2xl bg-sunken/80 border border-line space-y-5 animate-enter">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sunken text-muted flex items-center justify-center">
                      <FileAudio className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-fg break-all">{droppedFile.name}</h4>
                      <p className="text-xs text-muted">
                        {(droppedFile.size / (1024 * 1024)).toFixed(2)} MB • {droppedFile.type || 'Media File'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDroppedFile(null);
                      setConvertedBlobUrl(null);
                    }}
                    className="p-2 text-muted hover:text-muted transition"
                    title="Remove file" aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Target Format Options */}
                <div className="space-y-2 pt-2 border-t border-line">
                  <span className="text-xs font-medium text-fg block">Choose Target Format (Audio or Video):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('mp3')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'mp3'
                          ? 'border-line bg-sunken ring-2 ring-line'
                          : 'border-line hover:border-line bg-surface'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold text-fg block">MP3 Audio</span>
                        <span className="text-xs text-muted">320kbps Studio</span>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-medium bg-sunken text-muted rounded-md">
                        Audio
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('mp4')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'mp4'
                          ? 'border-line bg-sunken ring-2 ring-line'
                          : 'border-line hover:border-line bg-surface'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold text-fg block">MP4 Video</span>
                        <span className="text-xs text-muted">Universal HD</span>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-medium bg-info-soft text-info rounded-md">
                        Video
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('wav')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'wav'
                          ? 'border-line bg-sunken ring-2 ring-line'
                          : 'border-line hover:border-line bg-surface'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold text-fg block">WAV Audio</span>
                        <span className="text-xs text-muted">Lossless PCM</span>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-medium bg-sunken text-fg rounded-md">
                        Studio
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('m4a')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'm4a'
                          ? 'border-line bg-sunken ring-2 ring-line'
                          : 'border-line hover:border-line bg-surface'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold text-fg block">M4A Audio</span>
                        <span className="text-xs text-muted">Apple AAC</span>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-medium bg-accent-soft text-accent rounded-md">
                        AAC
                      </span>
                    </button>
                  </div>
                </div>

                {/* Conversion Trigger Button */}
                <button
                  type="button"
                  onClick={handleConvertDroppedFile}
                  disabled={isFileConverting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-xs sm:text-sm transition-all disabled:opacity-50"
                >
                  {isFileConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Converting media with FFmpeg...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Convert to {fileTargetFormat.toUpperCase()} & Download</span>
                    </>
                  )}
                </button>

                {/* Direct File Converted Result */}
                {convertedBlobUrl && (
                  <div className="p-4 rounded-xl bg-accent-soft border border-accent/30 space-y-3 animate-enter">
                    <div className="flex items-center gap-2 text-xs font-medium text-accent">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>Conversion complete! Listen or download your {fileTargetFormat.toUpperCase()} below:</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <a
                        href={convertedBlobUrl}
                        download={convertedFileName}
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-medium text-xs transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download {convertedFileName}</span>
                      </a>

                      <audio
                        ref={localAudioRef}
                        src={convertedBlobUrl}
                        controls
                        className="w-full sm:w-auto h-10 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-danger-soft border border-danger/30 text-danger text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Video Metadata Preview & Format Selection */}
        {metadata && (
          <div className="p-5 sm:p-6 rounded-2xl bg-sunken/70 border border-line space-y-6 animate-enter">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {metadata.thumbnail && (
                <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-line flex-shrink-0 border border-line">
                  <img
                    src={metadata.thumbnail}
                    alt={metadata.title}
                    className="w-full h-full object-cover"
                  />
                  {metadata.duration && (
                    <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded-md">
                      {formatDuration(metadata.duration)}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase bg-sunken text-muted tracking-wider">
                  {metadata.platform}
                </span>
                <h3 className="text-base sm:text-lg font-medium text-fg leading-snug line-clamp-2">
                  {metadata.title}
                </h3>
                {metadata.uploader && (
                  <p className="text-xs text-muted font-medium">By {metadata.uploader}</p>
                )}
              </div>
            </div>

            {/* Quick One-Click Download Action Cards for MP3 & MP4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-line">
              {/* Option 1: MP3 Audio */}
              <div className="p-4 rounded-2xl bg-sunken border border-line flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center">
                    <Music2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-fg">Download MP3 Audio</h4>
                    <p className="text-xs text-muted font-medium">320kbps High-Bitrate Studio MP3</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartConversion('audio_mp3')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-xs transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP3 (320kbps)</span>
                </button>
              </div>

              {/* Option 2: MP4 Video */}
              <div className="p-4 rounded-2xl bg-info/10 border border-info/80 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-info text-on-accent flex items-center justify-center">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-fg">Download MP4 Video</h4>
                    <p className="text-xs text-muted font-medium">1080p / 720p Full HD Video & Audio</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const bestVid = metadata.formats.find((f) => f.type === 'video');
                    handleStartConversion(bestVid ? bestVid.format_id : 'video_1080p');
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-info hover:bg-info text-on-accent font-semibold text-xs transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4 Video</span>
                </button>
              </div>
            </div>

            {/* Quality & Format Details */}
            <div className="space-y-3 pt-2 border-t border-line">
              <span className="text-xs font-medium text-fg block">All Available Format Options:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {/* 320kbps MP3 */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('audio_mp3')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedFormat === 'audio_mp3'
                      ? 'border-line bg-sunken ring-2 ring-line'
                      : 'border-line hover:border-line bg-surface'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-fg block">MP3 Audio (320kbps)</span>
                    <span className="text-xs text-muted">Highest Studio Bitrate</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium bg-sunken text-muted rounded-md">
                    Audio
                  </span>
                </button>

                {/* Lossless WAV */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('audio_wav')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedFormat === 'audio_wav'
                      ? 'border-line bg-sunken ring-2 ring-line'
                      : 'border-line hover:border-line bg-surface'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-fg block">WAV Audio</span>
                    <span className="text-xs text-muted">Uncompressed Lossless</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium bg-sunken text-fg rounded-md">
                    PCM
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
                        ? 'border-line bg-sunken ring-2 ring-line'
                        : 'border-line hover:border-line bg-surface'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-fg block">HD MP4 Video</span>
                      <span className="text-xs text-muted">Full Video & Audio</span>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium bg-info-soft text-info rounded-md">
                      Video
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Custom Format Conversion Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleStartConversion(selectedFormat)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-fg hover:opacity-90 text-bg font-semibold text-sm transition-all transform disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Conversion...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Selected Format ({selectedFormat.replace('audio_', '').replace('video_', '').toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Download Job Progress / Download Ready */}
        {activeJob && (
          <div className="p-6 rounded-2xl bg-surface text-fg space-y-5 animate-enter">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">
                  Conversion Status
                </span>
                <h4 className="text-base font-semibold">
                  {activeJob.status === 'completed'
                    ? 'Conversion Complete! Your file is ready.'
                    : activeJob.status === 'failed'
                    ? 'Conversion Failed'
                    : 'Extracting and encoding high-fidelity audio...'}
                </h4>
              </div>

              {activeJob.status === 'completed' && (
                <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center border border-accent/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {activeJob.status !== 'completed' && activeJob.status !== 'failed' && (
              <div className="space-y-2">
                <div className="w-full bg-sunken rounded-full h-2.5 overflow-hidden">
                  <div
                    className=" bg-accent h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(15, activeJob.progress_percent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted font-medium">
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
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm transition-all transform"
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
