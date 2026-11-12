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
    <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 md:p-8 bg-surface/90 border border-line space-y-6 animate-enter">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Thumbnail Column */}
        <div className="md:col-span-5 relative group rounded-2xl overflow-hidden bg-bg border border-line aspect-video flex items-center justify-center">
          {metadata.thumbnail ? (
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="w-full h-full object-cover transition-transform duration-300"
              onError={(e) => {
                // Fallback to placeholder if thumbnail load fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted">
              <Video className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-xs">Preview unavailable</span>
            </div>
          )}

          {/* Duration Badge */}
          {metadata.duration_formatted && (
            <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted" />
              <span>{metadata.duration_formatted}</span>
            </div>
          )}

          {/* Platform Tag */}
          <div className="absolute top-3 left-3">
            <span className="bg-sunken text-fg px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
              {metadata.platform}
            </span>
          </div>
        </div>

        {/* Video Info & Controls Column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg md:text-xl font-medium text-fg leading-snug line-clamp-2">
              {metadata.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted" />
                <span className="text-fg font-medium">{metadata.uploader || 'Creator'}</span>
              </div>
              {metadata.view_count !== undefined && metadata.view_count !== null && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-muted" />
                  <span>{Number(metadata.view_count).toLocaleString()} views</span>
                </div>
              )}
              <a
                href={metadata.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted hover:text-muted transition"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Format Tabs (Video vs Audio) */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2 p-1 bg-bg/80 rounded-xl border border-line">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('video');
                  const firstVideo = videoFormats.find((f) => f.available) || videoFormats[0];
                  if (firstVideo) setSelectedFormatId(firstVideo.format_id);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition ${
                  activeTab === 'video'
                    ? 'bg-accent text-on-accent'
                    : 'text-muted hover:text-fg hover:bg-surface/60'
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
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition ${
                  activeTab === 'audio'
                    ? 'bg-accent text-on-accent'
                    : 'text-muted hover:text-fg hover:bg-surface/60'
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
                        ? 'opacity-40 bg-bg/30 border-line cursor-not-allowed'
                        : isSelected
                        ? 'bg-sunken border-line'
                        : 'bg-bg/40 border-line hover:border-line text-fg'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-fg">{format.label}</span>
                        {sizeText && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-surface text-muted">
                            {sizeText}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-muted" />}
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      {format.quality_note && (
                        <span className="text-xs text-muted">
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
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-medium text-sm text-on-accent bg-accent hover:bg-accent flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-medium text-fg bg-surface hover:bg-surface border border-line hover:text-fg transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
