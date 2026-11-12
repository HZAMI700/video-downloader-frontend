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
  ChevronLeft,
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
  onBackToCategory?: () => void;
}

export function AudioDspStudio({ toolId, onBackToCategory }: AudioDspStudioProps) {
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
          theme: 'bg-warning',
          accent: 'text-warning',
          icon: <Volume2 className="w-5 h-5 text-warning" />,
        };
      case 'ai-vocal-remover':
        return {
          title: 'Free AI Vocal Remover: Remove Vocals from Any Song',
          subtitle: 'Extract karaoke instrumental tracks or isolate pure acappella vocals with studio precision.',
          badge: 'AI Vocal & Karaoke Splitter',
          theme: 'bg-danger',
          accent: 'text-danger',
          icon: <Disc className="w-5 h-5 text-danger" />,
        };
      case 'ai-voice-cleaner':
        return {
          title: 'Free AI Voice Cleaner — Get Studio-Quality Audio',
          subtitle: 'Remove background noise, breath sounds, and mouth clicks with one click for crystal-clear voiceovers.',
          badge: 'Studio Voice Polish',
          theme: 'bg-accent',
          accent: 'text-accent',
          icon: <Sparkles className="w-5 h-5 text-accent" />,
        };
      case 'background-noise-remover':
        return {
          title: 'Online Background Noise Remover Free — Lossless Audio',
          subtitle: 'Eliminate traffic noise, wind, fan hum, and room echo while keeping original spoken speech intact.',
          badge: 'Spectral De-Noiser',
          theme: 'bg-info',
          accent: 'text-info',
          icon: <Radio className="w-5 h-5 text-info" />,
        };
      case 'background-music-remover':
        return {
          title: 'Online Background Music Remover — Free & Easy to Use',
          subtitle: 'Mute background soundtracks and music tracks in podcasts and videos to highlight dialogue.',
          badge: 'Dialogue Isolator',
          theme: 'bg-accent',
          accent: 'text-muted',
          icon: <Music2 className="w-5 h-5 text-muted" />,
        };
      case 'ai-voice-changer':
      default:
        return {
          title: 'Free AI Voice Changer: Change Your Voice Instantly',
          subtitle: 'Transform your voice with natural pitch shifting, robotic effects, and character presets.',
          badge: 'Voice Changer FX',
          theme: 'bg-info',
          accent: 'text-info',
          icon: <Wand2 className="w-5 h-5 text-info" />,
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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-enter">
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-accent-soft border-accent/30 text-accent">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{meta.badge}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
          {meta.title}
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          {meta.subtitle}
        </p>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-surface rounded-card border border-line p-6 sm:p-10 space-y-8">
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
              ? 'border-accent bg-accent-soft scale-[1.01]'
              : selectedFile
              ? 'border-accent bg-accent-soft'
              : 'border-line hover:border-line-strong bg-sunken/50'
          }`}
        >
          <div
            className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-3 border border-accent/20"
          >
            {meta.icon}
          </div>

          {isDragOver ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-accent">
                Release file to drop into {meta.badge}!
              </p>
              <p className="text-xs text-muted">Supports all standard audio & video formats</p>
            </div>
          ) : selectedFile ? (
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted uppercase tracking-wider block">
                Selected File
              </span>
              <p className="text-sm font-semibold text-fg">{selectedFile.name}</p>
              <p className="text-xs text-muted">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drop another file to change
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-fg">
                Click or drag & drop audio file to process
              </p>
              <p className="text-xs text-muted">
                Supports MP3, WAV, AAC, M4A, FLAC, MP4 up to 100 MB
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Controls based on Tool */}
        <div className="p-5 rounded-2xl bg-sunken border border-line space-y-4">
          {toolId === 'volume-booster' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-fg">Volume Amplification Factor:</span>
                <span className="px-2 py-0.5 rounded-md bg-warning-soft text-warning">
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
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted font-medium">
                <span>100% (Original)</span>
                <span>200% (+6dB)</span>
                <span>300% (+9.5dB)</span>
                <span>500% (Maximum +14dB)</span>
              </div>
            </div>
          )}

          {toolId === 'ai-vocal-remover' && (
            <div className="space-y-3">
              <span className="text-xs font-medium text-fg block">Separation Track Output:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVocalMode('instrumental')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    vocalMode === 'instrumental'
                      ? 'border-danger bg-danger-soft ring-2 ring-danger/30'
                      : 'border-line hover:border-danger/30 bg-surface'
                  }`}
                >
                  <span className="text-xs font-medium text-fg block">
                    Instrumental / Karaoke Track
                  </span>
                  <span className="text-xs text-muted">
                    Removes vocals and keeps drums, bass & melody
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVocalMode('vocals')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    vocalMode === 'vocals'
                      ? 'border-danger bg-danger-soft ring-2 ring-danger/30'
                      : 'border-line hover:border-danger/30 bg-surface'
                  }`}
                >
                  <span className="text-xs font-medium text-fg block">
                    Vocals Only (Acappella)
                  </span>
                  <span className="text-xs text-muted">
                    Isolates lead and background singing voice
                  </span>
                </button>
              </div>
            </div>
          )}

          {toolId === 'ai-voice-changer' && (
            <div className="space-y-3">
              <span className="text-xs font-medium text-fg block">Select Voice Effect Preset:</span>
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
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      voicePreset === p.id
                        ? 'border-info bg-info-soft ring-2 ring-info/30 text-info'
                        : 'border-line hover:border-info/30 bg-surface text-fg'
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
              <span className="font-medium text-fg">Spectral De-Noising Filter:</span>
              <span className="font-medium text-accent bg-accent-soft px-2.5 py-1 rounded-md border border-accent/30">
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
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent hover:bg-accent text-on-accent font-semibold text-sm transition-all transform disabled:opacity-50"
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
          <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-soft border border-danger/30 text-danger text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Completed Output Card with ElevenLabs Pro Audio Visualizer */}
        {resultAudioUrl && (
          <div className="p-6 rounded-2xl bg-bg text-fg space-y-4 animate-enter border border-line">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                  Processing Complete
                </span>
                <h4 className="text-base font-semibold">{meta.title} — Audio Ready</h4>
              </div>
              <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center border border-accent/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Visual Waveform Simulation */}
            <div className="flex items-center justify-between gap-1 h-10 py-2 px-3 rounded-xl bg-surface/90 border border-line">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-accent"
                  style={{
                    height: `${20 + Math.sin(i * 0.45) * 35 + ((i % 5) * 8)}%`,
                  }}
                />
              ))}
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-xs transition-all whitespace-nowrap"
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
