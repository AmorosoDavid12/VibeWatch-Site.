import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://vibewatch.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://vibewatch.app/signin', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://vibewatch.app/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://vibewatch.app/delete-account', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.1 },
  ];
}
