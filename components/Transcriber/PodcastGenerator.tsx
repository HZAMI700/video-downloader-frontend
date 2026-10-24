'use client';

import React, { useState, useRef } from 'react';
import { Radio, Sparkles, Play, Pause, Download, Copy, Check, Users, BookOpen, UploadCloud, FileText } from 'lucide-react';

export function PodcastGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('discussion'); // discussion, solo, interview
  const [tone, setTone] = useState('informative'); // informative, storytelling, casual
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readDocFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readDocFile(e.target.files[0]);
    }
  };

  const readDocFile = (file: File) => {
    setDroppedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const cleaned = text.trim();
        // Take first 120 chars as topic
        const sampleTopic = cleaned.split('\n')[0].replace(/^#+\s*/, '').slice(0, 80);
        setTopic(sampleTopic || file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      let script = '';
      if (style === 'discussion') {
        script = `[Theme Music - Intro 00:00 - 00:05]\n\n` +
          `Host Alex: Welcome to today's episode! Today we are diving deep into "${topic}". Joining me is our resident expert, Taylor.\n\n` +
          `Guest Taylor: Thanks for having me, Alex! This is one of the most fascinating topics right now because everything is evolving so quickly.\n\n` +
          `Host Alex: Exactly. When you look at "${topic}", what's the fundamental shift happening right before our eyes?\n\n` +
          `Guest Taylor: Great question. First and foremost, accessibility has reached an all-time high. People who previously couldn't leverage these capabilities can now do it in seconds with automated tools.\n\n` +
          `Host Alex: That is huge. And for our listeners looking to apply this today, what's your number one piece of advice?\n\n` +
          `Guest Taylor: Start small. Test the workflow, observe the immediate results, and iterate based on real feedback.\n\n` +
          `Host Alex: Spot on advice. Thank you all for tuning into this episode. Don't forget to subscribe and catch us next week!`;
      } else if (style === 'solo') {
        script = `[Theme Music - Intro 00:00 - 00:04]\n\n` +
          `Hello everyone and welcome back to the podcast. Today, I want to unpack "${topic}" in a way that is actionable and clear.\n\n` +
          `Over the past few weeks, so many of you have asked about how this works in practice. So let's break it down into three core pillars:\n\n` +
          `1. Foundations: Understanding why "${topic}" matters today.\n` +
          `2. Efficiency: How modern AI tools eliminate friction.\n` +
          `3. Results: Practical takeaways you can implement immediately.\n\n` +
          `Thank you for listening! Make sure to share this episode with someone who needs it.`;
      } else {
        script = `[Interview Segment]\n\n` +
          `Interviewer: Let's jump straight in. What first sparked your passion for "${topic}"?\n\n` +
          `Guest: It all started when I realized how much time people were wasting on repetitive tasks that could easily be automated.\n\n` +
          `Interviewer: Incredible insight. And where do you see this heading in the next 3 to 5 years?\n\n` +
          `Guest: We are moving toward real-time intelligent workflows that just work seamlessly behind the scenes.`;
      }

      setGeneratedScript(script);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedScript) return;
    const blob = new Blob([generatedScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast_script_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      if (!generatedScript) return;
      window.speechSynthesis.cancel();
      const cleanText = generatedScript.replace(/\[.*?\]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5" />
          <span>AI Podcast Studio</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Free AI Podcast Generator
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Generate complete podcast episode scripts, multi-speaker dialogues, and audio voiceovers from any topic in seconds.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.srt,.vtt,.pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-purple-500/5 space-y-6">
        {/* File Drop Area for Topic / Script Notes */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragOver
              ? 'border-purple-600 bg-purple-50 scale-[1.01]'
              : 'border-slate-200 hover:border-purple-300 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {droppedFileName
                  ? `Notes loaded: ${droppedFileName}`
                  : isDragOver
                  ? 'Release to load notes file!'
                  : 'Drop notes, transcript, or document (.txt, .md, .srt)'}
              </p>
              <p className="text-[11px] text-slate-400">
                {droppedFileName ? 'Click or drop another file to replace' : 'Auto-extracts topic and key talking points'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
            Browse File
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Podcast Topic or Keyword
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The Future of Artificial Intelligence, Healthy Habit Building..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Episode Format
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="discussion">Co-Hosts Discussion (Alex & Taylor)</option>
                <option value="solo">Solo Host Deep Dive</option>
                <option value="interview">Expert Q&A Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tone & Style
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="informative">Informative & Educational</option>
                <option value="storytelling">Narrative & Engaging</option>
                <option value="casual">Casual & Conversational</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Generating Episode...' : 'Generate Podcast Episode'}</span>
          </button>
        </div>

        {generatedScript && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Generated Script & Audio</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isPlaying ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Audio' : 'Play Voiceover'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {generatedScript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
