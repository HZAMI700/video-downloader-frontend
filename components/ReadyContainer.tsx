'use client';

import React, { useState } from 'react';
import { Loader2, Download, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { MediaMetadata, DownloadJob } from '../lib/types';
import { buildFileDownloadUrl } from '../lib/api';

interface ReadyContainerProps {
  metadata?: MediaMetadata | null;
  activeJob?: DownloadJob | null;
  isStartingJob?: boolean;
  onDownloadFormat: (formatId: string) => void;
  onReset?: () => void;
}

export const ReadyContainer: React.FC<ReadyContainerProps> = ({
  metadata,
  activeJob,
  isStartingJob,
  onDownloadFormat,
  onReset,
}) => {
  // Demo data matching screenshot if user hasn't analyzed a video yet
  const defaultThumbnail = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop';
  const defaultTitle = 'Amazing Japan Travel Guide 2026';
  const defaultDuration = '12:34';

  const isReal = !!metadata;
  const title = metadata?.title || defaultTitle;
  const thumbnail = metadata?.thumbnail || defaultThumbnail;
  const duration = metadata?.duration_formatted || defaultDuration;

  // Formats to display
  const formats = metadata?.formats && metadata.formats.length > 0
    ? metadata.formats.filter((f) => f.available)
    : [
        {
          format_id: 'video_1080p',
          label: 'MP4 1080p',
          approx_size_bytes: 145 * 1024 * 1024,
          available: true,
        },
        {
          format_id: 'video_720p',
          label: 'MP4 720p',
          approx_size_bytes: 82 * 1024 * 1024,
          available: true,
        },
        {
          format_id: 'audio_mp3',
          label: 'MP3 (320kbps)',
          approx_size_bytes: 11 * 1024 * 1024,
          available: true,
        },
      ];

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '80 MB';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${Math.round(mb)} MB`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 space-y-3">
      {/* Header text exactly like screenshot: "Downloaded/Ready - Container to show how the UX works" */}
      <div className="text-left px-2 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900 tracking-tight">
          Downloaded/Ready{' '}
          <span className="font-normal text-slate-500">
            {isReal ? '— Media processed & ready to save' : '— Container to show how the UX works'}
          </span>
        </p>

        {isReal && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 underline"
          >
            Clear / New Search
          </button>
        )}
      </div>

      {/* Main Container Card matching screenshot */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-7 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Left Column: Video Thumbnail Preview */}
        <div className="w-full md:w-[45%] shrink-0">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Dark gradient overlay for title legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white font-extrabold text-base sm:text-lg leading-snug line-clamp-2 drop-shadow-md">
                {title}
              </h3>
            </div>

            {/* Duration pill in bottom right */}
            {duration && (
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-white shadow">
                {duration}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Format Download Rows matching screenshot */}
        <div className="w-full md:w-[55%] flex flex-col justify-center space-y-4">
          {formats.slice(0, 4).map((f) => {
            const isThisRowActive = activeJob && activeJob.format_id === f.format_id;
            const isCompleted = isThisRowActive && activeJob.status === 'completed';
            const isProcessing = isThisRowActive && (activeJob.status === 'processing' || activeJob.status === 'queued');
            const isFailed = isThisRowActive && activeJob.status === 'failed';

            return (
              <div
                key={f.format_id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none"
              >
                {/* Format label & File size */}
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-bold text-slate-900">
                    {f.label}
                  </span>
                  <span className="text-slate-400 font-bold">•</span>
                  <span className="text-slate-500 font-medium text-sm">
                    {formatSize(f.approx_size_bytes)}
                  </span>
                </div>

                {/* Right Action Button */}
                <div>
                  {isCompleted ? (
                    <a
                      href={buildFileDownloadUrl(activeJob.job_id)}
                      download
                      className="px-5 sm:px-6 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Save File</span>
                    </a>
                  ) : isProcessing ? (
                    <button
                      disabled
                      className="px-5 sm:px-6 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333EA] to-[#06B6D4] opacity-90 flex items-center gap-2 cursor-wait"
                    >
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{activeJob.progress_percent > 0 ? `${activeJob.progress_percent.toFixed(0)}%` : 'Queued...'}</span>
                    </button>
                  ) : isFailed ? (
                    <button
                      onClick={() => onDownloadFormat(f.format_id)}
                      className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 flex items-center gap-1 shadow-md"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onDownloadFormat(f.format_id)}
                      disabled={isStartingJob}
                      className="px-6 sm:px-7 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] hover:opacity-95 shadow-md shadow-purple-500/25 active:scale-95 transition-all disabled:opacity-50"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Job Progress indicator if currently working */}
          {activeJob && (activeJob.status === 'processing' || activeJob.status === 'queued') && (
            <div className="pt-2">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9333EA] via-[#6366F1] to-[#06B6D4] transition-all duration-300"
                  style={{ width: `${Math.max(5, activeJob.progress_percent)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>Downloading &amp; Muxing with FFmpeg...</span>
                <span className="font-semibold text-purple-600">{activeJob.progress_percent.toFixed(0)}%</span>
              </p>
            </div>
          )}

          {activeJob && activeJob.status === 'failed' && (
            <p className="text-xs text-red-600 font-medium">
              {activeJob.error_message || 'Download failed. Please try a different quality.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
