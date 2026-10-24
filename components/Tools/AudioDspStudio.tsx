'use client';

import React, { useState, useRef } from 'react';
import {
  Volume2,
  Disc,
  Sparkles,
  Radio,
  Music2,
  Wand2,
  UploadCloud,
  Download,
  Play,
  Pause,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { ToolId } from '../AppSidebar';
import {
  processAudioBoost,
  processVocalRemover,
  processAudioClean,
  processVoiceChange,
} from '../../lib/api';

interface AudioDspStudioProps {
  toolId: ToolId;
}

export function AudioDspStudio({ toolId }: AudioDspStudioProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [boostPercent, setBoostPercent] = useState<number>(200); // 100 to 500%
  const [vocalMode, setVocalMode] = useState<'instrumental' | 'vocals'>('instrumental');
  const [voicePreset, setVoicePreset] = useState<string>('deep');
  const [noiseLevel, setNoiseLevel] = useState<'mild' | 'moderate' | 'aggressive'>('moderate');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultAudioUrl, setResultAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const getToolMeta = () => {
    switch (toolId) {
      case 'volume-booster':
        return {
          title: 'Free Volume Booster: Louder Audio Without Distortion',
          subtitle: 'Break through default volume limits and amplify sound up to 500% louder with zero clipping.',
          badge: 'Volume Booster 500%',
          theme: 'from-amber-500 to-orange-600',
          accent: 'text-amber-600',
          icon: <Volume2 className="w-5 h-5 text-amber-600" />,
        };
      case 'ai-vocal-remover':
        return {
          title: 'Free AI Vocal Remover: Remove Vocals from Any Song',
          subtitle: 'Extract karaoke instrumental tracks or isolate pure acappella vocals with studio precision.',
          badge: 'AI Vocal & Karaoke Splitter',
          theme: 'from-rose-500 to-red-600',
          accent: 'text-rose-600',
          icon: <Disc className="w-5 h-5 text-rose-600" />,
        };
      case 'ai-voice-cleaner':
        return {
          title: 'Free AI Voice Cleaner — Get Studio-Quality Audio',
          subtitle: 'Remove background noise, breath sounds, and mouth clicks with one click for crystal-clear voiceovers.',
          badge: 'Studio Voice Polish',
          theme: 'from-emerald-500 to-teal-600',
          accent: 'text-emerald-600',
          icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
        };
      case 'background-noise-remover':
        return {
          title: 'Online Background Noise Remover Free — Lossless Audio',
          subtitle: 'Eliminate traffic noise, wind, fan hum, and room echo while keeping original spoken speech intact.',
          badge: 'Spectral De-Noiser',
          theme: 'from-blue-600 to-indigo-600',
          accent: 'text-blue-600',
          icon: <Radio className="w-5 h-5 text-blue-600" />,
        };
      case 'background-music-remover':
        return {
          title: 'Online Background Music Remover — Free & Easy to Use',
          subtitle: 'Mute background soundtracks and music tracks in podcasts and videos to highlight dialogue.',
          badge: 'Dialogue Isolator',
          theme: 'from-violet-600 to-purple-600',
          accent: 'text-violet-600',
          icon: <Music2 className="w-5 h-5 text-violet-600" />,
        };
      case 'ai-voice-changer':
      default:
        return {
          title: 'Free AI Voice Changer: Change Your Voice Instantly',
          subtitle: 'Transform your voice with natural pitch shifting, robotic effects, and character presets.',
          badge: 'Voice Changer FX',
          theme: 'from-cyan-500 to-blue-600',
          accent: 'text-cyan-600',
          icon: <Wand2 className="w-5 h-5 text-cyan-600" />,
        };
    }
  };

  const meta = getToolMeta();

  const handleProcess = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or drop an audio file first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setResultAudioUrl(null);

    try {
      let outputBlob: Blob;

      if (toolId === 'volume-booster') {
        outputBlob = await processAudioBoost(selectedFile, boostPercent);
      } else if (toolId === 'ai-vocal-remover') {
        outputBlob = await processVocalRemover(selectedFile, vocalMode);
      } else if (
        toolId === 'ai-voice-cleaner' ||
        toolId === 'background-noise-remover' ||
        toolId === 'background-music-remover'
      ) {
        outputBlob = await processAudioClean(selectedFile);
      } else {
        // Voice changer
        outputBlob = await processVoiceChange(selectedFile, voicePreset);
      }

      const blobUrl = URL.createObjectURL(outputBlob);
      setResultAudioUrl(blobUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Audio processing failed. Please try a standard MP3 or WAV file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.mp4"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setResultAudioUrl(null);
            setErrorMessage(null);
          }
        }}
      />

      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-xs bg-slate-50 border-slate-200">
          <span className={`w-2 h-2 rounded-full bg-current ${meta.accent} animate-pulse`} />
          <span className={meta.accent}>{meta.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {meta.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {meta.subtitle}
        </p>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-10 space-y-8">
        {/* File Ingest Drop Zone with Drag and Drop */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setSelectedFile(e.dataTransfer.files[0]);
              setResultAudioUrl(null);
              setErrorMessage(null);
            }
          }}
          className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragOver
              ? 'border-purple-500 bg-purple-50/70 scale-[1.01] shadow-lg shadow-purple-500/10'
              : selectedFile
              ? 'border-purple-500 bg-purple-50/30'
              : 'border-slate-300 hover:border-purple-400 bg-slate-50/50'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${meta.theme} text-white flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3`}
          >
            {meta.icon}
          </div>

          {isDragOver ? (
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-purple-700">
                Release file to drop into {meta.badge}!
              </p>
              <p className="text-xs text-purple-500">Supports all standard audio & video formats</p>
            </div>
          ) : selectedFile ? (
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                Selected File
              </span>
              <p className="text-sm font-extrabold text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drop another file to change
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-slate-800">
                Click or drag & drop audio file to process
              </p>
              <p className="text-xs text-slate-400">
                Supports MP3, WAV, AAC, M4A, FLAC, MP4 up to 100 MB
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Controls based on Tool */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          {toolId === 'volume-booster' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Volume Amplification Factor:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {boostPercent}% (+{(Math.log10(boostPercent / 100) * 20).toFixed(1)} dB)
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="25"
                value={boostPercent}
                onChange={(e) => setBoostPercent(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>100% (Original)</span>
                <span>200% (+6dB)</span>
                <span>300% (+9.5dB)</span>
                <span>500% (Maximum +14dB)</span>
              </div>
            </div>
          )}

          {toolId === 'ai-vocal-remover' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Separation Track Output:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVocalMode('instrumental')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    vocalMode === 'instrumental'
                      ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-rose-200 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">
                    Instrumental / Karaoke Track
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Removes vocals and keeps drums, bass & melody
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVocalMode('vocals')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    vocalMode === 'vocals'
                      ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-rose-200 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">
                    Vocals Only (Acappella)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Isolates lead and background singing voice
                  </span>
                </button>
              </div>
            </div>
          )}

          {toolId === 'ai-voice-changer' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Select Voice Effect Preset:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'deep', label: 'Deep Male' },
                  { id: 'chipmunk', label: 'Chipmunk' },
                  { id: 'robot', label: 'Cyborg Robot' },
                  { id: 'radio', label: 'Vintage Radio' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setVoicePreset(p.id)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      voicePreset === p.id
                        ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-100 text-cyan-900'
                        : 'border-slate-200 hover:border-cyan-200 bg-white text-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(toolId === 'ai-voice-cleaner' ||
            toolId === 'background-noise-remover' ||
            toolId === 'background-music-remover') && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Spectral De-Noising Filter:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Studio Preset (80Hz Highpass + Dynamic Noise Gate)
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleProcess}
          disabled={isProcessing || !selectedFile}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r ${meta.theme} text-white font-extrabold text-sm shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all transform active:scale-[0.99] disabled:opacity-50`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Audio with FFmpeg DSP...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Process & Generate Result</span>
            </>
          )}
        </button>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Completed Output Card */}
        {resultAudioUrl && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Success
                </span>
                <h4 className="text-base font-extrabold">Audio Processing Complete!</h4>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Audio Preview Player */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <audio
                ref={audioPlayerRef}
                src={resultAudioUrl}
                controls
                className="w-full sm:flex-1 h-11 rounded-lg"
              />

              <a
                href={resultAudioUrl}
                download={`processed_${toolId}_${Date.now()}.mp3`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Download Result (MP3)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
