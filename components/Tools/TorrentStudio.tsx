'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  DownloadCloud,
  FileVideo,
  Play,
  CheckCircle2,
  AlertCircle,
  Radio,
  Zap,
  HardDrive,
  Users,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Film,
} from 'lucide-react';

interface TorrentInfo {
  name: string;
  sizeFormatted: string;
}

export function TorrentStudio() {
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('0 KB/s');
  const [peers, setPeers] = useState(0);
  const [downloaded, setDownloaded] = useState('0 B');
  const [total, setTotal] = useState('~528 MB');
  const [eta, setEta] = useState<number | null>(null);
  const [filename, setFilename] = useState('Reacher.S04E04.720p.x264-FENiX.mp4');
  const [statusText, setStatusText] = useState('جاهز للتحميل عبر محرك التورنت السحابي');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleStartDownload = async () => {
    setErrorMessage(null);
    setIsStarting(true);
    setStatusText('جاري الاتصال بمحرك التورنت وفحص ملف الفيديو...');

    try {
      const res = await fetch('/api/download/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `خطأ في الخادم (${res.status})`);
      }

      const data = await res.json();
      const id = data.downloadId || data.infoHash;
      if (!id) throw new Error('لم يتم استلام معرف التحميل من السيرفر');

      setDownloadId(id);
      if (data.filename) setFilename(data.filename.replace(/\.(mkv|avi|mov)$/i, '.mp4'));
      setIsStarting(false);
      setIsDownloading(true);

      // Start polling
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => checkProgress(id), 1000);
      checkProgress(id);
    } catch (err: any) {
      setIsStarting(false);
      setIsDownloading(false);
      setErrorMessage(err.message || 'فشل بدء التنزيل. تأكد من تشغيل السيرفر.');
    }
  };

  const checkProgress = async (id: string) => {
    try {
      const res = await fetch(`/api/download/progress/${id}`);
      if (!res.ok) return;

      const data = await res.json();
      const currentProgress = Math.min(100, Math.max(0, data.progress || 0));

      setProgress(currentProgress);
      setSpeed(data.speedFormatted || '0 KB/s');
      setPeers(data.peers || 0);
      setDownloaded(data.downloadedFormatted || '0 B');
      setTotal(data.totalFormatted || '~528 MB');
      setEta(data.eta || null);

      if (data.filename) {
        setFilename(data.filename.replace(/\.(mkv|avi|mov)$/i, '.mp4'));
      }

      if (data.status === 'converting') {
        setStatusText('جاري تحويل وتجهيز حاوية MP4 المتوافقة مع جميع المشغلات...');
      } else if (data.peers === 0 && !data.done) {
        setStatusText('جاري استكشاف الأقران النشطين في شبكة التورنت (Swarm)...');
      } else if (data.done || currentProgress >= 100) {
        setStatusText('اكتمل التحميل بنجاح! يتم الآن حفظ ملف MP4...');
        setIsDownloading(false);
        setIsDone(true);
        if (pollRef.current) clearInterval(pollRef.current);

        // Auto trigger file download
        triggerFileDownload(id);
      } else {
        setStatusText(`جاري تنزيل قطع الفيديو من شبكة التورنت (${data.speedFormatted})...`);
      }
    } catch (err) {
      console.warn('Progress check notice:', err);
    }
  };

  const triggerFileDownload = (id: string) => {
    const fileUrl = `/api/download/file/${id}`;
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = fileUrl;
    anchor.setAttribute('download', filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-apple-in" dir="rtl">
      {/* Header Badge & Title */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>محرك التورنت السحابي المباشر • WebTorrent Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          تحويل التورنت إلى فيديو MP4 مباشر
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          يقوم السيرفر بالاتصال بشبكة التورنت وتنزيل ملف الفيديو الأكبر مباشرة، ثم إرساله إلى متصفحك كملف MP4 حقيقي جاهز للتشغيل بدون الحاجة لبرامج تورنت على جهازك.
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glowing Ambient Gradient */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Selected Target Torrent File Banner */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 mb-6">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Film className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" dir="ltr">
                {filename}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>الحجم المتوقع: {total}</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold">Real MP4 Stream</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Zap className="w-3.5 h-3.5" />
            <span>جاهز للتنزيل</span>
          </div>
        </div>

        {/* Action Button */}
        {!isDownloading && !isDone && (
          <button
            onClick={handleStartDownload}
            disabled={isStarting}
            className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 shadow-xl shadow-emerald-500/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isStarting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري الاتصال بالسيرفر وشبكة التورنت...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-6 h-6" />
                <span>تحميل الفيديو / Download Video</span>
              </>
            )}
          </button>
        )}

        {/* Progress & Live Telemetry Section */}
        {(isDownloading || isDone) && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-bold text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{statusText}</span>
              </div>
              <div className="font-mono text-lg font-black text-slate-900 dark:text-white">
                {progress}%
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 transition-all duration-300 relative shadow-lg shadow-emerald-500/30"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>سرعة التنزيل</span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                  {speed}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>الأقران النشطون</span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                  {peers} Peers
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>المنقضي / الإجمالي</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {downloaded} / {total}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>الوقت المتبقي</span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                  {eta !== null ? `${eta}s` : 'حساب...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Finished Box */}
        {isDone && downloadId && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>تم تنزيل وتجهيز ملف MP4 بنجاح!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              بدأ المتصفح تلقائياً بحفظ الفيديو في جهازك. إذا لم يبدأ التنزيل تلقائياً اضغط على الزر أدناه:
            </p>
            <a
              href={`/api/download/file/${downloadId}`}
              download={filename}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>حفظ ملف الفيديو MP4 الآن</span>
            </a>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* How it works info footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200">1. تنزيل سحابي كامل</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              يقوم الخادم بالتنزيل من الـ Swarm بدون استهلاك باقة الإنترنت الخاصة بك في التورنت.
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200">2. اختيار الفيديو الأكبر</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              يتم استبعاد الصور والملفات غير المهمة وتنزيل الفيديو المستهدف فقط بأقصى سرعة.
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200">3. تنسيق MP4 أصلي</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              تحصل على ملف MP4 حقيقي يدعم الاستئناف والتشغيل على جميع الهواتف والحواسيب.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
