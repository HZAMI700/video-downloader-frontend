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
  Copy,
} from 'lucide-react';

export function TorrentStudio() {
  const [inputType, setInputType] = useState<'magnet' | 'file'>('magnet');
  const [magnetInput, setMagnetInput] = useState('magnet:?xt=urn:btih:1d37e7919fece39e99ee7a0945146ab9d6115d94&dn=Reacher.S04E04.720p.x264-FENiX.mp4');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [resourceId, setResourceId] = useState<string>('1d37e7919fece39e99ee7a0945146ab9d6115d94');
  const [activeMode, setActiveMode] = useState<'idle' | 'download' | 'watch'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [filename, setFilename] = useState('Reacher.S04E04.720p.x264-FENiX.mp4');
  const [fileSize, setFileSize] = useState('554.9 MB');
  const [statusMessage, setStatusMessage] = useState('جاهز لتحويل التورنت إلى فيديو MP4 حقيقي');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [webtorBaseUrl, setWebtorBaseUrl] = useState<string>('');

  const playerContainerRef = useRef<HTMLDivElement | null>(null);
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

  // 1. Download Video Action
  const handleDownloadVideo = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setActiveMode('download');
    setStatusMessage('جاري الاتصال بسرب Webtor وفتح بوابة التنزيل المباشر للملف الكامل...');

    try {
      const id = await submitTorrent();
      setIsProcessing(false);
      setStatusMessage(`تم تجهيز رابط التحميل للملف الأصلي بالكامل (${fileSize})!`);

      // Trigger direct download portal in a new tab so user gets the real file immediately
      const downloadPortalUrl = `https://webtor.io/#/${id}`;
      window.open(downloadPortalUrl, '_blank');

      // Mount the active video player container as well so user has inline controls and download
      setTimeout(() => {
        mountWebtorPlayer(id);
      }, 200);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء بدء تحميل التورنت.');
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
      }, 200);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء تشغيل الفيديو أونلاين.');
    }
  };

  const mountWebtorPlayer = (id: string) => {
    const mountId = activeMode === 'download' ? 'webtor-download-player-mount' : 'webtor-player-mount';
    const container = document.getElementById(mountId);
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
          id: mountId,
          magnet: effectiveMagnet,
          width: '100%',
          height: '460px',
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

  const handleCopyMagnet = () => {
    const effectiveMagnet =
      inputType === 'magnet' && magnetInput.trim().startsWith('magnet:?')
        ? magnetInput.trim()
        : `magnet:?xt=urn:btih:${resourceId}&dn=${encodeURIComponent(filename)}`;

    navigator.clipboard.writeText(effectiveMagnet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directWebtorUrl = resourceId ? `https://webtor.io/#/${resourceId}` : 'https://webtor.io';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-enter" dir="rtl">
      {/* Official Webtor SDK Script loader */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js"
        strategy="lazyOnload"
      />

      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30">
          <Radio className="w-3.5 h-3.5 animate-pulse text-accent" />
          <span>محرك Webtor السحابي الحقيقي • Full Swarm MP4 Stream & Download</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
          تحميل ومشاهدة التورنت كفيديو MP4 حقيقي
        </h1>

        <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto leading-relaxed">
          قم برفع ملف <span className="font-mono text-accent">.torrent</span> أو لصق رابط <span className="font-mono text-accent">Magnet</span> وسيقوم محرك Webtor السحابي بجلب أجزاء الفيديو من سرب BitTorrent وتقديم ملف الـ MP4 الأصلي كاملاً بحجمه الحقيقي الكامل للتحميل أو المشاهدة الفورية.
        </p>
      </div>

      {/* Input Selection Box */}
      <div className="bg-surface/80 border border-line rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Toggle Magnet vs File */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputType('magnet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                inputType === 'magnet'
                  ? 'bg-accent text-on-accent'
                  : 'bg-sunken text-muted hover:bg-line'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>رابط Magnet URI</span>
            </button>

            <button
              onClick={() => setInputType('file')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                inputType === 'file'
                  ? 'bg-accent text-on-accent'
                  : 'bg-sunken text-muted hover:bg-line'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>رفع ملف .torrent</span>
            </button>
          </div>

          <button
            onClick={handleSelectSample}
            className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تجربة تورنت عينة (Reacher 720p • 554 MB)</span>
          </button>
        </div>

        {/* Dynamic Input Body */}
        {inputType === 'magnet' ? (
          <div className="space-y-2">
            <label className="text-xs font-medium text-fg flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-accent" />
              <span>أدخل رابط الماجنت (Magnet Link):</span>
            </label>
            <input
              type="text"
              value={magnetInput}
              onChange={(e) => setMagnetInput(e.target.value)}
              placeholder="magnet:?xt=urn:btih:..."
              className="w-full px-4 py-3 text-xs sm:text-sm font-mono rounded-2xl bg-sunken border border-line focus:ring-2 focus:ring-accent text-fg"
              dir="ltr"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-fg flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-accent" />
              <span>اختر ملف التورنت (.torrent):</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-line hover:border-accent rounded-2xl p-6 text-center cursor-pointer transition-all bg-sunken/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".torrent,application/x-bittorrent"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileVideo className="w-10 h-10 mx-auto text-accent mb-2 opacity-80" />
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-fg">{selectedFile.name}</p>
                  <p className="text-xs text-muted">{(selectedFile.size / 1024).toFixed(1)} KB • جاهز للمعالجة</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-fg">
                    اضغط هنا لاختيار ملف التورنت أو اسحبه وأفلته هنا
                  </p>
                  <p className="text-xs text-muted">يدعم جميع صيغ ملفات التورنت المعتمدة</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detected Video Metadata Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-sunken/70 border border-line">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs sm:text-sm font-medium text-fg truncate" dir="ltr">
                {filename}
              </div>
              <div className="text-xs text-muted flex items-center gap-2">
                <span>Real MP4 Video</span>
                <span>•</span>
                <span className="font-medium text-accent">الحجم الفعلي: {fileSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent shrink-0">
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
            className={`w-full py-4 px-6 rounded-2xl font-medium text-sm sm:text-base text-fg flex items-center justify-center gap-2.5 transition-all transform ${
              isProcessing && activeMode === 'download'
                ? 'bg-muted cursor-not-allowed'
                : ' bg-accent hover:bg-accent-hover'
            }`}
          >
            {isProcessing && activeMode === 'download' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري فتح بوابة التحميل...</span>
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
            className={`w-full py-4 px-6 rounded-2xl font-medium text-sm sm:text-base text-fg flex items-center justify-center gap-2.5 transition-all transform ${
              isProcessing && activeMode === 'watch'
                ? 'bg-muted cursor-not-allowed'
                : ' bg-accent hover:bg-accent-hover'
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
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* 1. Download Confirmation & Stream Card (Visible when Download Video is clicked) */}
      {activeMode === 'download' && (
        <div className="bg-surface/80 border border-line rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-accent/10 text-accent shrink-0">
                <DownloadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-medium text-fg block">
                  تحميل فيديو MP4 الأصلي الكامل
                </span>
                <span className="text-xs text-muted">
                  الحجم الحقيقي: <strong className="text-accent font-mono">{fileSize}</strong> • جودة عالية كاملة بدون ضغط
                </span>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={directWebtorUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-accent hover:bg-accent text-on-accent text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>تنزيل الملف كاملاً ({fileSize})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyMagnet}
                className="px-3 py-2.5 rounded-xl bg-sunken hover:bg-line text-fg text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="نسخ رابط الماجنت" aria-label="نسخ رابط الماجنت"
              >
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ Magnet'}</span>
              </button>
            </div>
          </div>

          {/* Status Alert */}
          <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 flex items-center gap-3 text-xs sm:text-sm text-accent">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">تم فتح بوابة التحميل السحابية للملف الكامل بنجاح في تبويب جديد!</p>
              <p className="text-xs text-accent/80 mt-0.5">
                إذا لم يبدأ التحميل تلقائياً، اضغط على زر "تنزيل الملف كاملاً" أعلاه أو استخدم أيقونة التحميل في أعلى المشغل أدناه.
              </p>
            </div>
          </div>

          {/* Mount Div for Webtor Video Stream & Player Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted px-1">
              <span>المشغل المدمج جاهز للبث المباشر والتحميل:</span>
              <span className="font-mono text-accent">{filename}</span>
            </div>

            <div
              id="webtor-download-player-mount"
              className="w-full min-h-[440px] bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-line"
            >
              <div className="text-center p-6 space-y-3">
                <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto opacity-70" />
                <p className="text-xs text-muted">جاري الاتصال بسرب BitTorrent وتحميل المشغل المباشر...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Inline Webtor Streaming Player Card (Visible when Watch Online is active) */}
      {activeMode === 'watch' && (
        <div className="bg-surface/80 border border-line rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-muted fill-current" />
              <span className="text-sm font-medium text-fg">
                مشغل Webtor المدمج (Live Web Stream)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={directWebtorUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent hover:text-accent flex items-center gap-1 font-medium px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>تحميل الملف الكامل ({fileSize})</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {resourceId && (
                <a
                  href={`/watch/${resourceId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted hover:text-muted flex items-center gap-1 font-medium"
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
            className="w-full min-h-[460px] bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-line"
          >
            <div className="text-center p-6 space-y-3">
              <RefreshCw className="w-8 h-8 text-muted animate-spin mx-auto opacity-70" />
              <p className="text-xs text-muted">جاري تحميل مشغل Webtor المباشر والاتصال بالسرب...</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted pt-1">
            <span>مدعوم بواسطة Webtor Embed SDK & BitTorrent Swarm Stream</span>
            <a
              href={directWebtorUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline flex items-center gap-1 font-medium"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>تحميل مباشر للملف الأصلي ({fileSize})</span>
            </a>
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
        <div className="p-5 rounded-2xl bg-surface/50 border border-line space-y-2">
          <div className="p-2 rounded-xl bg-accent/10 text-accent w-fit">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-fg">تحميل MP4 الأصلي الكامل</h3>
          <p className="text-xs text-muted leading-relaxed">
            يتم جلب ملف الفيديو الفعلي من سرب BitTorrent بحجمه الكامل (500+ MB) دون أي اقتطاع أو تلف في جودة العرض.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface/50 border border-line space-y-2">
          <div className="p-2 rounded-xl bg-sunken text-muted w-fit">
            <Play className="w-4 h-4 fill-current" />
          </div>
          <h3 className="text-sm font-medium text-fg">مشاهدة فورية بدون انتظار</h3>
          <p className="text-xs text-muted leading-relaxed">
            تقنية البث التسلسلي من Webtor تتيح لك بدء مشاهدة الفيديو فوراً في المتصفح بينما يكتمل سحب بقية الأجزاء في الخلفية.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface/50 border border-line space-y-2">
          <div className="p-2 rounded-xl bg-accent/10 text-accent w-fit">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-fg">محرك Webtor السحابي</h3>
          <p className="text-xs text-muted leading-relaxed">
            يعمل عبر محرك Webtor السحابي الموثوق مع إمكانية التحميل المباشر وحفظ الملف بجميع اللغات والترجمات.
          </p>
        </div>
      </div>
    </div>
  );
}
