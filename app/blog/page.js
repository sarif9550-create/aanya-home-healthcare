import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { getDb } from '@/lib/mongodb';

export const metadata = { title: 'Home Healthcare Blog | Aanya Home Healthcare' };
export const dynamic = 'force-dynamic';

const FALLBACK_POSTS = [
  { slug: 'elder-care-at-home-guide', title: 'The Complete Guide to Elder Care at Home in India (2025)', excerpt: 'Everything Indian families need to know about setting up quality elder care at home — costs, caregivers, safety and more.', createdAt: new Date().toISOString(), tags:['elder-care','india','guide'] },
  { slug: 'icu-at-home-cost-india', title: 'ICU at Home in India: Cost, Setup & Everything You Need', excerpt: 'Bringing ICU care home can be 40% cheaper than hospital ICU while offering better recovery. Here\u2019s a full breakdown.', createdAt: new Date().toISOString(), tags:['icu','home-care'] },
  { slug: 'physiotherapy-at-home-benefits', title: 'Why Home Physiotherapy Works Better for Seniors', excerpt: 'Home physio removes travel, reduces stress and speeds up recovery. Here\u2019s the science.', createdAt: new Date().toISOString(), tags:['physio','seniors'] },
];

async function fetchPosts() {
  try {
    const db = await getDb();
    const posts = await db.collection('blog_posts').find({}).sort({ createdAt: -1 }).limit(30).toArray();
    if (posts.length > 0) return posts.map(p => ({ ...p, _id: p._id?.toString() }));
  } catch(e){}
  return FALLBACK_POSTS;
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero border-b">
        <div className="container py-14 text-center">
          <Badge variant="outline" className="border-primary/30 text-primary">Blog</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Home Healthcare Insights</h1>
          <p className="mt-3 text-muted-foreground">Expert-written guides for Indian families.</p>
        </div>
      </section>
      <section className="container py-14 grid md:grid-cols-3 gap-5">
        {posts.map(p => (
          <Link key={p.slug || p._id} href={`/blog/${p.slug || p._id}`}>
            <Card className="card-hover p-6 h-full border-2 border-transparent">
              <div className="flex flex-wrap gap-1">{(p.tags||[]).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
              <h2 className="mt-3 font-bold text-lg">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(p.createdAt).toLocaleDateString()}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
        ))}
      </section>
      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
