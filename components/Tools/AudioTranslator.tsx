'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Languages,
  UploadCloud,
  Link2,
  FileAudio,
  Sparkles,
  Copy,
  Check,
  Download,
  Volume2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Globe2,
  ChevronDown,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import {
  uploadAndTranscribeFile,
  transcribeMediaUrl,
  fetchTranscriptionStatus,
  translateTranscriptText,
  getTranscriptionExportUrl,
} from '../../lib/api';
import { TranscriptionJob } from '../../lib/types';

interface AudioTranslatorProps {
  toolId?: ToolId;
}

const LANGUAGES = [
  { code: 'auto', label: 'Auto Detect Language' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ta', label: 'Tamil' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'zh', label: 'Chinese (Mandarin)' },
  { code: 'ja', label: 'Japanese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ru', label: 'Russian' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ko', label: 'Korean' },
];

export function AudioTranslator({ toolId = 'audio-translator' }: AudioTranslatorProps) {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState(toolId === 'english-to-tamil' ? 'ta' : 'es');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const [job, setJob] = useState<TranscriptionJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'subtitles'>('split');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (toolId === 'english-to-tamil') {
      setSourceLang('en');
      setTargetLang('ta');
    }
  }, [toolId]);

  const startJobPolling = (jobId: string, destLang: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const updated = await fetchTranscriptionStatus(jobId);
        setJob(updated);

        if (updated.status === 'completed' || updated.status === 'failed') {
          if (pollingRef.current) clearInterval(pollingRef.current);

          if (updated.status === 'completed' && updated.text) {
            // Trigger translation into target language
            handleRunTranslation(updated.text, destLang);
          }
          if (updated.status === 'failed') {
            setErrorMessage(updated.error || 'Transcription failed.');
            setIsProcessing(false);
          }
        }
      } catch (err) {
        // Polling retry
      }
    }, 1500);
  };

  const handleRunTranslation = async (text: string, langCode: string) => {
    setIsTranslating(true);
    const targetLabel = LANGUAGES.find((l) => l.code === langCode)?.label || langCode;

    try {
      const res = await translateTranscriptText(text, targetLabel, sourceLang);
      setTranslatedText(res.translated_text);
    } catch (err: any) {
      setErrorMessage(`Translation notice: ${err.message}`);
    } finally {
      setIsTranslating(false);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setJob(null);
    setTranslatedText('');

    try {
      const res = await uploadAndTranscribeFile(file, sourceLang);
      const initialJob: TranscriptionJob = {
        job_id: res.job_id,
        source_type: 'file',
        filename: res.filename || file.name,
        status: 'queued',
        progress: 15,
        stage: 'uploading',
        text: '',
        segments: [],
        duration: 0,
        language: sourceLang,
        created_at: Date.now() / 1000,
      };
      setJob(initialJob);
      startJobPolling(res.job_id, targetLang);
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload failed.');
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mediaUrl.trim()) {
      setErrorMessage('Please enter an audio or video link.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setJob(null);
    setTranslatedText('');

    try {
      const res = await transcribeMediaUrl(mediaUrl.trim(), sourceLang);
      const initialJob: TranscriptionJob = {
        job_id: res.job_id,
        source_type: 'url',
        filename: mediaUrl.trim(),
        status: 'queued',
        progress: 15,
        stage: 'queued',
        text: '',
        segments: [],
        duration: 0,
        language: sourceLang,
        created_at: Date.now() / 1000,
      };
      setJob(initialJob);
      startJobPolling(res.job_id, targetLang);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit URL for translation.');
      setIsProcessing(false);
    }
  };

  const handleSpeakText = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'auto' ? 'en' : langCode;
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, isOriginal: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslated(true);
      setTimeout(() => setCopiedTranslated(false), 2000);
    }
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.mp4,.mov,.webm"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Languages className="w-4 h-4 text-blue-600" />
          <span>150+ Spoken Languages Supported</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          AI Audio Translator Online — Translate Audio to 150+ Languages
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Convert spoken audio from podcasts, interviews, YouTube, and videos into translated text & subtitles in seconds. No login required.
        </p>
      </div>

      {/* Language Selector Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          {/* Source Language */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">From:</span>
            <div className="relative flex-1 sm:w-52">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 appearance-none shadow-xs"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-blue-600 hidden sm:block flex-shrink-0" />

          {/* Target Language */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Translate To:</span>
            <div className="relative flex-1 sm:w-52">
              <select
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                  if (job?.text) {
                    handleRunTranslation(job.text, e.target.value);
                  }
                }}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-white border border-blue-300 text-xs font-bold text-blue-800 focus:outline-none focus:border-blue-600 appearance-none shadow-xs"
              >
                {LANGUAGES.filter((l) => l.code !== 'auto').map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-blue-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Upload or Link Area with Full Drag & Drop Support */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed transition-all space-y-4 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01] shadow-lg shadow-blue-500/10'
              : 'border-slate-200 hover:border-blue-300 bg-slate-50/40'
          }`}
        >
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 cursor-pointer transform hover:scale-105 transition-all"
          >
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isDragOver
                ? 'Release to drop & translate audio file!'
                : 'Upload Audio File or Paste Media Link to Translate'}
            </h3>
            <p className="text-xs text-slate-400">
              Drag and drop any audio or video file, or paste URL • Supports MP3, WAV, M4A, AAC, MP4 up to 100 MB
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Audio File</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              <Link2 className="w-4 h-4" />
              <span>Online Link</span>
            </button>
          </div>

          {/* Link Bar */}
          {showLinkInput && (
            <form onSubmit={handleUrlSubmit} className="w-full max-w-xl pt-2 animate-fadeIn">
              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-1.5 focus-within:border-blue-600 shadow-xs">
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Paste YouTube, TikTok, or direct audio link..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !mediaUrl.trim()}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Translate
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Processing Spinner */}
        {isProcessing && (
          <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center animate-fadeIn">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-slate-800">
              {job?.stage === 'transcribing'
                ? 'Transcribing audio speech...'
                : isTranslating
                ? 'Translating into target language...'
                : 'Processing audio stream...'}
            </p>
            <p className="text-xs text-slate-400">Powered by Groq Whisper & LLaMA</p>
          </div>
        )}

        {/* Translation Results: Dual Side-by-Side View */}
        {job?.status === 'completed' && job.text && (
          <div className="space-y-4 pt-4 border-t border-slate-200 animate-fadeIn">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Translation Result</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadTextFile(translatedText || job.text, `translated_${targetLang}.txt`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>

                <a
                  href={getTranscriptionExportUrl(job.job_id, 'srt')}
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Original SRT</span>
                </a>
              </div>
            </div>

            {/* Dual Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Original Spoken Audio Transcript */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Original Audio ({job.language?.toUpperCase() || 'AUDIO'})
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSpeakText(job.text, job.language || 'en')}
                        title="Listen"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(job.text, true)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto text-xs sm:text-sm text-slate-800 leading-relaxed font-sans pr-2">
                    {job.text}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Translated Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Translated ({targetLang.toUpperCase()})
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSpeakText(translatedText, targetLang)}
                        title="Listen"
                        className="p-1 text-blue-500 hover:text-blue-800 rounded-md transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(translatedText, false)}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        {copiedTranslated ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTranslated ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto text-xs sm:text-sm text-slate-900 leading-relaxed font-sans pr-2">
                    {isTranslating ? (
                      <div className="flex items-center gap-2 text-blue-600 py-6">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-semibold">Generating translation...</span>
                      </div>
                    ) : (
                      translatedText || 'Select target language above to translate.'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
