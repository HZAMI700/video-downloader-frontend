import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { faqs } from '../lib/faqs';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://playzy.app').replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Playzy — Free Video Downloader | TikTok, Pinterest, Facebook & Reels',
    template: '%s | Playzy',
  },
  description:
    'Download videos for free with Playzy. Save TikTok without watermark, Pinterest pins, Facebook Reels, and Instagram videos in HD MP4 or 320kbps MP3. Fast, free & 100% safe.',
  keywords: [
    'video downloader',
    'free video downloader',
    'tiktok video downloader',
    'tiktok without watermark',
    'pinterest video downloader',
    'pinterest pin downloader',
    'facebook video downloader',
    'facebook reels downloader',
    'instagram reels downloader',
    'youtube to mp3',
    'download mp4',
    'download 1080p video',
    'playzy',
    'playzy downloader',
    'online video saver',
  ],
  authors: [{ name: 'Playzy Team' }],
  creator: 'Playzy',
  publisher: 'Playzy',
  applicationName: 'Playzy',
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
    title: 'Playzy — Free Video Downloader | TikTok, Pinterest, Facebook & Reels',
    description:
      'Download public videos and reels in high definition with Playzy. Clean MP4 & MP3, no watermarks, unlimited downloads.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playzy — Free Video Downloader | TikTok, Pinterest, Facebook & Reels',
    description:
      'Save TikTok videos without watermark, Pinterest pins, Facebook Reels, and Instagram videos in HD MP4 or MP3.',
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
    description: 'Free online video downloader for TikTok, Pinterest, Facebook, Instagram, and YouTube.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?url={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Playzy Video Downloader',
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
      ratingValue: '4.9',
      reviewCount: '18450',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Download Any Video Online with Playzy',
    description: 'A 3-step guide to saving videos from TikTok, Pinterest, Facebook, and Instagram using Playzy.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Copy Video Link',
        text: 'Copy the URL of the video, reel, or pin you want to save from TikTok, Pinterest, Facebook, or Instagram.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Paste into Playzy',
        text: 'Paste the link into the search box on Playzy and click Download.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Save File',
        text: 'Choose your desired format (1080p MP4, 720p, or MP3 audio) and click to save the completed file to your device.',
      },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
