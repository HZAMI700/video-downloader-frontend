'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does the Vercel + Botkeep architecture work?',
    a: 'The frontend website is hosted globally on Vercel’s high-speed Edge CDN. The media processing backend runs on Botkeep Cloud powered by Python FastAPI and yt-dlp. Vercel never runs heavy Python or FFmpeg processes; your browser connects directly to the Botkeep API for extraction and file delivery.',
  },
  {
    q: 'What happens if FFmpeg is not installed on the server?',
    a: 'VidStream Pro includes dynamic runtime FFmpeg detection. If FFmpeg is absent, the backend safely continues serving direct pre-merged video formats (e.g. 720p/360p) and native audio streams (M4A/WebM) without throwing server errors or crashing.',
  },
  {
    q: 'Are downloaded media files stored permanently?',
    a: 'No. The backend adheres to strict privacy and resource management standards. Active files are stored in a sandboxed temporary directory and automatically deleted after 15 minutes (configurable via DOWNLOAD_TTL_SECONDS) or upon manual cleanup.',
  },
  {
    q: 'Can I download private or paywalled videos?',
    a: 'No. The system strictly complies with platform security policies, paywalls, and DRM restrictions. Only public, technically accessible media is supported.',
  },
  {
    q: 'What is the maximum file size limit?',
    a: 'By default, downloads are bounded to 500 MB to prevent resource exhaustion and ensure stable multi-user hosting. This limit can be adjusted in the backend configuration.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Architecture & FAQ</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm md:text-base font-semibold text-white hover:text-indigo-400 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
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
