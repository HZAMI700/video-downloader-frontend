'use client';

import React from 'react';
import { Download, CheckCircle, AlertTriangle, RefreshCw, FileVideo, HardDrive, Gauge, Clock, Loader2 } from 'lucide-react';
import { DownloadJob } from '../lib/types';
import { buildFileDownloadUrl } from '../lib/api';

interface DownloadJobProgressProps {
  job: DownloadJob;
  onReset: () => void;
  onRetry: () => void;
}

export const DownloadJobProgress: React.FC<DownloadJobProgressProps> = ({
  job,
  onReset,
  onRetry,
}) => {
  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatSpeed = (bytesPerSec?: number) => {
    if (!bytesPerSec || bytesPerSec <= 0) return null;
    return `${formatBytes(bytesPerSec)}/s`;
  };

  const formatEta = (seconds?: number) => {
    if (seconds === undefined || seconds === null || seconds < 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const downloadFileUrl = buildFileDownloadUrl(job.job_id);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 md:p-8 bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
      {/* PROCESSING OR QUEUED STATE */}
      {(job.status === 'queued' || job.status === 'processing') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {job.status === 'queued'
                    ? 'Queued in Server Queue...'
                    : job.progress_percent >= 99
                    ? 'Muxing & Finalizing Media...'
                    : 'Downloading Media Content...'}
                </h3>
                <p className="text-xs text-slate-400">
                  {job.status === 'queued'
                    ? 'Waiting for available download worker'
                    : job.progress_percent >= 99
                    ? 'Combining video and audio streams into single file'
                    : 'Streaming directly from source platform to server'}
                </p>
              </div>
            </div>
            <span className="text-xl font-extrabold text-indigo-400 font-mono">
              {job.progress_percent.toFixed(0)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 relative"
                style={{ width: `${Math.max(5, job.progress_percent)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>

            {/* Diagnostic Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {formatBytes(job.downloaded_bytes)}
                  {job.total_bytes ? ` / ${formatBytes(job.total_bytes)}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <Gauge className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatSpeed(job.speed_bytes_sec) || 'Calculating...'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>ETA: {formatEta(job.eta_seconds) || 'Measuring...'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED SUCCESS STATE */}
      {job.status === 'completed' && (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">Media Ready for Download!</h3>
            <p className="text-xs text-slate-400">
              Your file was processed and packaged successfully on the backend.
            </p>
          </div>

          {/* File details card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                <FileVideo className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">
                  {job.filename || 'downloaded_media'}
                </p>
                <p className="text-xs text-slate-400">
                  {formatBytes(job.file_size)} • {job.content_type || 'Media File'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={downloadFileUrl}
              download={job.filename || 'media_download'}
              className="w-full sm:flex-1 py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Save File to Device</span>
            </a>

            <button
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            >
              Download Another
            </button>
          </div>
        </div>
      )}

      {/* FAILED ERROR STATE */}
      {job.status === 'failed' && (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-lg shadow-red-500/10">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">Download Processing Failed</h3>
            <p className="text-xs text-red-300 max-w-md mx-auto">
              {job.error_message || 'An unexpected error occurred during processing.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onRetry}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Download</span>
            </button>
            <button
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            >
              New Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
