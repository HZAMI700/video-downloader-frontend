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
} from 'lucide-react';
import {
  uploadAndTranscribeFile,
  transcribeMediaUrl,
  fetchTranscriptionStatus,
  getTranscriptionExportUrl,
} from '../../lib/api';
import { TranscriptionJob, TranscriptionSegment } from '../../lib/types';

const LANGUAGES = [
  { code: 'auto', label: 'Auto Detect Language' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ar', label: 'Arabic' },
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

export function AudioTranscriber() {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [job, setJob] = useState<TranscriptionJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeViewTab, setActiveViewTab] = useState<'segments' | 'text'>('segments');
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

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
          if (updated.status === 'failed' && updated.error) {
            setErrorMessage(updated.error);
          }
        }
      } catch (err: any) {
        // Continue polling until resolved or max retries
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
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (inputMode === 'upload') {
      if (!selectedFile) {
        setErrorMessage('Please select an audio or video file first.');
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await uploadAndTranscribeFile(selectedFile, selectedLanguage);
        const initialJob: TranscriptionJob = {
          job_id: response.job_id,
          source_type: 'file',
          filename: response.filename || selectedFile.name,
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
    } else {
      if (!mediaUrl.trim()) {
        setErrorMessage('Please enter a valid media URL.');
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await transcribeMediaUrl(mediaUrl.trim(), selectedLanguage);
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
        setErrorMessage(err.message || 'Failed to queue media URL for transcription.');
      } finally {
        setIsSubmitting(false);
      }
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

  const wordCount = job?.text ? job.text.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title & Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Speech-to-Text Transcription</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Transcribe Audio & Video to Text
        </h2>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Convert speech from MP3, WAV, MP4, MOV, or media links into accurate text with clickable timestamps, SRT subtitles, and TXT export.
        </p>
      </div>

      {/* Main Workspace Card */}
      <div className="rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {!job || job.status === 'failed' ? (
          <div className="space-y-6 relative z-10">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl w-fit mx-auto">
              <button
                type="button"
                onClick={() => {
                  setInputMode('upload');
                  setErrorMessage(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'upload'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode('url');
                  setErrorMessage(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'url'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>Media Link / URL</span>
              </button>
            </div>

            {/* Upload Zone */}
            {inputMode === 'upload' ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                  isDragOver
                    ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                    : selectedFile
                    ? 'border-emerald-500/40 bg-white/[0.03]'
                    : 'border-white/20 hover:border-emerald-500/50 hover:bg-white/[0.02]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.mp4,.mov,.mkv,.webm"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FileAudio className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white truncate max-w-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to transcribe
                      </p>
                    </div>
                    <span className="text-xs text-emerald-400 underline hover:text-emerald-300">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-white">
                        Drag and drop your audio or video file here
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports MP3, WAV, M4A, AAC, FLAC, MP4, MOV, WEBM (up to 100 MB)
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* URL Input Tab */
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Paste direct audio/video URL or YouTube/TikTok/Instagram link..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-gray-500 transition-colors"
                  />
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">
                  Enter a direct media stream URL or public video link. Audio will be extracted and transcribed.
                </p>
              </div>
            )}

            {/* Controls Bar: Language + Submit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-300">Spoken Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-900 text-white">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (inputMode === 'upload' && !selectedFile) || (inputMode === 'url' && !mediaUrl.trim())}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-semibold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Queuing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Transcribe Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Transcription failed</p>
                  <p className="text-red-300">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        ) : job.status === 'queued' || job.status === 'processing' ? (
          /* Processing State */
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin flex items-center justify-center" />
              <FileAudio className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold text-white">
                {job.stage === 'downloading_media'
                  ? 'Downloading media source...'
                  : job.stage === 'extracting_audio'
                  ? 'Extracting audio track...'
                  : 'AI Speech Recognition in progress...'}
              </h3>
              <p className="text-xs text-gray-400">
                {job.stage === 'transcribing'
                  ? 'Our neural speech model is converting audio into timestamped text.'
                  : 'Preparing audio format for optimal transcription speed.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${Math.max(15, job.progress)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>{job.filename}</span>
                <span>{job.progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Completed Result View */
          <div className="space-y-6 relative z-10">
            {/* Result Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Transcription Complete
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white truncate max-w-md">
                  {job.filename}
                </h3>
              </div>

              {/* Stats Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {job.duration > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{formatTime(job.duration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                  <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                  <span className="uppercase">{job.language || 'en'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>{wordCount} words</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Copy & Downloads */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('segments')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeViewTab === 'segments'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white'
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
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white'
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </a>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'srt')}
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SRT Subtitles</span>
                </a>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'vtt')}
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>VTT</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium transition-colors ml-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Transcript Body */}
            {activeViewTab === 'segments' ? (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {job.segments.length > 0 ? (
                  job.segments.map((seg: TranscriptionSegment) => (
                    <div
                      key={seg.id}
                      className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-4"
                    >
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/40 text-emerald-400/90 border border-emerald-500/20 whitespace-nowrap">
                        {formatTime(seg.start)} - {formatTime(seg.end)}
                      </span>
                      {seg.speaker && (
                        <span className="text-[11px] font-semibold text-purple-400">
                          {seg.speaker}:
                        </span>
                      )}
                      <p className="text-sm text-gray-200 leading-relaxed select-text flex-1">
                        {seg.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300 p-4 bg-white/5 rounded-xl leading-relaxed select-text">
                    {job.text || 'No speech detected in this media file.'}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative">
                <textarea
                  readOnly
                  value={job.text}
                  rows={14}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 font-sans text-sm text-gray-200 leading-relaxed focus:outline-none select-text resize-none custom-scrollbar"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
