'use client';

import React, { useState } from 'react';
import { Search, Clipboard, X, Loader2, ArrowRight, Link as LinkIcon, Sparkles } from 'lucide-react';

interface UrlFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onAnalyze, isLoading, error }) => {
  const [url, setUrl] = useState('');
  const [clipboardNotice, setClipboardNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onAnalyze(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setClipboardNotice(true);
        setTimeout(() => setClipboardNotice(false), 2000);
      }
    } catch {
      // Clipboard access denied or not supported in context
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500 group-focus-within:opacity-75" />

        <div className="relative flex flex-col sm:flex-row items-center bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 hover:border-slate-600 rounded-2xl sm:rounded-full p-2 shadow-2xl transition duration-300">
          {/* Link Icon */}
          <div className="hidden sm:flex items-center pl-4 text-slate-400">
            <LinkIcon className="w-5 h-5 text-indigo-400" />
          </div>

          {/* Input */}
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste media link here (YouTube, TikTok, Instagram, X/Twitter, etc.)..."
            required
            disabled={isLoading}
            className="w-full bg-transparent px-4 py-3 sm:py-3.5 text-white placeholder-slate-400 focus:outline-none text-sm md:text-base font-normal"
          />

          {/* Input helper buttons */}
          <div className="flex items-center gap-2 pr-1 w-full sm:w-auto justify-end mt-2 sm:mt-0">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Clear input"
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            >
              <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>{clipboardNotice ? 'Pasted!' : 'Paste'}</span>
            </button>

            {/* Analyze submit button */}
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm flex items-start gap-3 animate-fadeIn">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-red-300">Extraction Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};
