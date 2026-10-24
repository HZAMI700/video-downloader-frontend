'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Link2,
  FileAudio,
  Sparkles,
  Copy,
  Check,
  Download,
  Clock,
  Globe2,
  FileText,
  AlertCircle,
  RefreshCw,
  Loader2,
  ListFilter,
  Layers,
  ChevronDown,
  ShieldCheck,
  Infinity,
  Tag,
  Zap,
  Mic,
  Music,
  ChevronLeft,
} from 'lucide-react';
import {
  uploadAndTranscribeFile,
  transcribeMediaUrl,
  fetchTranscriptionStatus,
  getTranscriptionExportUrl,
} from '../../lib/api';
import { TranscriptionJob, TranscriptionSegment } from '../../lib/types';
import { ToolId } from '../AppSidebar';
import { LiveAudioRecorder } from './LiveAudioRecorder';

interface AudioTranscriberProps {
  toolId?: ToolId;
  onBackToCategory?: () => void;
}

const LANGUAGES = [
  { code: 'auto', label: 'Auto' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ta', label: 'Tamil' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ru', label: 'Russian' },
  { code: 'tr', label: 'Turkish' },
];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function AudioTranscriber({
  toolId = 'transcriber',
  onBackToCategory,
}: AudioTranscriberProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<'audio' | 'record'>(
    toolId === 'recorder-transcriber' ? 'record' : 'audio'
  );
  const [showLinkInput, setShowLinkInput] = useState<boolean>(
    toolId === 'youtube-to-mp3' || toolId === 'tiktok-to-mp3' || toolId === 'youtube-to-wav'
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    toolId === 'english-to-tamil' ? 'ta' : 'auto'
  );
  const [speakerDiarization, setSpeakerDiarization] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [job, setJob] = useState<TranscriptionJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeViewTab, setActiveViewTab] = useState<'segments' | 'text'>('segments');
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Sync toolId when changing
  useEffect(() => {
    if (toolId === 'recorder-transcriber') {
      setActiveMediaTab('record');
    } else {
      setActiveMediaTab('audio');
    }

    if (toolId === 'youtube-to-mp3' || toolId === 'tiktok-to-mp3' || toolId === 'youtube-to-wav') {
      setShowLinkInput(true);
    }

    if (toolId === 'english-to-tamil') {
      setSelectedLanguage('ta');
    }
  }, [toolId]);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const saveToWorkspaceHistory = (completedJob: TranscriptionJob) => {
    try {
      const stored = localStorage.getItem('playzy_workspace_history');
      const items = stored ? JSON.parse(stored) : [];
      const newItem = {
        id: completedJob.job_id,
        title: completedJob.filename || 'Untitled Audio',
        text: completedJob.text,
        segments: completedJob.segments || [],
        duration: completedJob.duration || 0,
        language: completedJob.language || 'auto',
        createdAt: Date.now(),
      };
      // Keep latest 25 items
      const updated = [newItem, ...items.filter((it: any) => it.id !== completedJob.job_id)].slice(0, 25);
      localStorage.setItem('playzy_workspace_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const startPolling = (jobId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const updated = await fetchTranscriptionStatus(jobId);
        setJob(updated);

        if (updated.status === 'completed' || updated.status === 'failed') {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          if (updated.status === 'completed') {
            saveToWorkspaceHistory(updated);
          }
          if (updated.status === 'failed' && updated.error) {
            setErrorMessage(updated.error);
          }
        }
      } catch (err: any) {
        // Continue polling until resolved
      }
    }, 1500);
  };

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const maxBytes = 100 * 1024 * 1024; // 100MB
    if (file.size > maxBytes) {
      setErrorMessage('The selected file exceeds 100 MB. Please choose a file under 100 MB.');
      return;
    }
    setSelectedFile(file);
    // Auto submit on file select
    submitFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const submitFile = async (fileToSubmit: File) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await uploadAndTranscribeFile(
        fileToSubmit,
        selectedLanguage,
        speakerDiarization
      );
      const initialJob: TranscriptionJob = {
        job_id: response.job_id,
        source_type: 'file',
        filename: response.filename || fileToSubmit.name,
        status: 'queued',
        progress: 10,
        stage: 'uploading',
        text: '',
        segments: [],
        duration: 0,
        language: selectedLanguage,
        created_at: Date.now() / 1000,
      };
      setJob(initialJob);
      startPolling(response.job_id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload and queue file.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitUrl = async () => {
    if (!mediaUrl.trim()) {
      setErrorMessage('Please enter a valid video or audio URL.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await transcribeMediaUrl(
        mediaUrl.trim(),
        selectedLanguage,
        speakerDiarization
      );
      const initialJob: TranscriptionJob = {
        job_id: response.job_id,
        source_type: 'url',
        filename: mediaUrl.trim(),
        status: 'queued',
        progress: 10,
        stage: 'queued',
        text: '',
        segments: [],
        duration: 0,
        language: selectedLanguage,
        created_at: Date.now() / 1000,
      };
      setJob(initialJob);
      startPolling(response.job_id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to queue media URL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = async () => {
    if (!job?.text) return;
    try {
      await navigator.clipboard.writeText(job.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleReset = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setJob(null);
    setSelectedFile(null);
    setMediaUrl('');
    setErrorMessage(null);
  };

  // Get dynamic titles based on sidebar tool
  const getToolMeta = () => {
    switch (toolId) {
      case 'youtube-to-mp3':
        return {
          title: 'YouTube to MP3 Converter - Audio Transcriber AI',
          subtitle: 'Convert YouTube videos and shorts into high-quality MP3 audio files instantly. No sign-up required.',
          placeholder: 'Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)',
        };
      case 'tiktok-to-mp3':
        return {
          title: 'TikTok to MP3 Converter - Audio Transcriber AI',
          subtitle: 'Extract original TikTok sounds and background music without watermarks.',
          placeholder: 'Paste TikTok video link (e.g. https://www.tiktok.com/@user/video/...)',
        };
      case 'video-to-mp3':
      case 'mp4-to-mp3':
        return {
          title: 'Video to MP3 Converter - Free & Instant',
          subtitle: 'Extract pristine MP3 audio from any MP4, MOV, MKV, or AVI video file.',
          placeholder: 'Paste video stream URL or drop your video file below',
        };
      case 'youtube-to-wav':
        return {
          title: 'YouTube to WAV Converter - Lossless Audio',
          subtitle: 'Extract uncompressed high-fidelity WAV audio from YouTube videos with zero quality loss.',
          placeholder: 'Paste YouTube video URL for WAV extraction',
        };
      case 'extract-audio':
        return {
          title: 'Extract Audio from Video - Free Online Tool',
          subtitle: 'Strip video track and convert to pure MP3 or WAV audio stream in seconds.',
          placeholder: 'Paste video link or drop video file to extract audio',
        };
      case 'english-to-tamil':
        return {
          title: 'English to Tamil Audio Translator - Audio Transcriber AI',
          subtitle: 'Convert spoken English audio into Tamil transcripts and translated subtitles with 99% accuracy.',
          placeholder: 'Paste audio link or upload file to translate into Tamil',
        };
      case 'audio-translator':
        return {
          title: 'Free AI Audio Translator - 120+ Languages',
          subtitle: 'Translate speech from any language into English, Spanish, French, German, Arabic, and more.',
          placeholder: 'Paste audio/video link or drop media file to translate',
        };
      case 'voice-to-text':
      case 'speech-transcriber':
        return {
          title: 'Voice to Text Converter - Speech Transcriber AI',
          subtitle: 'Turn voice memos, podcasts, interviews, and meetings into readable timestamped text.',
          placeholder: 'Paste direct audio URL or drop voice note',
        };
      default:
        return {
          title: 'Transcribe Audio to Text Free Online - Audio Transcriber AI',
          subtitle: 'Simply Upload Audio file and get up to 99% with free Audio Transcriber AI. No sign-up, Unlimited and works with 120+ languages.',
          placeholder: 'Paste direct audio link or YouTube / TikTok / Facebook URL...',
        };
    }
  };

  const meta = getToolMeta();
  const wordCount = job?.text ? job.text.trim().split(/\s+/).filter(Boolean).length : 0;

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
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {meta.title}
          </span>
        </div>
      )}
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.mp4,.mov,.mkv,.webm,.avi"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Main Header Matching Screenshot */}
      <div className="text-center space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {meta.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {meta.subtitle}
        </p>

        {/* Feature Highlights Row Matching Screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>100% Privacy & Security</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Infinity className="w-4 h-4 text-purple-600" />
            <span>Unlimited Audio Time</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-purple-600" />
            <span>100% Free to Use</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-600" />
            <span>Instantly Get Results</span>
          </span>
        </div>
      </div>

      {/* Media Type Switcher Pill: [ Audio ] | [ Record ] */}
      <div className="flex justify-center pt-2">
        <div className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveMediaTab('audio');
              setErrorMessage(null);
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeMediaTab === 'audio'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMediaTab('record');
              setErrorMessage(null);
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeMediaTab === 'record'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
        </div>
      </div>

      {/* Main Container Card Matching Screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-purple-500/5 p-6 sm:p-10 relative overflow-hidden transition-all">
        {activeMediaTab === 'record' ? (
          /* Live Microphone Recording View */
          <LiveAudioRecorder
            onRecordingComplete={(file) => {
              setActiveMediaTab('audio');
              handleFileSelect(file);
            }}
          />
        ) : !job || job.status === 'failed' ? (
          /* Normal Audio Ingest Mode */
          <div className="space-y-6">
            {/* Central Cloud Icon & Drag-and-Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center text-center space-y-4 py-8 px-4 rounded-2xl border-2 border-dashed transition-all ${
                isDragOver
                  ? 'border-purple-500 bg-purple-50/60 scale-[1.01]'
                  : 'border-transparent hover:border-purple-200 hover:bg-slate-50/50'
              }`}
            >
              {/* Floating Purple Circle with Cloud Icon matching screenshot */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer transform hover:scale-105 transition-transform"
              >
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Upload an audio file or paste a direct audio link.
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Supported formats: MP3, WAV, M4A, AAC, FLAC, MP4, MOV, AVI, MKV, WEBM, up to 100 MB
                </p>
              </div>

              {/* Action Buttons: [ Upload Audio ] & [ Link ˅ ] matching screenshot */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-purple-300 text-purple-700 hover:bg-purple-50 font-bold text-sm transition-all"
                >
                  <span>Link</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLinkInput ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Link Input Bar (when [Link ˅] is active) */}
              {showLinkInput && (
                <div className="w-full max-w-xl mt-4 pt-2 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <div className="pl-3 text-slate-400">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        setErrorMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitUrl();
                      }}
                      placeholder={meta.placeholder}
                      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none px-2 py-2"
                    />
                    <button
                      type="button"
                      onClick={submitUrl}
                      disabled={isSubmitting || !mediaUrl.trim()}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? 'Loading...' : 'Transcribe'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Settings Bar matching screenshot */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
              {/* Output Language */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Output Language:</span>
                <div className="relative inline-flex items-center">
                  <Globe2 className="w-3.5 h-3.5 text-purple-600 absolute left-2.5 pointer-events-none" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="pl-8 pr-6 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white hover:border-purple-300 focus:outline-none focus:border-purple-600 transition-colors appearance-none cursor-pointer"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
                </div>
              </div>

              {/* Speaker Diarization Switch */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-500">Speaker Diarization:</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={speakerDiarization}
                  onClick={() => setSpeakerDiarization(!speakerDiarization)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    speakerDiarization ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      speakerDiarization ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Transcription Request Failed</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        ) : job.status === 'queued' || job.status === 'processing' ? (
          /* Processing State */
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin flex items-center justify-center" />
              <FileAudio className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold text-slate-900">
                {job.stage === 'downloading_media'
                  ? 'Downloading media source...'
                  : job.stage === 'extracting_audio'
                  ? 'Extracting audio track...'
                  : 'AI Speech Recognition in progress...'}
              </h3>
              <p className="text-xs text-slate-500">
                {job.stage === 'transcribing'
                  ? 'Converting spoken audio into high-accuracy timestamped text.'
                  : 'Processing audio format for maximum transcription speed.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(15, job.progress)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span className="truncate max-w-[250px]">{job.filename}</span>
                <span>{job.progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Completed Result View */
          <div className="space-y-6">
            {/* Result Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Transcription Complete
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate max-w-md">
                  {job.filename}
                </h3>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {job.duration > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{formatTime(job.duration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-semibold uppercase">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{job.language || 'auto'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{wordCount} words</span>
                </div>
              </div>
            </div>

            {/* Action Bar: Toggle Views & Download Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('segments')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeViewTab === 'segments'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Timestamps ({job.segments.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeViewTab === 'text'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Plain Text</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'txt')}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </a>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'srt')}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SRT Subtitles</span>
                </a>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'vtt')}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>VTT</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors ml-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Transcript Viewer Body */}
            {activeViewTab === 'segments' ? (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {job.segments.length > 0 ? (
                  job.segments.map((seg: TranscriptionSegment) => (
                    <div
                      key={seg.id}
                      className="group p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 transition-colors flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-4"
                    >
                      <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 whitespace-nowrap">
                        {formatTime(seg.start)} - {formatTime(seg.end)}
                      </span>
                      {seg.speaker && (
                        <span className="text-[11px] font-bold text-indigo-600">
                          {seg.speaker}:
                        </span>
                      )}
                      <p className="text-sm text-slate-800 leading-relaxed select-text flex-1">
                        {seg.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-700 p-4 bg-slate-50 rounded-2xl leading-relaxed select-text">
                    {job.text || 'No speech detected in this media file.'}
                  </p>
                )}
              </div>
            ) : (
              <textarea
                readOnly
                value={job.text}
                rows={12}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-sans text-sm text-slate-800 leading-relaxed focus:outline-none select-text resize-none custom-scrollbar"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
