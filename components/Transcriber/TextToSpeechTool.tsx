'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RefreshCw, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export function TextToSpeechTool() {
  const [text, setText] = useState('Welcome to Audio Transcriber AI. Convert any written text into natural-sounding speech instantly with zero login required.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunken border border-line text-muted text-xs font-medium">
          <Volume2 className="w-3.5 h-3.5" />
          <span>AI Speech Synthesis</span>
        </div>
        <h2 className="text-3xl font-semibold text-fg tracking-tight">
          Text to Speech (TTS) & AI Voice Generator
        </h2>
        <p className="text-sm text-muted max-w-xl mx-auto">
          Convert any text, script, or dialogue into realistic human voice. 100% free with no login required.
        </p>
      </div>

      <div className="bg-surface rounded-3xl border border-line p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-fg mb-2">
            Text to Read Aloud
          </label>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to convert into natural speech..."
            className="w-full p-4 rounded-2xl border border-line focus:border-line focus:ring-2 focus:ring-line text-sm text-fg leading-relaxed resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-fg mb-2">
              Voice Model
            </label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-line text-xs font-medium text-fg focus:border-line bg-surface"
            >
              {voices.length > 0 ? (
                voices.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.lang})
                  </option>
                ))
              ) : (
                <option value={0}>Default Browser Voice</option>
              )}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-fg mb-2">
              <span>Speed Rate</span>
              <span>{rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-fg mb-2">
              <span>Pitch</span>
              <span>{pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line">
          <div className="flex items-center gap-2 text-xs text-muted">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>Instant playback • Unlimited characters</span>
          </div>

          <div className="flex items-center gap-3">
            {isSpeaking && !isPaused && (
              <button
                type="button"
                onClick={handlePause}
                className="px-4 py-2.5 rounded-xl border border-line text-fg hover:bg-sunken text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            {isSpeaking && (
              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-2.5 rounded-xl bg-danger-soft hover:bg-danger-soft text-danger text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSpeak}
              disabled={!text.trim()}
              className="px-8 py-3 rounded-full bg-accent hover:bg-accent-hover text-on-accent font-medium text-sm disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPaused ? 'Resume Speech' : isSpeaking ? 'Restart Speech' : 'Generate & Speak'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
