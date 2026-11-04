import type { Metadata } from 'next';
import { PlayzyApp } from '../../../components/PlayzyApp';
import { ToolId } from '../../../components/AppSidebar';
import { getToolById } from '../../../lib/categories';

export const dynamic = 'force-static';
export const revalidate = 86400;

const ALL_VALID_TOOLS: ToolId[] = [
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
  'english-to-tamil',
  'voice-to-text',
  'speech-transcriber',
  'ai-voice-generator',
  'ai-voice-clone',
  'volume-booster',
  'ai-voice-cleaner',
  'ai-vocal-remover',
  'ai-voice-changer',
  'background-noise-remover',
  'background-music-remover',
  'text-to-speech',
  'workspace',
];

export async function generateStaticParams() {
  return ALL_VALID_TOOLS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://playzy.me').replace(/\/+$/, '');

  if (slug === 'torrent-downloader') {
    return {
      title: 'Torrent to MP4 Video Downloader - Fast Cloud WebTorrent Stream | Playzy',
      description:
        'Convert any video .torrent file into a high-speed, direct MP4 file download without needing a BitTorrent client in your browser.',
      alternates: {
        canonical: `${baseUrl}/tools/torrent-downloader`,
      },
      openGraph: {
        title: 'Torrent to MP4 Video Downloader | Playzy',
        description: 'Server-side WebTorrent download engine serving playable MP4 video files.',
        url: `${baseUrl}/tools/torrent-downloader`,
        siteName: 'Playzy AI',
        type: 'website',
      },
    };
  }

  if (slug === 'robin') {
    return {
      title: 'Robin Threat Intelligence Studio - Legal Dark Web OSINT Suite | Playzy',
      description:
        'Legal Dark Web OSINT & Cyber Threat Intelligence Suite. Powered by OpenCode Zen API & Tor SOCKS5 v3 live reachability checks.',
      alternates: {
        canonical: `${baseUrl}/tools/robin`,
      },
      openGraph: {
        title: 'Robin Threat Intelligence Studio - Legal Dark Web OSINT | Playzy',
        description:
          'Investigate cyber threats, ransomware, leaked credentials, CVEs, and live .onion footprints through authentic Tor SOCKS5 proxy routing.',
        url: `${baseUrl}/tools/robin`,
        siteName: 'Playzy AI',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Robin Threat Intelligence Studio | Playzy',
        description: 'Legal Dark Web OSINT & Cyber Threat Intelligence Suite.',
      },
    };
  }

  if (slug === 'email-checker') {
    return {
      title: 'Blackbird Email OSINT Lookup - Breached Accounts & Footprints | Playzy',
      description:
        'Search online footprints, breached credentials, and registered platforms for any email address using Blackbird OSINT.',
      alternates: {
        canonical: `${baseUrl}/tools/email-checker`,
      },
      openGraph: {
        title: 'Blackbird Email OSINT Lookup | Playzy',
        description: 'Fast, non-intrusive email footprint and public account reconnaissance.',
        url: `${baseUrl}/tools/email-checker`,
        siteName: 'Playzy AI',
        type: 'website',
      },
    };
  }

  const tool = getToolById(slug as ToolId);
  const toolName = tool?.name || slug;
  const toolDesc = tool?.fullDesc || tool?.shortDesc || '100% Free and unlimited AI workspace tool by Playzy.';

  return {
    title: `${toolName} - Free Online AI Tool | Playzy`,
    description: toolDesc,
    alternates: {
      canonical: `${baseUrl}/tools/${slug}`,
    },
    openGraph: {
      title: `${toolName} - Playzy AI`,
      description: toolDesc,
      url: `${baseUrl}/tools/${slug}`,
      siteName: 'Playzy AI',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${toolName} | Playzy`,
      description: toolDesc,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PlayzyApp initialTool={slug as ToolId} />;
}
