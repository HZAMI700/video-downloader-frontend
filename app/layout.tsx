import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { faqs } from '../lib/faqs';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://playzy.me').replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Playzy — Free AI Paraphraser, AI Detector, Voice Generator & Video Downloader',
    template: '%s | Playzy AI & Media Suite',
  },
  description:
    'Playzy is the free all-in-one AI writing & media studio. Paraphrase text, detect AI content with 0-100% precision, humanize AI writing, generate realistic AI voices, convert MP3 and MP4 to text, and download HD videos & 320kbps MP3s from YouTube and TikTok.',
  keywords: [
    'quillbot alternative',
    'free paraphrasing tool',
    'ai paraphraser',
    'ai detector',
    'ai content detector',
    'ai text detector 0 to 100',
    'ai humanizer',
    'undetectable ai',
    'humanize ai text',
    'ai voice generator',
    'elevenlabs alternative',
    'realistic text to speech',
    'mp3 to text',
    'audio transcriber',
    'mp4 to text',
    'video to text transcription',
    'youtube to mp3',
    'tiktok to mp3',
    'free video downloader',
    'video downloader without watermark',
    'grammar checker',
    'plagiarism checker',
    'playzy',
    'playzy.me',
    'playzy ai',
  ],
  authors: [{ name: 'Playzy Team', url: siteUrl }],
  creator: 'Playzy',
  publisher: 'Playzy',
  applicationName: 'Playzy',
  category: 'Productivity & Multimedia AI',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Playzy',
    title: 'Playzy — Free AI Paraphraser, AI Detector, Voice Generator & Video Downloader',
    description:
      'Paraphrase text, detect AI writing, humanize AI text, generate lifelike voices, transcribe MP3/MP4, and download 4K videos & MP3 audio for free on Playzy.me.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playzy — Free AI Paraphraser, AI Detector, Voice Generator & Video Downloader',
    description:
      'Top-tier AI writing and media suite: Paraphraser, AI Detector, AI Humanizer, Voice Studio, MP3/MP4 Transcriber, and Video Downloader.',
    creator: '@playzyapp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Playzy',
    url: siteUrl,
    description:
      'Playzy is a free all-in-one AI writing suite, voice generator, speech-to-text transcriber, and video downloader.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Playzy',
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    sameAs: ['https://twitter.com/playzyapp', 'https://github.com/playzyapp'],
  };

  const jsonLdWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Playzy AI & Media Suite',
    url: siteUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript and HTML5 support',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.95',
      reviewCount: '24890',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI Paraphrasing & Rewriter Tool',
      'AI Content Detector with 0-100% Probability Score',
      'AI Humanizer for Undetectable Text',
      'Realistic Multi-Language AI Voice Generator (ElevenLabs Quality)',
      'MP3 Audio to Text Transcriber',
      'MP4 Video to Text Transcriber',
      'YouTube to MP3 (320kbps High Quality)',
      'TikTok to MP3 & Watermark-Free Video Downloader',
      'Grammar & Spell Checker',
      'Plagiarism Checker',
    ],
  };

  const extendedFaqs = [
    {
      q: 'What is Playzy and what tools does it offer?',
      a: 'Playzy is a free, all-in-one AI and media platform offering an AI Paraphraser, AI Content Detector (0-100 score), AI Humanizer (undetectable rewrite), realistic AI Voice Generator, MP3 to Text transcriber, MP4 to Text transcriber, YouTube to MP3 converter, and HD Video Downloader.',
    },
    {
      q: 'How does Playzy AI Content Detector work?',
      a: 'Playzy AI Detector analyzes text structure, perplexity, burstiness, and semantic patterns to determine if writing was generated by ChatGPT, GPT-4, Claude, Gemini, or a human, returning an exact percentage confidence score from 0 to 100.',
    },
    {
      q: 'How does the Playzy AI Voice Generator work?',
      a: 'Playzy AI Voice Studio synthesizes natural, studio-quality speech across 36+ realistic male, female, and narrative voices in multiple languages and accents, powered by advanced audio DSP and parametric acoustic filtering.',
    },
    {
      q: 'Can I transcribe MP3 and MP4 files to text on Playzy?',
      a: 'Yes. Playzy offers dedicated MP3 to Text for pure audio files and MP4 to Text for video files, converting speech into timestamped, accurate transcripts with one-click export to TXT, SRT, or DOCX.',
    },
    {
      q: 'Is Playzy completely free to use?',
      a: 'Yes! Playzy is 100% free with no registration or credit card required. You can paraphrase, detect AI, generate voices, transcribe audio, and download videos immediately.',
    },
    ...faqs,
  ];

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extendedFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Google Fonts - Outfit & Plus Jakarta Sans for Skywork Design */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1227503577553311"
          crossOrigin="anonymous"
        />

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MPCP5JE7E9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MPCP5JE7E9');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="bg-[#0F131A] text-slate-100 antialiased min-h-screen flex flex-col font-sans selection:bg-[#00c9a7] selection:text-black">
        {children}
      </body>
    </html>
  );
}
