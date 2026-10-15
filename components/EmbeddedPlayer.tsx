'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ShieldCheck, Play, RotateCcw } from 'lucide-react';
import { MediaMetadata } from '../lib/types';

interface EmbeddedPlayerProps {
  metadata?: MediaMetadata | null;
  isVertical?: boolean;
  onClose?: () => void;
}

/**
 * Extract canonical embedded player stream URL based on platform and URL parameters.
 */
export function getOriginalStreamUrl(metadata?: MediaMetadata | null): string | null {
  if (!metadata) return null;

  const url = metadata.original_url || '';
  const platform = (metadata.platform || '').toLowerCase();
  const id = metadata.id || '';

  // 1. YouTube watch, shorts, youtu.be
  if (platform.includes('youtube') || url.includes('youtube.com') || url.includes('youtu.be')) {
    // Check if ID is clean YouTube 11-char ID
    let ytId = id;
    if (!ytId || ytId.length !== 11) {
      const match = url.match(/(?:v=|\/shorts\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (match) ytId = match[1];
    }
    if (ytId && ytId.length === 11) {
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
    }
  }

  // 2. Instagram posts or reels
  if (platform.includes('instagram') || url.includes('instagram.com') || url.includes('instagr.am')) {
    const match = url.match(/\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    const shortcode = match ? match[2] : id;
    if (shortcode) {
      return `https://www.instagram.com/p/${shortcode}/embed/`;
    }
  }

  // 3. TikTok
  if (platform.includes('tiktok') || url.includes('tiktok.com')) {
    const match = url.match(/\/video\/(\d+)/);
    const videoId = match ? match[1] : id;
    if (videoId && /^\d+$/.test(videoId)) {
      return `https://www.tiktok.com/embed/v2/${videoId}`;
    }
  }

  // 4. Facebook
  if (platform.includes('facebook') || url.includes('facebook.com') || url.includes('fb.watch')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  }

  // 5. Direct media stream URL fallback
  if (metadata.direct_media_url) {
    return metadata.direct_media_url;
  }

  return null;
}

export const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({
  metadata,
  isVertical = false,
  onClose,
}) => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [resolvedIframeUrl, setResolvedIframeUrl] = useState<string | null>(null);
  const [isUsingWorker, setIsUsingWorker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const originalStreamUrl = getOriginalStreamUrl(metadata);

  useEffect(() => {
    if (!originalStreamUrl) {
      setError('Unable to resolve live stream preview for this media.');
      setIsLoading(false);
      return;
    }

    setStreamUrl(originalStreamUrl);
    setIsLoading(true);
    setError(null);

    let isMounted = true;
    const workerProxyUrl = `https://adsclear.yassine-hzami.workers.dev/?url=${encodeURIComponent(originalStreamUrl)}`;

    async function checkWorkerAndLoad() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        // Step 1: Test the Worker URL using a fetch request with 3-second timeout
        const response = await fetch(workerProxyUrl, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!isMounted) return;

        // Step 2: If status 200 OK, load Worker proxy URL
        if (response.status === 200) {
          setResolvedIframeUrl(workerProxyUrl);
          setIsUsingWorker(true);
        } else {
          // Non-200 status: fallback to original stream URL
          setResolvedIframeUrl(originalStreamUrl);
          setIsUsingWorker(false);
        }
      } catch (err) {
        // Step 3: If Worker fails or returns error/timeout, fall back to originalStreamUrl
        if (!isMounted) return;
        setResolvedIframeUrl(originalStreamUrl);
        setIsUsingWorker(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkWorkerAndLoad();

    return () => {
      isMounted = false;
    };
  }, [originalStreamUrl]);

  if (error || !originalStreamUrl) {
    return (
      <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-amber-400 opacity-90" />
        <p className="text-xs text-slate-300 font-medium">Live embed preview unavailable for this link.</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-purple-400 hover:text-purple-300 underline font-semibold mt-2"
          >
            Back to thumbnail
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-2 text-white">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className="text-[11px] font-medium text-slate-300">Checking ad-clear proxy...</span>
        </div>
      )}

      {resolvedIframeUrl && (
        <iframe
          key={resolvedIframeUrl}
          src={resolvedIframeUrl}
          className="w-full h-full border-0 rounded-2xl"
          allow="autoplay; fullscreen; encrypted-media"
          {...(isUsingWorker ? { credentialless: 'true' } : {})}
          title={metadata?.title || 'Embedded Stream Player'}
        />
      )}

      {/* Control bar overlay at top */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        {isUsingWorker && (
          <span
            title="Clean Stream: Routed via Ad-Clearing Cloudflare Proxy"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 backdrop-blur-md text-white shadow"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Ad-Free Proxy</span>
          </span>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 transition-all shadow"
            title="Switch back to thumbnail image"
          >
            Close Player
          </button>
        )}
      </div>
    </div>
  );
};
