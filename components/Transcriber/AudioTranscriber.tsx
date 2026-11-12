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

  const isMp3Tool = toolId === 'transcriber' || toolId === 'mp3-to-text';
  const isMp4Tool = toolId === 'mp4-to-text';
  const acceptFormat = isMp3Tool ? '.mp3,audio/mpeg' : isMp4Tool ? '.mp4,video/mp4' : 'audio/*,video/*,.mp3,.wav,.mp4';

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const fileName = file.name.toLowerCase();

    if (isMp3Tool && !fileName.endsWith('.mp3')) {
      setErrorMessage("Only .mp3 files are supported in MP3 to Text. To transcribe video files, please switch to 'MP4 to Text'.");
      return;
    }

    if (isMp4Tool && !fileName.endsWith('.mp4')) {
      setErrorMessage("Only .mp4 files are supported in MP4 to Text. To transcribe audio files, please switch to 'MP3 to Text'.");
      return;
    }

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
      case 'transcriber':
      case 'mp3-to-text':
        return {
          title: 'MP3 to Text Converter - Playzy Audio AI',
          subtitle: 'Convert speech, podcasts, and audio recordings to text with 99% accuracy. Strictly accepts MP3 files.',
          placeholder: 'Paste direct audio stream link or upload MP3 file below...',
          badge: 'MP3 Audio Only',
        };
      case 'mp4-to-text':
        return {
          title: 'MP4 to Text Converter - Playzy Video AI',
          subtitle: 'Extract and transcribe speech directly from MP4 video files with automatic speaker detection. Strictly accepts MP4 files.',
          placeholder: 'Paste direct MP4 stream link or upload MP4 video below...',
          badge: 'MP4 Video Only',
        };
      case 'youtube-to-mp3':
        return {
          title: 'YouTube to MP3 Converter - Playzy Tools',
          subtitle: 'Convert YouTube videos and shorts into high-quality MP3 audio files instantly. Link input only.',
          placeholder: 'Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)',
          badge: 'Link Only',
        };
      case 'tiktok-to-mp3':
        return {
          title: 'TikTok to MP3 Converter - Playzy Tools',
          subtitle: 'Extract original TikTok sounds and background music without watermarks. Link input only.',
          placeholder: 'Paste TikTok video link (e.g. https://www.tiktok.com/@user/video/...)',
          badge: 'Link Only',
        };
      case 'video-to-mp3':
      case 'mp4-to-mp3':
        return {
          title: 'Video to MP3 Converter - Free & Instant',
          subtitle: 'Extract pristine MP3 audio from any MP4, MOV, MKV, or AVI video file.',
          placeholder: 'Paste video stream URL or drop your video file below',
          badge: 'Video to MP3',
        };
      case 'youtube-to-wav':
        return {
          title: 'YouTube to WAV Converter - Lossless Audio',
          subtitle: 'Extract uncompressed high-fidelity WAV audio from YouTube video links with zero quality loss. Link input only.',
          placeholder: 'Paste YouTube video URL for WAV extraction',
          badge: 'Link Only',
        };
      case 'extract-audio':
        return {
          title: 'Extract Audio from Video - Free Online Tool',
          subtitle: 'Strip video track and convert to pure MP3 or WAV audio stream in seconds.',
          placeholder: 'Paste video link or drop video file to extract audio',
          badge: 'Audio Demuxer',
        };
      case 'english-to-tamil':
        return {
          title: 'English to Tamil Audio Translator - Playzy AI',
          subtitle: 'Convert spoken English audio into Tamil transcripts and translated subtitles with 99% accuracy.',
          placeholder: 'Paste audio link or upload file to translate into Tamil',
          badge: 'Tamil Subtitles',
        };
      case 'audio-translator':
        return {
          title: 'Free AI Audio Translator - 120+ Languages',
          subtitle: 'Translate speech from any language into English, Spanish, French, German, Arabic, and more.',
          placeholder: 'Paste audio/video link or drop media file to translate',
          badge: 'Multi-lingual',
        };
      case 'voice-to-text':
      case 'speech-transcriber':
        return {
          title: 'Voice to Text Converter - Playzy Speech AI',
          subtitle: 'Turn voice memos, podcasts, interviews, and meetings into readable timestamped text.',
          placeholder: 'Paste direct audio URL or drop voice note',
          badge: 'Voice to Text',
        };
      default:
        return {
          title: 'MP3 to Text Converter - Playzy AI',
          subtitle: 'Convert MP3 audio recordings to text with 99% accuracy. Strictly accepts MP3 files.',
          placeholder: 'Paste direct audio link or upload MP3 file...',
          badge: 'MP3 Only',
        };
    }
  };

  const meta = getToolMeta();
  const wordCount = job?.text ? job.text.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-enter">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptFormat}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Main Header */}
      <div className="text-center space-y-3 pt-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
          {meta.title}
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          {meta.subtitle}
        </p>

        {/* Feature Highlights Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>100% Privacy & Security</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Infinity className="w-4 h-4 text-accent" />
            <span>Unlimited Audio Time</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-accent" />
            <span>100% Free to Use</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-accent" />
            <span>Instantly Get Results</span>
          </span>
        </div>
      </div>

      {/* Media Type Switcher Pill: [ Audio ] | [ Record ] */}
      <div className="flex justify-center pt-2">
        <div className="inline-flex p-1 bg-sunken rounded-full border border-line">
          <button
            type="button"
            onClick={() => {
              setActiveMediaTab('audio');
              setErrorMessage(null);
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeMediaTab === 'audio'
                ? 'bg-accent text-on-accent'
                : 'text-muted hover:text-fg'
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
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeMediaTab === 'record'
                ? 'bg-accent text-on-accent'
                : 'text-muted hover:text-fg'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-surface rounded-card border border-line p-6 sm:p-10 relative overflow-hidden transition-all">
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
                  ? 'border-accent bg-accent-soft scale-[1.01]'
                  : 'border-transparent hover:border-line hover:bg-sunken/50'
              }`}
            >
              {/* Floating Emerald Circle with Cloud Icon */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full bg-accent hover:bg-accent text-on-accent flex items-center justify-center cursor-pointer transform transition-all"
              >
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-semibold text-fg">
                  {isMp3Tool
                    ? 'Upload an MP3 audio file or paste direct MP3 link'
                    : isMp4Tool
                    ? 'Upload an MP4 video file or paste direct MP4 link'
                    : 'Upload media file or paste direct audio link'}
                </h3>
                <p className="text-xs sm:text-sm text-muted">
                  {isMp3Tool
                    ? 'Strictly accepts .mp3 audio files up to 100 MB'
                    : isMp4Tool
                    ? 'Strictly accepts .mp4 video files up to 100 MB'
                    : 'Supported formats: MP3, WAV, M4A, AAC, FLAC, MP4, up to 100 MB'}
                </p>
              </div>

              {/* Action Buttons: [ Upload Audio ] & [ Link ˅ ] */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent hover:bg-accent text-on-accent font-medium text-sm transition-all transform disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {isMp3Tool ? 'Upload MP3' : isMp4Tool ? 'Upload MP4' : 'Upload Audio'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-line text-fg hover:bg-sunken font-medium text-sm transition-all"
                >
                  <span>Link</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLinkInput ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Link Input Bar (when [Link ˅] is active) */}
              {showLinkInput && (
                <div className="w-full max-w-xl mt-4 pt-2 space-y-2 animate-enter">
                  <div className="flex items-center gap-2 bg-sunken border border-line rounded-2xl p-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 transition-all">
                    <div className="pl-3 text-muted">
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
                      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-fg px-2 py-2"
                    />
                    <button
                      type="button"
                      onClick={submitUrl}
                      disabled={isSubmitting || !mediaUrl.trim()}
                      className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent text-on-accent font-medium text-xs disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? 'Loading...' : 'Transcribe'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Settings Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line text-xs text-muted">
              {/* Output Language */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted">Output Language:</span>
                <div className="relative inline-flex items-center">
                  <Globe2 className="w-3.5 h-3.5 text-accent absolute left-2.5 pointer-events-none" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="pl-8 pr-6 py-1.5 rounded-lg border border-line text-xs font-medium text-fg bg-surface hover:border-accent/50 focus:border-accent transition-colors appearance-none cursor-pointer"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-muted absolute right-2 pointer-events-none" />
                </div>
              </div>

              {/* Speaker Diarization Switch */}
              <div className="flex items-center gap-3">
                <span className="font-medium text-muted">Speaker Diarization:</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={speakerDiarization}
                  onClick={() => setSpeakerDiarization(!speakerDiarization)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    speakerDiarization ? 'bg-accent' : 'bg-line'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface ring-0 transition duration-200 ease-in-out ${
                      speakerDiarization ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-danger-soft border border-danger/30 text-danger text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-medium">Transcription Request Failed</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        ) : job.status === 'queued' || job.status === 'processing' ? (
          /* Processing State */
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-line border-t-accent animate-spin flex items-center justify-center" />
              <FileAudio className="w-8 h-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-medium text-fg">
                {job.stage === 'downloading_media'
                  ? 'Downloading media source...'
                  : job.stage === 'extracting_audio'
                  ? 'Extracting audio track...'
                  : 'AI Speech Recognition in progress...'}
              </h3>
              <p className="text-xs text-muted">
                {job.stage === 'transcribing'
                  ? 'Converting spoken audio into high-accuracy timestamped text.'
                  : 'Processing audio format for maximum transcription speed.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="w-full h-2.5 rounded-full bg-sunken overflow-hidden border border-line">
                <div
                  className="h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(15, job.progress)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium text-muted">
                <span className="truncate max-w-[250px]">{job.filename}</span>
                <span>{job.progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Completed Result View */
          <div className="space-y-6">
            {/* Result Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">
                    Transcription Complete
                  </span>
                </div>
                <h3 className="text-lg font-medium text-fg truncate max-w-md">
                  {job.filename}
                </h3>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {job.duration > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sunken text-fg font-medium">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>{formatTime(job.duration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent-soft text-accent font-medium uppercase">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{job.language || 'auto'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sunken text-fg font-medium">
                  <FileText className="w-3.5 h-3.5 text-muted" />
                  <span>{wordCount} words</span>
                </div>
              </div>
            </div>

            {/* Action Bar: Toggle Views & Download Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex p-1 bg-sunken rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('segments')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeViewTab === 'segments'
                      ? 'bg-surface text-accent'
                      : 'text-muted hover:text-fg'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Timestamps ({job.segments.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeViewTab === 'text'
                      ? 'bg-surface text-accent'
                      : 'text-muted hover:text-fg'
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
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sunken hover:bg-line text-fg text-xs font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent" />
                      <span className="text-accent">Copied!</span>
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
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sunken hover:bg-line text-fg text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </a>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'srt')}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sunken hover:bg-sunken text-muted text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SRT Subtitles</span>
                </a>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'vtt')}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sunken hover:bg-line text-fg text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>VTT</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line text-muted hover:bg-sunken text-xs font-medium transition-colors ml-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Transcript Viewer Body */}
            {activeViewTab === 'segments' ? (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2">
                {job.segments.length > 0 ? (
                  job.segments.map((seg: TranscriptionSegment) => (
                    <div
                      key={seg.id}
                      className="group p-3 rounded-2xl bg-sunken hover:bg-sunken border border-line transition-colors flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-4"
                    >
                      <span className="font-mono text-xs font-medium px-2.5 py-0.5 rounded-md bg-sunken text-muted whitespace-nowrap">
                        {formatTime(seg.start)} - {formatTime(seg.end)}
                      </span>
                      {seg.speaker && (
                        <span className="text-xs font-medium text-muted">
                          {seg.speaker}:
                        </span>
                      )}
                      <p className="text-sm text-fg leading-relaxed select-text flex-1">
                        {seg.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-fg p-4 bg-sunken rounded-2xl leading-relaxed select-text">
                    {job.text || 'No speech detected in this media file.'}
                  </p>
                )}
              </div>
            ) : (
              <textarea
                readOnly
                value={job.text}
                rows={12}
                className="w-full p-4 rounded-2xl bg-sunken border border-line font-sans text-sm text-fg leading-relaxed select-text resize-none"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
