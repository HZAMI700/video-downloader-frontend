'use client';

import React from 'react';
import { Play, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-line bg-surface/85 py-12 px-4 mt-20 text-muted text-xs">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-on-accent">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-accent">
              Playzy
            </span>
            <span className="text-muted">•</span>
            <span className="font-medium text-muted">The Free Online Video Downloader</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-muted font-medium text-xs">
            <span className="flex items-center gap-1 text-fg">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-line text-muted">
          <div>
            <h4 className="font-medium text-fg mb-2">Popular Tools</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#download-input" className="hover:text-muted transition">TikTok Downloader</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Pinterest Video Downloader</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Facebook Reels Downloader</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Instagram Reels Saver</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-fg mb-2">Audio Formats</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#download-input" className="hover:text-muted transition">YouTube to MP3 (320kbps)</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">TikTok Sound Extractor</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Extract Audio from Video</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Lossless MP4 to MP3</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-fg mb-2">Video Quality</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#download-input" className="hover:text-muted transition">Full HD 1080p MP4</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Standard 720p MP4</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">9:16 Portrait Reels</a></li>
              <li><a href="#download-input" className="hover:text-muted transition">Original Platform Bitrate</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-fg mb-2">Company &amp; Legal</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#faq" className="hover:text-muted transition">Privacy Standards</a></li>
              <li><a href="#faq" className="hover:text-muted transition">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-muted transition">Fair Use Policy</a></li>
              <li><a href="#faq" className="hover:text-muted transition">API Documentation</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-muted text-xs">
          <p>© {new Date().getFullYear()} Playzy. All rights reserved. Not affiliated with TikTok, Pinterest, Facebook, or YouTube.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with</span>
            <Heart className="w-3 h-3 text-danger fill-current" />
            <span>for high-speed media archiving</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
