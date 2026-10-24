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
  const [inputMode, setInputMode] = useState<'url' | 'file'>(
    toolId === 'video-to-mp3' || toolId === 'mp4-to-mp3' || toolId === 'extract-audio' ? 'file' : 'url'
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
  const [fileTargetFormat, setFileTargetFormat] = useState<'mp3' | 'wav' | 'm4a'>('mp3');
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
    } else {
      setSelectedFormat('audio_mp3');
      setFileTargetFormat('mp3');
    }

    if (toolId === 'video-to-mp3' || toolId === 'mp4-to-mp3' || toolId === 'extract-audio') {
      setInputMode('file');
    } else {
      setInputMode('url');
    }
  }, [toolId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-apple-in">
      {/* Top Apple Navigation Bar */}
      {onBackToCategory && (
        <div className="flex items-center gap-2 pb-1 border-b border-zinc-200/70">
          <button
            type="button"
            onClick={onBackToCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 transition active:scale-95 shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Audio Tools</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {config.title}
          </span>
        </div>
      )}
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
        className={`bg-white rounded-3xl border shadow-xl p-6 sm:p-10 space-y-6 transition-all ${
          isDragOver
            ? 'border-purple-500 ring-4 ring-purple-100 bg-purple-50/20 shadow-purple-500/10'
            : 'border-slate-200/90 shadow-slate-200/40'
        }`}
      >
        {/* Mode Switcher: Link vs File Drop */}
        <div className="flex justify-center pb-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setInputMode('url');
                setError(null);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === 'url'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
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
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === 'file'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Drop Video / Audio File</span>
            </button>
          </div>
        </div>

        {/* INPUT MODE: URL */}
        {inputMode === 'url' ? (
          <div className="space-y-3">
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

            {/* Quick File Drop Hint */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="text-center py-2 cursor-pointer text-xs text-slate-400 hover:text-purple-600 font-medium transition-colors"
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
                    ? 'border-purple-500 bg-purple-50/50'
                    : 'border-slate-300 hover:border-purple-400 bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${config.themeColor} text-white flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3`}
                >
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">
                  {isDragOver ? 'Release to drop media file!' : 'Drop your Video or Audio file here'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Drag and drop any MP4, MOV, MKV, AVI, WEBM, WAV, M4A or MP3 file, or click to browse
                </p>
                <div className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50">
                  Browse Local Files (Up to 100 MB)
                </div>
              </div>
            ) : (
              /* Selected Dropped File Card */
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <FileAudio className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 break-all">{droppedFile.name}</h4>
                      <p className="text-xs text-slate-500">
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
                    className="p-2 text-slate-400 hover:text-slate-600 transition"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Target Format Options */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block">Choose Target Audio Format:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('mp3')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'mp3'
                          ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                          : 'border-slate-200 hover:border-purple-200 bg-white'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">MP3 (320kbps)</span>
                        <span className="text-[11px] text-slate-500">Standard studio audio</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-md">
                        Best
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('wav')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'wav'
                          ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                          : 'border-slate-200 hover:border-purple-200 bg-white'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">WAV (Lossless)</span>
                        <span className="text-[11px] text-slate-500">Uncompressed PCM</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md">
                        Lossless
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFileTargetFormat('m4a')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        fileTargetFormat === 'm4a'
                          ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                          : 'border-slate-200 hover:border-purple-200 bg-white'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">M4A (AAC)</span>
                        <span className="text-[11px] text-slate-500">Apple standard audio</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md">
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
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
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Conversion complete! Listen or download your {fileTargetFormat.toUpperCase()} below:</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <a
                        href={convertedBlobUrl}
                        download={convertedFileName}
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
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
