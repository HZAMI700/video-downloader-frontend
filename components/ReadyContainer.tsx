'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, CheckCircle, RefreshCw, Smartphone, Monitor, Play } from 'lucide-react';
import { MediaMetadata, DownloadJob } from '../lib/types';
import { buildFileDownloadUrl } from '../lib/api';
import { EmbeddedPlayer } from './EmbeddedPlayer';

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
  // Demo data matching original screenshot if user hasn't analyzed a video yet
  const defaultThumbnail = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop';
  const defaultTitle = 'Amazing Japan Travel Guide 2026';

  const isReal = !!metadata;
  const title = metadata?.title || defaultTitle;
  const thumbnail = metadata?.thumbnail || defaultThumbnail;
  // Real duration only — never invent fake duration when real media is present
  const duration = isReal ? metadata.duration_formatted : '12:34';

  // Detect 9:16 vertical portrait format (Instagram Reels, TikTok, YouTube Shorts, Pinterest Video Pins)
  const [isVertical, setIsVertical] = useState<boolean>(() => {
    if (!metadata) return false;
    const p = (metadata.platform || '').toLowerCase();
    const url = (metadata.original_url || '').toLowerCase();
    return (
      p.includes('instagram') ||
      p.includes('tiktok') ||
      p.includes('pinterest') ||
      url.includes('/reel') ||
      url.includes('/shorts') ||
      url.includes('tiktok.com') ||
      url.includes('pin.it') ||
      url.includes('pinterest.')
    );
  });

  useEffect(() => {
    if (!metadata) {
      setIsVertical(false);
      return;
    }
    const p = (metadata.platform || '').toLowerCase();
    const url = (metadata.original_url || '').toLowerCase();
    const verticalUrl = (
      p.includes('instagram') ||
      p.includes('tiktok') ||
      p.includes('pinterest') ||
      url.includes('/reel') ||
      url.includes('/shorts') ||
      url.includes('tiktok.com') ||
      url.includes('pin.it') ||
      url.includes('pinterest.')
    );
    setIsVertical(verticalUrl);
    setIsPlayingStream(false);
  }, [metadata]);

  const [isPlayingStream, setIsPlayingStream] = useState<boolean>(false);

  // Handle image load to check natural aspect ratio
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth * 1.05) {
      setIsVertical(true);
    }
  };

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
    if (!bytes || bytes <= 0) return 'HD Quality';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${Math.round(mb)} MB`;
  };

  const cleanLabel = (label: string) => {
    if (label.toLowerCase().includes('best video quality')) {
      return 'MP4 (Original Quality)';
    }
    return label;
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-2 space-y-3"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header text */}
      <div className="text-left px-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white tracking-tight">
            Downloaded/Ready{' '}
            <span className="font-normal text-slate-400">
              {isReal ? '— Media processed & ready to save' : '— Container to show how the UX works'}
            </span>
          </p>

          {isReal && isVertical && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#181D24] text-[#00c9a7] border border-[#00c9a7]/30">
              <Smartphone className="w-3 h-3" />
              <span>9:16 Vertical Reel</span>
            </span>
          )}
        </div>

        {isReal && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-[#00c9a7] hover:underline"
          >
            Clear / New Search
          </button>
        )}
      </div>

      {/* Main Container Card */}
      <div className="bg-[#181D24] rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-xl border border-[#263241] flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-300">
        
        {/* Left Column: Video Thumbnail Preview or Embedded Stream Player */}
        <div className={`shrink-0 ${isVertical ? 'w-full sm:w-auto flex justify-center' : 'w-full md:w-[45%]'}`}>
          <div
            className={`relative rounded-2xl overflow-hidden bg-slate-950 shadow-md group transition-all duration-300 ${
              isVertical
                ? 'w-[190px] sm:w-[210px] md:w-[220px] aspect-[9/16] max-h-[380px]'
                : 'w-full aspect-video'
            }`}
          >
            {isPlayingStream ? (
              <EmbeddedPlayer
                metadata={metadata}
                isVertical={isVertical}
                onClose={() => setIsPlayingStream(false)}
              />
            ) : (
              <>
                <img
                  src={thumbnail}
                  alt={title}
                  onLoad={handleImageLoad}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Center Play Button Overlay */}
                <button
                  type="button"
                  onClick={() => setIsPlayingStream(true)}
                  className="absolute inset-0 m-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 hover:bg-white text-slate-950 shadow-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 active:scale-95 transition-all duration-200 z-10"
                  title="Play embedded stream"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5 text-[#00A9C0]" />
                </button>

                {/* Dark gradient overlay for title legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5 sm:p-4 pointer-events-none">
                  <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md">
                    {title}
                  </h3>
                </div>

                {/* Duration pill in bottom right (only if real duration exists) */}
                {duration && (
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-white shadow pointer-events-none">
                    {duration}
                  </div>
                )}

                {/* Platform Tag */}
                {metadata?.platform && (
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
                    {metadata.platform}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Format Download Rows */}
        <div className="flex-1 w-full flex flex-col justify-center space-y-4">
          {formats.slice(0, 4).map((f) => {
            const isThisRowActive = activeJob && activeJob.format_id === f.format_id;
            const isCompleted = isThisRowActive && activeJob.status === 'completed';
            const isProcessing = isThisRowActive && (activeJob.status === 'processing' || activeJob.status === 'queued');
            const isFailed = isThisRowActive && activeJob.status === 'failed';

            return (
              <div
                key={f.format_id}
                className="flex items-center justify-between py-2 border-b border-[#263241] last:border-none"
              >
                {/* Format label & File size */}
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-bold text-slate-100">
                    {cleanLabel(f.label)}
                  </span>
                  <span className="text-slate-500 font-bold">•</span>
                  <span className="text-slate-400 font-medium text-xs sm:text-sm">
                    {formatSize(f.approx_size_bytes)}
                  </span>
                </div>

                {/* Right Action Button */}
                <div>
                  {isCompleted ? (
                    <motion.a
                      href={buildFileDownloadUrl(activeJob.job_id)}
                      download
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 sm:px-6 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-[#00A9C0] to-[#00c9a7] hover:from-[#00c9a7] hover:to-[#29CC5F] shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Save File</span>
                    </motion.a>
                  ) : isProcessing ? (
                    <button
                      disabled
                      className="px-5 sm:px-6 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#00c9a7] opacity-90 flex items-center gap-2 cursor-wait"
                    >
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{activeJob.progress_percent > 0 ? `${activeJob.progress_percent.toFixed(0)}%` : 'Queued...'}</span>
                    </button>
                  ) : isFailed ? (
                    <motion.button
                      onClick={() => onDownloadFormat(f.format_id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-1 shadow-md"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => onDownloadFormat(f.format_id)}
                      disabled={isStartingJob}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 sm:px-7 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-[#00A9C0] to-[#00c9a7] hover:from-[#00c9a7] hover:to-[#29CC5F] shadow-md transition-all disabled:opacity-50"
                    >
                      Download
                    </motion.button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Job Progress indicator if currently working */}
          {activeJob && (activeJob.status === 'processing' || activeJob.status === 'queued') && (
            <div className="pt-2">
              <div className="w-full h-2.5 bg-[#12171F] rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00A9C0] to-[#00c9a7] rounded-full"
                  initial={{ width: '5%' }}
                  animate={{ width: `${Math.max(5, activeJob.progress_percent)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex justify-between">
                <span>Processing and preparing your download...</span>
                <span className="font-semibold text-[#00c9a7]">{activeJob.progress_percent.toFixed(0)}%</span>
              </p>
            </div>
          )}

          {activeJob && activeJob.status === 'failed' && (
            <p className="text-xs text-rose-400 font-medium">
              {activeJob.error_message || 'Download failed. Please try a different quality.'}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
