import type { Metadata } from 'next';
import { TVPulsarLandingClient, MEDIAFIRE_DOWNLOAD_URL } from './TVPulsarLandingClient';

export const dynamic = 'force-static';
export const revalidate = 86400;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://playzy.me').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'تحميل تطبيق TVPulsar v2.0.0 للأندرويد APK | بث مباشر ومباريات وأفلام بدون إعلانات',
  description:
    'قم بتحميل تطبيق TVPulsar v2.0.0 الأصلي للأندرويد APK برابط مباشر من ميديافاير. تطبيق مجاني 100% لبث المباريات الحية والقنوات التلفزيونية والأفلام، مع مشغل ذكي متعدد السيرفرات FHD/SD ومحرك حظر إعلانات متطور.',
  keywords: [
    'TVPulsar',
    'TVPulsar apk',
    'تحميل TVPulsar',
    'TVPulsar v2.0.0',
    'تطبيق بث مباريات بدون إعلانات',
    'تحميل تطبيق تي في بولسار',
    'تطبيق القنوات والأفلام',
    'TVPulsar mediafire',
    'tvpulsar download apk',
    'smart player fhd',
    'live sports apk',
  ],
  alternates: {
    canonical: `${siteUrl}/tvpulsar`,
  },
  openGraph: {
    title: 'تحميل تطبيق TVPulsar v2.0.0 للأندرويد APK | بث مباشر ومباريات وأفلام بدون إعلانات',
    description:
      'تحميل النسخة الأحدث من تطبيق TVPulsar v2.0.0 APK برابط مباشر مجاني وسريع من ميديافاير. استمتع بمشاهدة المباريات الحية والأفلام بدون أي إعلانات منبثقة.',
    url: `${siteUrl}/tvpulsar`,
    siteName: 'Playzy & TVPulsar',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/tvpulsar-icon.png`,
        width: 512,
        height: 512,
        alt: 'TVPulsar App Icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تحميل تطبيق TVPulsar v2.0.0 للأندرويد APK',
    description:
      'رابط تحميل مباشر وسريع لملف TVPulsar_v2.0.0.apk (23.93 MB) على ميديافاير لبث المباريات والقنوات والأفلام بدون إعلانات.',
    images: [`${siteUrl}/tvpulsar-icon.png`],
  },
};

export default function TVPulsarPage() {
  const jsonLdApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TVPulsar • Live Sports, Channels & Movies',
    image: `${siteUrl}/tvpulsar-icon.png`,
    thumbnailUrl: `${siteUrl}/tvpulsar-icon.png`,
    operatingSystem: 'Android 7.0 and up (API 24 - 34+)',
    applicationCategory: 'EntertainmentApplication',
    softwareVersion: '2.0.0',
    fileSize: '23.93 MB',
    downloadUrl: MEDIAFIRE_DOWNLOAD_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1540',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      '100% Ad-Free Network Sandbox Engine',
      'Live Sports Cards with Team Crests & League Emblems',
      'Smart Multi-Server Player (FHD 1080p / SD 540p)',
      'Exact-Second Resume for Movies & TV Series',
      'Universal APK Architecture (arm64-v8a, armeabi-v7a, x86, x86_64)',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <TVPulsarLandingClient />
    </>
  );
}
