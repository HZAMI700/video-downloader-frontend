'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface LiveAudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  onCancel?: () => void;
}

export function LiveAudioRecorder({ onRecordingComplete, onCancel }: LiveAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setError(null);
    setRecordedAudioUrl(null);
    setRecordedFile(null);
    setRecordSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);

        const fileName = `voice_recording_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.webm`;
        const file = new File([audioBlob], fileName, { type: 'audio/webm' });
        setRecordedFile(file);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // Slice every 250ms
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Microphone access denied or unavailable in this browser.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleTranscribeNow = () => {
    if (recordedFile) {
      onRecordingComplete(recordedFile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      {/* Microphone Visualizer / Pulse Circle */}
      <div className="relative">
        {isRecording && !isPaused && (
          <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-ping" />
        )}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
            isRecording
              ? isPaused
                ? 'bg-amber-500 shadow-amber-500/30'
                : 'bg-red-500 shadow-red-500/30'
              : recordedFile
              ? 'bg-emerald-500 shadow-emerald-500/30'
              : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/30'
          }`}
        >
          <Mic className="w-10 h-10" />
        </div>
      </div>

      {/* Timer & Status */}
      <div className="space-y-1">
        <p className="font-mono text-3xl font-extrabold text-slate-800">
          {formatTimer(recordSeconds)}
        </p>
        <p className="text-xs font-semibold text-slate-500">
          {isRecording
            ? isPaused
              ? 'Recording Paused'
              : 'Recording in progress (Speak now)...'
            : recordedFile
            ? 'Recording ready for transcription'
            : 'Click Start to record microphone audio directly'}
        </p>
      </div>

      {/* Animated Waveform Bars during active recording */}
      {isRecording && !isPaused && (
        <div className="flex items-center gap-1.5 h-10">
          {[12, 24, 38, 18, 30, 42, 20, 36, 14, 28, 40, 22].map((height, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-full animate-pulse"
              style={{
                height: `${height}px`,
                animationDelay: `${(i * 0.1).toFixed(1)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Playback preview if recorded */}
      {recordedAudioUrl && !isRecording && (
        <div className="w-full max-w-md pt-2">
          <audio src={recordedAudioUrl} controls className="w-full rounded-xl" />
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {!isRecording && !recordedFile ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all transform active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Start Recording</span>
          </button>
        ) : isRecording ? (
          <>
            {isPaused ? (
              <button
                type="button"
                onClick={resumeRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Square className="w-4 h-4" />
              <span>Stop Recording</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Record Again</span>
            </button>

            <button
              type="button"
              onClick={handleTranscribeNow}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Transcribe Recording Now</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
