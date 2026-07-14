import AdminClient from './admin-client';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Dashboard' };

function generateKpis() {
  const days = 30;
  const series = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const base = 40 + Math.floor(Math.sin(i / 3) * 15) + Math.floor(Math.random() * 20);
    return {
      date: d.toISOString().slice(0, 10),
      leads: base,
      calls: Math.floor(base * 0.6) + Math.floor(Math.random() * 10),
      adsSpend: 4500 + Math.floor(Math.random() * 3000),
      impressions: 12000 + Math.floor(Math.random() * 8000),
      sessions: 800 + Math.floor(Math.random() * 500),
      bookings: Math.floor(base * 0.35),
    };
  });
  const sum = (k) => series.reduce((a, b) => a + b[k], 0);
  return {
    summary: {
      totalLeads: sum('leads'), totalCalls: sum('calls'), totalBookings: sum('bookings'),
      googleAdsSpend: sum('adsSpend'), metaAdsSpend: Math.floor(sum('adsSpend') * 0.55),
      googleAdsConversions: Math.floor(sum('leads') * 0.55), metaConversions: Math.floor(sum('leads') * 0.32),
      gbpCalls: sum('calls'), gbpDirectionRequests: Math.floor(sum('calls') * 0.7),
      gbpProfileViews: Math.floor(sum('impressions') * 1.2),
      ga4Sessions: sum('sessions'), ga4Users: Math.floor(sum('sessions') * 0.75),
      searchImpressions: sum('impressions') * 4, searchClicks: Math.floor(sum('impressions') * 0.32),
      averageCPC: 34, conversionRate: 4.8, cac: 285, ltv: 12400,
    },
    series,
    topKeywords: [
      { keyword: 'home nursing pune', clicks: 342, position: 2.1 },
      { keyword: 'icu setup at home mumbai', clicks: 289, position: 1.8 },
      { keyword: 'physiotherapy at home bangalore', clicks: 254, position: 2.4 },
      { keyword: 'elder care ranchi', clicks: 187, position: 1.5 },
      { keyword: 'doctor at home kolkata', clicks: 165, position: 2.9 },
      { keyword: 'caregiver hyderabad', clicks: 149, position: 3.1 },
    ],
    topPages: [
      { url: '/services/home-nursing', views: 3210 },
      { url: '/cities/pune', views: 2145 },
      { url: '/services/icu-setup-at-home', views: 1987 },
      { url: '/cities/mumbai', views: 1876 },
      { url: '/services/physiotherapy', views: 1420 },
    ],
  };
}

export default async function AdminPage() {
  const kpis = generateKpis();
  let leads = [];
  let posts = [];
  try {
    const db = await getDb();
    const [l, p] = await Promise.all([
      db.collection('leads').find({}).sort({ createdAt: -1 }).limit(500).toArray(),
      db.collection('blog_posts').find({}).sort({ createdAt: -1 }).limit(50).toArray(),
    ]);
    leads = l.map(x => ({ ...x, _id: x._id?.toString() }));
    posts = p.map(x => ({ ...x, _id: x._id?.toString() }));
  } catch (e) {}
  return <AdminClient initialKpis={kpis} initialLeads={{ leads }} initialPosts={posts} />;
}
