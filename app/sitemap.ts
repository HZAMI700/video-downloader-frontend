import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://playzy.me').replace(/\/+$/, '');
  const now = new Date();

  const toolSlugs = [
    'torrent-downloader',
    'robin',
    'email-checker',
    'video-downloader',
    'youtube-to-mp3',
    'youtube-to-mp4',
    'paraphrasing-tool',
    'grammar-checker',
    'ai-detector',
    'summarizer',
    'ai-humanizer',
    'translator',
    'plagiarism-checker',
    'ai-chat',
    'transcriber',
    'mp3-to-text',
    'mp4-to-text',
    'podcast-generator',
    'audio-translator',
    'recorder-transcriber',
    'tiktok-to-mp3',
    'video-to-mp3',
    'mp4-to-mp3',
    'youtube-to-wav',
    'extract-audio',
    'ai-voice-generator',
    'ai-voice-clone',
    'volume-booster',
    'ai-voice-cleaner',
    'ai-vocal-remover',
    'ai-voice-changer',
    'background-noise-remover',
    'background-music-remover',
    'workspace',
  ];

  const toolEntries: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: slug === 'robin' || slug === 'video-downloader' || slug === 'youtube-to-mp3' ? 0.95 : 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tvpulsar`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download/tvpulsar`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...toolEntries,
  ];
}
