import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mideeye.com';
  const now  = new Date();

  return [
    { url: `${base}/`,           lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/questions`,  lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${base}/topics`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/showcase`,   lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/users`,      lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${base}/ask`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`,    lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`,      lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/guidelines`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/cookies`,    lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/support`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
