'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Loader2, X, AlertCircle, UploadCloud } from 'lucide-react';
import { ShinyText } from './ShinyText';

interface HeroInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error?: string | null;
  onFileDrop?: (file: File) => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({ onAnalyze, isLoading, error, onFileDrop }) => {
  const [url, setUrl] = useState('');
  const [clientValidationNotice, setClientValidationNotice] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || isLoading) return;

    // Security validation on client side
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setClientValidationNotice('Please provide a valid web URL starting with https:// or http://');
      return;
    }

    setClientValidationNotice(null);
    onAnalyze(trimmed);
  };

  return (
    <div id="download-input" className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 pt-4 sm:pt-8 scroll-mt-24">
      {/* Headlines */}
      <motion.div
        className="space-y-4 max-w-3xl"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Download{' '}
          <ShinyText text="Any Video" speed={3.5} />{' '}
          with <span className="skywork-gradient-text">Playzy</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          The fastest free online tool to download videos from TikTok, Pinterest, Facebook, Instagram Reels, and YouTube without watermarks. 100% free, secure &amp; unlimited.
        </p>
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*,.mp4,.mov,.mkv,.webm,.mp3"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && onFileDrop) {
            onFileDrop(e.target.files[0]);
          }
        }}
      />

      {/* Input Box with Skywork Styling */}
      <motion.div
        className="w-full max-w-3xl px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        <form
          onSubmit={handleSubmit}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0] && onFileDrop) {
              onFileDrop(e.dataTransfer.files[0]);
            }
          }}
          className="relative"
        >
          <div
            className={`rounded-2xl sm:rounded-3xl p-[1.5px] transition-all duration-300 ${
              isDragOver
                ? 'bg-[#00c9a7] ring-4 ring-[#00c9a7]/20 shadow-xl scale-[1.01]'
                : 'bg-[#263241] hover:border-[#00c9a7]/40 shadow-xl'
            }`}
          >
            <div className="flex items-center bg-[#181D24] rounded-[14px] sm:rounded-[22px] p-2 sm:p-2.5">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (clientValidationNotice) setClientValidationNotice(null);
                }}
                placeholder={
                  isDragOver
                    ? 'Release video file to convert & download...'
                    : 'Paste video, playlist, or audio link here...'
                }
                required
                disabled={isLoading}
                className="w-full bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base md:text-lg font-normal"
              />

              {url && (
                <button
                  type="button"
                  onClick={() => {
                    setUrl('');
                    setClientValidationNotice(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-200 transition"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <motion.button
                type="submit"
                disabled={!url.trim() || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="shrink-0 flex items-center justify-center gap-1.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-[#00A9C0] to-[#00c9a7] hover:from-[#00c9a7] hover:to-[#29CC5F] shadow-[0_0_18px_rgba(0,201,167,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Download</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>

        {/* File Drop Option Link */}
        {onFileDrop && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-2.5 text-center text-xs text-slate-500 hover:text-[#00c9a7] cursor-pointer font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Or drag & drop local video or audio file to convert</span>
          </div>
        )}

        {/* Validation or backend error notice */}
        <AnimatePresence>
          {(error || clientValidationNotice) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm text-left flex items-start gap-2.5 shadow-sm"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{clientValidationNotice || error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supported Platforms icons row matching screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mt-6 text-sm text-slate-400">
          {/* YouTube */}
          <motion.div whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-sm cursor-pointer">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </motion.div>

          {/* TikTok */}
          <motion.div whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-sm cursor-pointer">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </motion.div>

          {/* Instagram */}
          <motion.div whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] flex items-center justify-center text-white shadow-sm cursor-pointer">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </motion.div>

          {/* Facebook */}
          <motion.div whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-sm cursor-pointer" title="Facebook">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.625c-.202.324-.266.793-.266 1.493v1.758h4.033l-.547 3.667h-3.486v7.98c5.441-.758 9.666-5.438 9.666-11.085 0-6.223-5.044-11.267-11.267-11.267C5.044 1.339 0 6.383 0 12.606c0 5.647 4.225 10.327 9.666 11.085z"/>
            </svg>
          </motion.div>

          {/* Pinterest */}
          <motion.div whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-full bg-[#E60023] flex items-center justify-center text-white shadow-sm cursor-pointer" title="Pinterest">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.39.03-3.42.15-.98 1.01-4.28 1.01-4.28s-.26-.52-.26-1.28c0-1.2.7-2.1 1.57-2.1.74 0 1.1.55 1.1 1.22 0 .74-.47 1.86-.72 2.89-.2.86.43 1.56 1.28 1.56 1.54 0 2.73-1.62 2.73-3.96 0-2.07-1.49-3.52-3.62-3.52-2.47 0-3.92 1.85-3.92 3.76 0 .74.29 1.54.64 1.98.07.09.08.16.06.25-.07.28-.22.89-.25 1.01-.04.17-.14.21-.32.13-1.19-.55-1.93-2.29-1.93-3.69 0-3 2.18-5.76 6.29-5.76 3.3 0 5.87 2.35 5.87 5.5 0 3.28-2.07 5.92-4.94 5.92-.97 0-1.87-.5-2.18-1.09l-.59 2.27c-.22.83-.8 1.87-1.19 2.51A11.98 11.98 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
            </svg>
          </motion.div>

          {/* X / Twitter */}
          <motion.div whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-sm cursor-pointer">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </motion.div>

          <span className="font-semibold text-slate-700 tracking-tight pl-1">
            + 100 more supported
          </span>
        </div>
      </motion.div>
    </div>
  );
};
