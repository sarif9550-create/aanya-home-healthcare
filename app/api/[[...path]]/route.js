import { getDb } from '@/lib/mongodb';
import { callLLM } from '@/lib/llm';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { SERVICES, CITIES } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors() });
}

function ok(data, status = 200) {
  return new NextResponse(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors() } });
}

function err(msg, status = 500) {
  return ok({ error: msg }, status);
}

async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

// ---- MOCK KPI DATA ----
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
      totalLeads: sum('leads'),
      totalCalls: sum('calls'),
      totalBookings: sum('bookings'),
      googleAdsSpend: sum('adsSpend'),
      metaAdsSpend: Math.floor(sum('adsSpend') * 0.55),
      googleAdsConversions: Math.floor(sum('leads') * 0.55),
      metaConversions: Math.floor(sum('leads') * 0.32),
      gbpCalls: sum('calls'),
      gbpDirectionRequests: Math.floor(sum('calls') * 0.7),
      gbpProfileViews: Math.floor(sum('impressions') * 1.2),
      ga4Sessions: sum('sessions'),
      ga4Users: Math.floor(sum('sessions') * 0.75),
      searchImpressions: sum('impressions') * 4,
      searchClicks: Math.floor(sum('impressions') * 0.32),
      averageCPC: 34,
      conversionRate: 4.8,
      cac: 285,
      ltv: 12400,
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

export async function GET(request, { params }) {
  const p = (await params).path || [];
  const route = p.join('/');
  try {
    const db = await getDb();

    if (route === '' || route === 'health') return ok({ status: 'ok', service: 'Aanya Home Healthcare API', time: new Date().toISOString() });

    if (route === 'leads') {
      const list = await db.collection('leads').find({}).sort({ createdAt: -1 }).limit(500).toArray();
      return ok({ leads: list.map(l => ({ ...l, _id: l._id?.toString() })) });
    }

    if (route === 'kpis') {
      return ok(generateKpis());
    }

    if (route === 'blog') {
      const list = await db.collection('blog_posts').find({}).sort({ createdAt: -1 }).limit(50).toArray();
      return ok({ posts: list.map(b => ({ ...b, _id: b._id?.toString() })) });
    }

    if (route === 'careers') {
      const list = await db.collection('applications').find({}).sort({ createdAt: -1 }).limit(200).toArray();
      return ok({ applications: list.map(a => ({ ...a, _id: a._id?.toString() })) });
    }

    if (route === 'staff') {
      const list = await db.collection('staff').find({}).sort({ createdAt: -1 }).toArray();
      return ok({ staff: list.map(s => ({ ...s, _id: s._id?.toString() })) });
    }

    if (route === 'meta') {
      return ok({ services: SERVICES.map(s => ({ slug: s.slug, name: s.name })), cities: CITIES.map(c => ({ slug: c.slug, name: c.name })) });
    }

    return err('Not found', 404);
  } catch (e) {
    return err(e.message);
  }
}

export async function POST(request, { params }) {
  const p = (await params).path || [];
  const route = p.join('/');
  try {
    const db = await getDb();
    const body = await readJson(request);

    if (route === 'leads') {
      const doc = {
        id: uuidv4(),
        name: body.name || '',
        phone: body.phone || '',
        email: body.email || '',
        service: body.service || '',
        city: body.city || '',
        note: body.note || '',
        source: body.source || 'website',
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      await db.collection('leads').insertOne(doc);
      return ok({ ok: true, lead: doc });
    }

    if (route === 'careers') {
      const doc = { id: uuidv4(), ...body, createdAt: new Date().toISOString(), status: 'new' };
      await db.collection('applications').insertOne(doc);
      return ok({ ok: true });
    }

    if (route === 'chat') {
      const { session_id = uuidv4(), message = '' } = body;
      const system = `You are Aanya's friendly AI care assistant for Aanya Home Healthcare (aanyahomehealthcare.com). You help Indian families with home healthcare queries in a warm, concise, professional way.

KEY FACTS:
- Services: ${SERVICES.map(s => `${s.name} (from ₹${s.startingPrice}/${s.unit})`).join(', ')}.
- Cities: ${CITIES.map(c => c.name).join(', ')}.
- Phone: +91 7903178064, WhatsApp: +91 7903178064.
- Care starts in 2–4 hours. Free consultation. Free caregiver replacement in 24h.

RULES:
- Reply in <= 100 words unless the user asks for detail.
- For medical emergencies, always advise calling 108 or going to hospital immediately.
- Always suggest booking via the lead form or WhatsApp for actual care.
- Never diagnose or prescribe. You may provide general information.`;
      try {
        const response = await callLLM({ session_id, system_message: system, message, provider: 'openai', model: 'gpt-4o-mini' });
        await db.collection('chat_messages').insertMany([
          { id: uuidv4(), session_id, role: 'user', content: message, ts: new Date().toISOString() },
          { id: uuidv4(), session_id, role: 'assistant', content: response, ts: new Date().toISOString() },
        ]);
        return ok({ response, session_id });
      } catch (e) {
        return ok({ response: 'Our AI is briefly unavailable. Please WhatsApp us at +91 7903178064 for immediate help.', session_id, warning: e.message });
      }
    }

    if (route === 'generate-content') {
      const { type = 'blog', topic = '', tone = 'warm and professional', length = 'medium', city = '', service = '' } = body;
      const system = `You are an expert Indian healthcare content writer for Aanya Home Healthcare. Write SEO-optimised, warm, credible content. Use simple English. Add 1 heading per section. Never make medical claims. Always end with a soft CTA to book via WhatsApp/website.`;
      const prompt = `Generate a ${type} about: "${topic}".
Tone: ${tone}. Length: ${length}. ${service ? `Focus service: ${service}. ` : ''}${city ? `Target city: ${city}. ` : ''}
Structure:
- Catchy H1 title
- Short 2-3 line intro
- 3-5 subsections with H2s
- Bullet points where useful
- Closing CTA
Return plain text (or Markdown).`;
      try {
        const response = await callLLM({ session_id: `content-${uuidv4()}`, system_message: system, message: prompt, provider: 'openai', model: 'gpt-4o-mini' });
        const doc = { id: uuidv4(), type, topic, tone, length, city, service, output: response, createdAt: new Date().toISOString() };
        await db.collection('content_jobs').insertOne(doc);
        return ok({ output: response, job: { ...doc } });
      } catch (e) {
        return err('AI content generation failed: ' + e.message);
      }
    }

    if (route === 'blog') {
      const doc = {
        id: uuidv4(),
        slug: (body.slug || body.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80),
        title: body.title || 'Untitled',
        excerpt: body.excerpt || '',
        content: body.content || '',
        tags: body.tags || [],
        createdAt: new Date().toISOString(),
        published: !!body.published,
      };
      await db.collection('blog_posts').insertOne(doc);
      return ok({ ok: true, post: doc });
    }

    if (route === 'staff') {
      const doc = { id: uuidv4(), name: body.name, role: body.role, city: body.city, phone: body.phone, status: body.status || 'available', createdAt: new Date().toISOString() };
      await db.collection('staff').insertOne(doc);
      return ok({ ok: true, staff: doc });
    }

    return err('Not found', 404);
  } catch (e) {
    return err(e.message);
  }
}

export async function PATCH(request, { params }) {
  const p = (await params).path || [];
  try {
    const db = await getDb();
    const body = await readJson(request);
    if (p[0] === 'leads' && p[1]) {
      await db.collection('leads').updateOne({ id: p[1] }, { $set: { status: body.status, updatedAt: new Date().toISOString() } });
      return ok({ ok: true });
    }
    return err('Not found', 404);
  } catch (e) { return err(e.message); }
}

export async function DELETE(request, { params }) {
  const p = (await params).path || [];
  try {
    const db = await getDb();
    if (p[0] === 'leads' && p[1]) {
      await db.collection('leads').deleteOne({ id: p[1] });
      return ok({ ok: true });
    }
    return err('Not found', 404);
  } catch (e) { return err(e.message); }
}
