'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Play, DownloadCloud, ArrowRight, Shield, Film, Radio } from 'lucide-react';
import Link from 'next/link';

interface WatchPlayerClientProps {
  id: string;
}

export function WatchPlayerClient({ id }: WatchPlayerClientProps) {
  const [streamData, setStreamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStream() {
      try {
        const res = await fetch(`/api/torrent/${id}/stream`);
        if (!res.ok) throw new Error('Unable to retrieve torrent streaming resource.');
        const data = await res.json();
        setStreamData(data);
        setIsLoading(false);

        // Mount Webtor
        setTimeout(() => {
          mountWebtor(data);
        }, 300);
      } catch (err: any) {
        setError(err.message || 'Error initializing streaming session.');
        setIsLoading(false);
      }
    }
    loadStream();
  }, [id]);

  const mountWebtor = (data: any) => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.webtor = window.webtor || [];
        // @ts-ignore
        window.webtor.push({
          id: 'watch-webtor-mount',
          magnet: data.magnet || `magnet:?xt=urn:btih:${id}`,
          width: '100%',
          height: '100%',
          controls: true,
          theme: 'dark',
          header: true,
          title: data.filename || 'Torrent Video Playback',
        });
      }
    } catch (e) {
      console.warn('Webtor mount error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between" dir="rtl">
      <Script
        src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js"
        strategy="lazyOnload"
      />

      {/* Top Bar */}
      <header className="px-4 py-3 border-b border-line bg-surface/60 flex items-center justify-between">
        <Link
          href="/tools/torrent-downloader"
          className="flex items-center gap-2 text-xs font-medium text-fg hover:text-fg transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى محول التورنت</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`/api/torrent/${id}/download`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent hover:bg-accent text-xs font-medium text-on-accent transition-all"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>تحميل MP4 الكامل</span>
          </a>
        </div>
      </header>

      {/* Player Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-line relative flex items-center justify-center">
          {error ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-danger text-sm font-medium">{error}</p>
              <a
                href={`/api/torrent/${id}/download`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface text-xs font-medium text-fg hover:bg-sunken"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>تحميل الفيديو مباشرة كملف MP4</span>
              </a>
            </div>
          ) : (
            <div id="watch-webtor-mount" className="w-full h-full">
              {isLoading && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-bg">
                  <div className="w-8 h-8 border-2 border-line border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-muted">جاري الاتصال بسرب BitTorrent وبدء البث...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {streamData?.filename && (
          <div className="w-full max-w-5xl mt-4 px-2 flex items-center justify-between text-xs text-muted">
            <span className="font-mono truncate">{streamData.filename}</span>
            <span className="shrink-0 text-accent font-medium">Webtor Swarm Engine</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-line text-center text-xs text-muted">
        مشغل Webtor المفتوح المصدر (MIT License) • متوافق مع تطبيقات الهواتف الذكية (iOS/Android WebView)
      </footer>
    </div>
  );
}
