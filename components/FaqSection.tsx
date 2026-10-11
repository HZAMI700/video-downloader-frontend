'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Which video platforms are supported?',
    a: 'GrabVid supports YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, Reddit, and 100+ other web media sites using our high-performance Python FastAPI and yt-dlp backend.',
  },
  {
    q: 'How does the Vercel + Botkeep architecture work?',
    a: 'The frontend website is hosted globally on Vercel’s high-speed Edge CDN. The media processing backend runs on Botkeep Cloud powered by Python FastAPI and yt-dlp. Your browser communicates securely with the Botkeep API for extraction and file delivery.',
  },
  {
    q: 'What quality options are available?',
    a: 'We offer MP4 1080p Full HD, MP4 720p HD, and crystal clear MP3 320kbps audio. FFmpeg is active on the server to merge high-resolution video and audio streams seamlessly.',
  },
  {
    q: 'Are downloaded media files stored permanently?',
    a: 'No. We adhere to strict privacy and resource management standards. Active files are stored in a sandboxed temporary directory and automatically deleted after 15 minutes or upon manual cleanup.',
  },
  {
    q: 'What is the maximum file size limit?',
    a: 'By default, downloads are bounded to 500 MB to prevent resource exhaustion and ensure high-speed processing for all users.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="how-it-works" className="w-full max-w-4xl mx-auto py-8 px-2">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold border border-purple-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ &amp; How It Works</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-800 hover:text-purple-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                    isOpen ? 'rotate-180 text-purple-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
