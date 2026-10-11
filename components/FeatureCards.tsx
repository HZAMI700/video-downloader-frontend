'use client';

import React from 'react';
import { Zap, Wand2, Shield } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Ultra Fast Speed */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100/80 flex items-center justify-center text-purple-600 shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              Ultra Fast Speed
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Unlimited bandwidth for instant downloads.
            </p>
          </div>
        </div>

        {/* Card 2: No Watermarks */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-100/80 flex items-center justify-center text-pink-600 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              No Watermarks
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Save videos in their original quality.
            </p>
          </div>
        </div>

        {/* Card 3: Safe & Secure */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-100/80 flex items-center justify-center text-cyan-600 shrink-0">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              Safe &amp; Secure
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Zero ads, malware, or trackers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
