export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://aanyahomehealthcare.com';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
