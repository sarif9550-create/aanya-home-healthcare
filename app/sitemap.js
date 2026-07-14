import { SERVICES, CITIES } from '@/lib/data';

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://aanyahomehealthcare.com';
  const staticPages = ['', '/about', '/contact', '/faq', '/blog', '/careers', '/services'];
  const pages = staticPages.map(p => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.8 }));
  const services = SERVICES.map(s => ({ url: `${base}/services/${s.slug}`, changeFrequency: 'weekly', priority: 0.9 }));
  const cities = CITIES.map(c => ({ url: `${base}/cities/${c.slug}`, changeFrequency: 'weekly', priority: 0.9 }));
  return [...pages, ...services, ...cities];
}
