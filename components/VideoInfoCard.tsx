'use client';

import React, { useState } from 'react';
import { Download, Music, Video, Clock, Eye, User, Check, ExternalLink, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { MediaMetadata, FormatOption } from '../lib/types';

interface VideoInfoCardProps {
  metadata: MediaMetadata;
  onSelectDownload: (formatId: string) => void;
  onReset: () => void;
  isStartingDownload: boolean;
}

export const VideoInfoCard: React.FC<VideoInfoCardProps> = ({
  metadata,
  onSelectDownload,
  onReset,
  isStartingDownload,
}) => {
  const videoFormats = metadata.formats.filter((f) => f.type === 'video');
  const audioFormats = metadata.formats.filter((f) => f.type === 'audio');

  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [selectedFormatId, setSelectedFormatId] = useState<string>(() => {
    // Prefer 720p or 1080p if available, else first available
    const preferred = videoFormats.find((f) => f.resolution === '720p' && f.available)
      || videoFormats.find((f) => f.resolution === '1080p' && f.available)
      || videoFormats.find((f) => f.available)
      || metadata.formats[0]?.format_id
      || 'best_video';
    return typeof preferred === 'string' ? preferred : preferred.format_id;
  });

  const displayedFormats = activeTab === 'video' ? videoFormats : audioFormats;

  const handleStart = () => {
    onSelectDownload(selectedFormatId);
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return null;
    const mb = bytes / (1024 * 1024);
    return `~${mb.toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 md:p-8 bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Thumbnail Column */}
        <div className="md:col-span-5 relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-lg">
          {metadata.thumbnail ? (
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to placeholder if thumbnail load fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500">
              <Video className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-xs">Preview unavailable</span>
            </div>
          )}

          {/* Duration Badge */}
          {metadata.duration_formatted && (
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-md">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{metadata.duration_formatted}</span>
            </div>
          )}

          {/* Platform Tag */}
          <div className="absolute top-3 left-3">
            <span className="bg-indigo-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1">
              {metadata.platform}
            </span>
          </div>
        </div>

        {/* Video Info & Controls Column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2">
              {metadata.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-300 font-medium">{metadata.uploader || 'Creator'}</span>
              </div>
              {metadata.view_count !== undefined && metadata.view_count !== null && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{Number(metadata.view_count).toLocaleString()} views</span>
                </div>
              )}
              <a
                href={metadata.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Format Tabs (Video vs Audio) */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('video');
                  const firstVideo = videoFormats.find((f) => f.available) || videoFormats[0];
                  if (firstVideo) setSelectedFormatId(firstVideo.format_id);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'video'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video (MP4)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('audio');
                  const firstAudio = audioFormats.find((f) => f.available) || audioFormats[0];
                  if (firstAudio) setSelectedFormatId(firstAudio.format_id);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'audio'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Audio Only (MP3 / M4A)</span>
              </button>
            </div>

            {/* Quality Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {displayedFormats.map((format) => {
                const isSelected = selectedFormatId === format.format_id;
                const sizeText = formatBytes(format.approx_size_bytes);

                return (
                  <button
                    key={format.format_id}
                    type="button"
                    disabled={!format.available}
                    onClick={() => setSelectedFormatId(format.format_id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      !format.available
                        ? 'opacity-40 bg-slate-950/30 border-slate-800 cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-white">{format.label}</span>
                        {sizeText && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {sizeText}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      {format.quality_note && (
                        <span className="text-[11px] text-slate-400">
                          {format.quality_note}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              onClick={handleStart}
              disabled={isStartingDownload}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStartingDownload ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Download Job...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Selected Format</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              disabled={isStartingDownload}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
