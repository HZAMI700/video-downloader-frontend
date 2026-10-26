'use client';

import React from 'react';
import { Play, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-[#212932] bg-white/85 dark:bg-[#0F131A]/85 py-12 px-4 mt-20 text-slate-500 dark:text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9333EA] via-[#6366F1] to-[#06B6D4] flex items-center justify-center text-white shadow-xs">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              Playzy
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">The Free Online Video Downloader</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 dark:text-slate-400 font-semibold text-xs">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SSL Encrypted</span>
            </span>
            <span>•</span>
            <span>No Watermark</span>
            <span>•</span>
            <span>100% Free Forever</span>
            <span>•</span>
            <span>Zero Malware</span>
          </div>
        </div>

        {/* Quick SEO Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-[#212932] text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Popular Tools</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#download-input" className="hover:text-purple-600 transition">TikTok Downloader</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Pinterest Video Downloader</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Facebook Reels Downloader</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Instagram Reels Saver</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Audio Formats</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#download-input" className="hover:text-purple-600 transition">YouTube to MP3 (320kbps)</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">TikTok Sound Extractor</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Extract Audio from Video</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Lossless MP4 to MP3</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Video Quality</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#download-input" className="hover:text-purple-600 transition">Full HD 1080p MP4</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Standard 720p MP4</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">9:16 Portrait Reels</a></li>
              <li><a href="#download-input" className="hover:text-purple-600 transition">Original Platform Bitrate</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Company &amp; Legal</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#faq" className="hover:text-purple-600 transition">Privacy Standards</a></li>
              <li><a href="#faq" className="hover:text-purple-600 transition">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-purple-600 transition">Fair Use Policy</a></li>
              <li><a href="#faq" className="hover:text-purple-600 transition">API Documentation</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} Playzy. All rights reserved. Not affiliated with TikTok, Pinterest, Facebook, or YouTube.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>for high-speed media archiving</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
