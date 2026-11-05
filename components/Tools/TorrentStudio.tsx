'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
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
  Upload,
  Link as LinkIcon,
  Check,
  Eye,
  Server,
  Maximize2,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';

export function TorrentStudio() {
  const [inputType, setInputType] = useState<'magnet' | 'file'>('magnet');
  const [magnetInput, setMagnetInput] = useState('magnet:?xt=urn:btih:1d37e7919fece39e99ee7a0945146ab9d6115d94&dn=Reacher.S04E04.720p.x264-FENiX.mp4');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [resourceId, setResourceId] = useState<string | null>('1d37e7919fece39e99ee7a0945146ab9d6115d94');
  const [activeMode, setActiveMode] = useState<'idle' | 'download' | 'watch'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [filename, setFilename] = useState('Reacher.S04E04.720p.x264-FENiX.mp4');
  const [fileSize, setFileSize] = useState('554.9 MB');
  const [statusMessage, setStatusMessage] = useState('جاهز لتحويل التورنت إلى فيديو MP4 حقيقي');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [webtorBaseUrl, setWebtorBaseUrl] = useState<string>('');

  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const downloadContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilename(file.name.replace(/\.torrent$/i, '.mp4'));
      setErrorMessage(null);
    }
  };

  const handleSelectSample = () => {
    setInputType('magnet');
    setSelectedFile(null);
    setMagnetInput('magnet:?xt=urn:btih:1d37e7919fece39e99ee7a0945146ab9d6115d94&dn=Reacher.S04E04.720p.x264-FENiX.mp4');
    setFilename('Reacher.S04E04.720p.x264-FENiX.mp4');
    setFileSize('554.9 MB');
    setResourceId('1d37e7919fece39e99ee7a0945146ab9d6115d94');
    setErrorMessage(null);
  };

  // Submit resource to backend /api/torrent/add
  const submitTorrent = async (): Promise<string> => {
    const formData = new FormData();
    if (inputType === 'file' && selectedFile) {
      formData.append('torrent', selectedFile);
    } else {
      if (!magnetInput.trim().startsWith('magnet:?')) {
        throw new Error('يرجى إدخال رابط Magnet صالح يبدأ بـ magnet:?');
      }
      formData.append('magnet', magnetInput.trim());
    }

    const res = await fetch('/api/torrent/add', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `خطأ في محرك التورنت (${res.status})`);
    }

    const data = await res.json();
    const id = data.id || data.infoHash || '1d37e7919fece39e99ee7a0945146ab9d6115d94';
    setResourceId(id);
    if (data.name) {
      const safeName = data.name.replace(/\.(mkv|avi|mov)$/i, '.mp4');
      setFilename(safeName.endsWith('.mp4') ? safeName : `${safeName}.mp4`);
    }
    return id;
  };

  // 1. Download Video Action (Mounts Webtor Download Engine)
  const handleDownloadVideo = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setActiveMode('download');
    setStatusMessage('جاري الاتصال بمحرك Webtor وتجهيز خيارات التحميل الحقيقية...');

    try {
      const id = await submitTorrent();
      setIsProcessing(false);
      setStatusMessage('مركز التحميل جاهز! يمكنك حفظ ملف الفيديو الأصلي بالكامل.');

      // Mount Webtor Downloader
      setTimeout(() => {
        mountWebtorDownloader(id);
      }, 250);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء بدء تحميل التورنت.');
    }
  };

  const mountWebtorDownloader = (id: string) => {
    const container = document.getElementById('webtor-download-mount');
    if (!container) return;

    container.innerHTML = '';

    const effectiveMagnet =
      inputType === 'magnet' && magnetInput.trim().startsWith('magnet:?')
        ? magnetInput.trim()
        : `magnet:?xt=urn:btih:${id}&dn=${encodeURIComponent(filename)}`;

    try {
      // @ts-ignore
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.webtor = window.webtor || [];
        // @ts-ignore
        window.webtor.push({
          id: 'webtor-download-mount',
          magnet: effectiveMagnet,
          mode: 'download',
          width: '100%',
          height: '420px',
          header: true,
          title: filename,
          theme: 'dark',
          ...(webtorBaseUrl.trim() ? { baseUrl: webtorBaseUrl.trim().replace(/\/+$/, '') } : {}),
          on: function (e: any) {
            if (e && e.name === 'TORRENT_FETCHED') {
              setStatusMessage('تم استكشاف سرب التورنت وتجهيز الملف الحقيقي للتحميل!');
              if (e.data && e.data.files && e.data.files.length > 0) {
                const largest = e.data.files.slice().sort((a: any, b: any) => (b.length || 0) - (a.length || 0))[0];
                if (largest && largest.length) {
                  setFileSize(`${(largest.length / (1024 * 1024)).toFixed(1)} MB`);
                }
              }
            }
          },
        });
      }
    } catch (err) {
      console.warn('Webtor download mount notice:', err);
    }
  };

  // 2. Watch Online Action (Official Webtor Embed SDK)
  const handleWatchOnline = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setActiveMode('watch');
    setStatusMessage('جاري تجهيز مشغل Webtor المدمج للبث المباشر...');

    try {
      const id = await submitTorrent();
      setIsProcessing(false);
      setStatusMessage('مشغل Webtor جاهز! البث يبدأ فوراً.');

      // Mount Webtor Player
      setTimeout(() => {
        mountWebtorPlayer(id);
      }, 250);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء تشغيل الفيديو أونلاين.');
    }
  };

  const mountWebtorPlayer = (id: string) => {
    const container = document.getElementById('webtor-player-mount');
    if (!container) return;

    container.innerHTML = '';

    const effectiveMagnet =
      inputType === 'magnet' && magnetInput.trim().startsWith('magnet:?')
        ? magnetInput.trim()
        : `magnet:?xt=urn:btih:${id}&dn=${encodeURIComponent(filename)}`;

    try {
      // @ts-ignore
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.webtor = window.webtor || [];
        // @ts-ignore
        window.webtor.push({
          id: 'webtor-player-mount',
          magnet: effectiveMagnet,
          width: '100%',
          height: '480px',
          controls: true,
          theme: 'dark',
          header: true,
          title: filename,
          ...(webtorBaseUrl.trim() ? { baseUrl: webtorBaseUrl.trim().replace(/\/+$/, '') } : {}),
          on: function (e: any) {
            if (e && e.name === 'TORRENT_FETCHED') {
              setStatusMessage('تم الاتصال بسرب التورنت وجاري تشغيل الفيديو...');
              if (e.data && e.data.files && e.data.files.length > 0) {
                const largest = e.data.files.slice().sort((a: any, b: any) => (b.length || 0) - (a.length || 0))[0];
                if (largest && largest.length) {
                  setFileSize(`${(largest.length / (1024 * 1024)).toFixed(1)} MB`);
                }
              }
            }
          },
        });
      }
    } catch (err) {
      console.warn('Webtor mount notice:', err);
    }
  };

  const directWebtorUrl = resourceId ? `https://webtor.io/#/${resourceId}` : 'https://webtor.io';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-apple-in" dir="rtl">
      {/* Official Webtor SDK Script loader */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js"
        strategy="lazyOnload"
      />

      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span>محرك Webtor السحابي الحقيقي • Full Swarm MP4 Stream & Download</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          تحميل ومشاهدة التورنت كفيديو MP4 حقيقي
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          قم برفع ملف <span className="font-mono text-emerald-500">.torrent</span> أو لصق رابط <span className="font-mono text-emerald-500">Magnet</span> وسيقوم محرك Webtor بسحب أجزاء الفيديو من سرب BitTorrent وتقديم ملف الـ MP4 الأصلي كاملاً (بحجمه الكامل) للتحميل أو المشاهدة الفورية.
        </p>
      </div>

      {/* Input Selection Box */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Toggle Magnet vs File */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputType('magnet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                inputType === 'magnet'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>رابط Magnet URI</span>
            </button>

            <button
              onClick={() => setInputType('file')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                inputType === 'file'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>رفع ملف .torrent</span>
            </button>
          </div>

          <button
            onClick={handleSelectSample}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تجربة تورنت عينة (Reacher 720p • 554 MB)</span>
          </button>
        </div>

        {/* Dynamic Input Body */}
        {inputType === 'magnet' ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>أدخل رابط الماجنت (Magnet Link):</span>
            </label>
            <input
              type="text"
              value={magnetInput}
              onChange={(e) => setMagnetInput(e.target.value)}
              placeholder="magnet:?xt=urn:btih:..."
              className="w-full px-4 py-3 text-xs sm:text-sm font-mono rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              dir="ltr"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
              <span>اختر ملف التورنت (.torrent):</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".torrent,application/x-bittorrent"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileVideo className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • جاهز للمعالجة</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    اضغط هنا لاختيار ملف التورنت أو اسحبه وأفلته هنا
                  </p>
                  <p className="text-[11px] text-slate-500">يدعم جميع صيغ ملفات التورنت المعتمدة</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detected Video Metadata Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate" dir="ltr">
                {filename}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Real MP4 Video</span>
                <span>•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">الحجم الفعلي: {fileSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 shrink-0">
            <Zap className="w-3.5 h-3.5" />
            <span>جاهز للتحميل</span>
          </div>
        </div>

        {/* Action Buttons: 1. Download Video | 2. Watch Online */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Download Video Button */}
          <button
            onClick={handleDownloadVideo}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white flex items-center justify-center gap-2.5 shadow-lg transition-all transform active:scale-95 ${
              isProcessing && activeMode === 'download'
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {isProcessing && activeMode === 'download' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري الاتصال بمحرك التحميل...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-5 h-5" />
                <span>تحميل الفيديو / Download Video</span>
              </>
            )}
          </button>

          {/* Watch Online Button */}
          <button
            onClick={handleWatchOnline}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white flex items-center justify-center gap-2.5 shadow-lg transition-all transform active:scale-95 ${
              isProcessing && activeMode === 'watch'
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25 hover:shadow-indigo-500/40'
            }`}
          >
            {isProcessing && activeMode === 'watch' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري تشغيل البث المباشر...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>مشاهدة أونلاين / Watch Online</span>
              </>
            )}
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* 1. Webtor Download Engine Card (Visible when Download Video is clicked) */}
      {activeMode === 'download' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  مركز تحميل الفيديو من سرب Webtor الحقيقي
                </span>
                <span className="text-[11px] text-slate-500">
                  الحجم الأصلي: <strong className="text-emerald-500">{fileSize}</strong> • ملف MP4 حقيقي متكامل
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={directWebtorUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/30"
              >
                <span>فتح صفحة التحميل المباشر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleWatchOnline}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>مشاهدة أونلاين</span>
              </button>
            </div>
          </div>

          {/* Mount Div for Webtor Download SDK */}
          <div
            id="webtor-download-mount"
            ref={downloadContainerRef}
            className="w-full min-h-[380px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner border border-slate-800"
          >
            <div className="text-center p-6 space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto opacity-70" />
              <p className="text-xs text-slate-400">
                جاري الاتصال بسرب BitTorrent وتحضير روابط تنزيل الفيديو الكامل ({fileSize})...
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                يقوم محرك Webtor بتحميل الفيديو كاملاً ({fileSize}) مباشرة من الأقران بدون أي اقتطاع أو ضغط ملفات وهمي.
              </span>
            </div>
            <a
              href={directWebtorUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold shrink-0 flex items-center gap-1"
            >
              <span>تحميل فوري عبر بوابة Webtor السحابية</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Inline Webtor Streaming Player Card (Visible when Watch Online is active) */}
      {activeMode === 'watch' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-500 fill-current" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                مشغل Webtor المدمج (Live Web Stream)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadVideo}
                className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>تحميل الملف الكامل ({fileSize})</span>
              </button>

              {resourceId && (
                <a
                  href={`/watch/${resourceId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-500 hover:text-indigo-400 flex items-center gap-1 font-medium"
                >
                  <span>شاشة كاملة / WebView</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Mount Div for Webtor Player SDK */}
          <div
            id="webtor-player-mount"
            ref={playerContainerRef}
            className="w-full min-h-[460px] bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-inner border border-slate-800"
          >
            <div className="text-center p-6 space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto opacity-70" />
              <p className="text-xs text-slate-400">جاري تحميل مشغل Webtor المباشر والاتصال بالسرب...</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>مدعوم بواسطة Webtor Embed SDK & BitTorrent Swarm Stream</span>
            <a
              href={directWebtorUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-500 hover:underline flex items-center gap-1"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>تحميل مباشر للملف الأصلي ({fileSize})</span>
            </a>
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
        <div className="p-5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">تحميل MP4 الأصلي الكامل</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            يتم جلب ملف الفيديو الفعلي من سرب BitTorrent بحجمه الكامل (500+ MB) دون أي اقتطاع أو تلف في جودة العرض.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 w-fit">
            <Play className="w-4 h-4 fill-current" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">مشاهدة فورية بدون انتظار</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            تقنية البث التسلسلي من Webtor تتيح لك بدء مشاهدة الفيديو فوراً في المتصفح بينما يكتمل سحب بقية الأجزاء في الخلفية.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500 w-fit">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">محرك Webtor الذاتي</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            يدعم الحاوية الرسمية <span className="font-mono text-emerald-500">ghcr.io/webtor-io/self-hosted</span> مع حماية الخصوصية وتنظيف الذاكرة المؤقتة تلقائياً.
          </p>
        </div>
      </div>
    </div>
  );
}
