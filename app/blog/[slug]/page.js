import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { getDb } from '@/lib/mongodb';
import { Badge } from '@/components/ui/badge';

const FALLBACK = {
  'elder-care-at-home-guide': { title: 'The Complete Guide to Elder Care at Home in India (2025)', content: `Setting up quality elder care at home combines medical supervision, physiotherapy, nutrition and emotional wellbeing. Families in India increasingly prefer home care because it offers dignity, familiarity, and often 40% lower cost than nursing homes.\n\n## What is elder care at home?\nHome elder care involves a mix of trained caregivers, visiting doctors, nurses (if needed), and physiotherapy. Aanya Home Healthcare provides holistic elder care programs starting at \u20b9900/day.\n\n## Key benefits\n- Care in a familiar environment\n- Reduced infection risk vs hospitals\n- Family involvement\n- Personalised routines\n\n## When to consider it\nIf a senior struggles with mobility, has memory issues, needs help with daily activities, or is recovering from surgery, home care is often the safest choice.\n\n## How to get started\nBook a free consultation \u2014 our care coordinator will assess and craft a plan within 24 hours.` },
  'icu-at-home-cost-india': { title: 'ICU at Home in India: Cost, Setup & Everything You Need', content: `ICU-at-home is a life-saving alternative for critical patients who need round-the-clock monitoring but can be safely managed outside hospital walls. It typically costs 40\u201360% less than a hospital ICU.\n\n## What's included\nVentilator, cardiac monitor, oxygen concentrator, suction, BiPAP/CPAP, hospital bed, 24x7 critical care nurse, and daily ICU consultant tele-rounds.\n\n## Cost breakdown\nAanya's ICU-at-home starts at \u20b94,500/day all-inclusive.\n\n## Ideal candidates\nStable ventilator patients, long-term ICU stays, palliative care, post-stroke.` },
  'physiotherapy-at-home-benefits': { title: 'Why Home Physiotherapy Works Better for Seniors', content: `Home physiotherapy is transforming senior recovery in India. By eliminating travel stress and providing 1:1 attention, home physio improves outcomes by 30% and adherence by 60%.\n\n## Common conditions treated\nPost-surgery rehab, stroke recovery, arthritis, back pain, Parkinson's, orthopaedic conditions.` },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = FALLBACK[slug];
  return { title: post?.title || 'Post' };
}

export default async function BlogDetail({ params }) {
  const { slug } = await params;
  let post = FALLBACK[slug];
  try {
    const db = await getDb();
    const dbPost = await db.collection('blog_posts').findOne({ slug });
    if (dbPost) post = { ...dbPost, _id: dbPost._id?.toString() };
  } catch(e){}
  if (!post) notFound();
  return (
    <>
      <SiteHeader />
      <article className="container py-14 max-w-3xl">
        <Link href="/blog" className="text-sm text-primary hover:underline">← Back to blog</Link>
        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>{post.title}</h1>
        <div className="mt-3 text-sm text-muted-foreground">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</div>
        <div className="mt-6 prose prose-lg dark:prose-invert whitespace-pre-wrap">{post.content}</div>
      </article>
      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
