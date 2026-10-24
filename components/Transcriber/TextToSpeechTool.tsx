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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Volume2 className="w-3.5 h-3.5" />
          <span>AI Speech Synthesis</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Text to Speech (TTS) & AI Voice Generator
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Convert any text, script, or dialogue into realistic human voice. 100% free with no login required.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-purple-500/5 space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Text to Read Aloud
          </label>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to convert into natural speech..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm text-slate-900 leading-relaxed resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Voice Model
            </label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-600 bg-white"
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
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
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
              className="w-full accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
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
              className="w-full accent-purple-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Instant playback • Unlimited characters</span>
          </div>

          <div className="flex items-center gap-3">
            {isSpeaking && !isPaused && (
              <button
                type="button"
                onClick={handlePause}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            {isSpeaking && (
              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSpeak}
              disabled={!text.trim()}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
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
