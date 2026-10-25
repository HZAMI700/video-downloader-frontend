import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://playzy.me').replace(/\/+$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/backend/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
