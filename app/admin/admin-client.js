'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SiteHeader } from '@/components/site-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Sparkles, Users, TrendingUp, Phone, PhoneCall, Eye, MousePointerClick, IndianRupee, Loader2, Copy, Search, Save, Plus, RefreshCw, BarChart3, Star, LayoutDashboard, MessageSquare, FileText, BookOpen, Briefcase } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { SERVICES, CITIES } from '@/lib/data';

function Stat({ icon:Icon, label, value, hint, color = 'primary' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-1 text-2xl font-extrabold">{value}</div>
          {hint && <div className="mt-1 text-xs text-emerald-600 font-semibold">{hint}</div>}
        </div>
        <div className={`h-10 w-10 rounded-lg bg-${color}/10 flex items-center justify-center text-${color}`}>
          <Icon className={`h-5 w-5 text-${color === 'primary' ? 'primary' : color}`} />
        </div>
      </div>
    </Card>
  );
}

export default function AdminClient({ initialKpis, initialLeads, initialPosts }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const kpisQ = useQuery({ queryKey: ['kpis'], queryFn: async () => (await axios.get('/api/kpis')).data, initialData: initialKpis });
  const leadsQ = useQuery({ queryKey: ['leads'], queryFn: async () => (await axios.get('/api/leads')).data, initialData: initialLeads });
  const postsQ = useQuery({ queryKey: ['blog'], queryFn: async () => (await axios.get('/api/blog')).data, initialData: initialPosts ? { posts: initialPosts } : undefined });

  const kpis = kpisQ.data;
  const leads = leadsQ.data?.leads || [];
  const setLeads = () => leadsQ.refetch();

  function loadAll() { kpisQ.refetch(); leadsQ.refetch(); postsQ.refetch(); }

  useEffect(() => { setPosts(postsQ.data?.posts || []); }, [postsQ.data]);

  return (
    <>
      <SiteHeader />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2"><LayoutDashboard className="h-6 w-6 text-primary" /><h1 className="text-2xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Admin Dashboard</h1></div>
            <p className="text-sm text-muted-foreground mt-1">Aanya Home Healthcare — CRM · Marketing KPIs · AI tools</p>
          </div>
          <Button variant="outline" onClick={loadAll}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-1" />KPI Overview</TabsTrigger>
            <TabsTrigger value="leads"><Users className="h-4 w-4 mr-1" />CRM / Leads</TabsTrigger>
            <TabsTrigger value="ai-content"><Sparkles className="h-4 w-4 mr-1" />AI Content Generator</TabsTrigger>
            <TabsTrigger value="seo"><Search className="h-4 w-4 mr-1" />SEO Tools</TabsTrigger>
            <TabsTrigger value="blog"><BookOpen className="h-4 w-4 mr-1" />Blog CMS</TabsTrigger>
            <TabsTrigger value="staff"><Briefcase className="h-4 w-4 mr-1" />Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {!kpis ? <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : <KPISection kpis={kpis} />}
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <LeadsSection leads={leads} setLeads={setLeads} reload={loadAll} loading={loadingLeads} setLoading={setLoadingLeads} />
          </TabsContent>

          <TabsContent value="ai-content" className="mt-6">
            <ContentGenerator />
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <SEOSection kpis={kpis} />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogCMS posts={posts} reload={loadAll} />
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <StaffSection />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

/* ---------------- KPI ---------------- */
function KPISection({ kpis }) {
  const { summary, series } = kpis;
  const inr = (n) => '₹' + new Intl.NumberFormat('en-IN').format(n);
  const num = (n) => new Intl.NumberFormat('en-IN').format(n);
  const funnel = [
    { name: 'Impressions', value: summary.searchImpressions },
    { name: 'Sessions', value: summary.ga4Sessions },
    { name: 'Leads', value: summary.totalLeads },
    { name: 'Bookings', value: summary.totalBookings },
  ];
  const trafficMix = [
    { name: 'Google Ads', value: summary.googleAdsConversions },
    { name: 'Meta Ads', value: summary.metaConversions },
    { name: 'Organic', value: Math.floor(summary.totalLeads * 0.3) },
    { name: 'GBP', value: Math.floor(summary.gbpCalls * 0.15) },
    { name: 'Direct', value: Math.floor(summary.totalLeads * 0.08) },
  ];
  const COLORS = ['hsl(199 89% 48%)', 'hsl(158 64% 45%)', 'hsl(262 83% 58%)', 'hsl(43 96% 56%)', 'hsl(340 82% 52%)'];
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Leads (30d)" value={num(summary.totalLeads)} hint="+18% vs prev period" />
        <Stat icon={PhoneCall} label="GBP Calls" value={num(summary.gbpCalls)} hint="+12% MoM" />
        <Stat icon={IndianRupee} label="Google Ads Spend" value={inr(summary.googleAdsSpend)} hint={`CPL ~ ${inr(summary.cac)}`} />
        <Stat icon={IndianRupee} label="Meta Ads Spend" value={inr(summary.metaAdsSpend)} hint="Facebook + Instagram" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Eye} label="GA4 Sessions" value={num(summary.ga4Sessions)} />
        <Stat icon={MousePointerClick} label="Search Clicks" value={num(summary.searchClicks)} />
        <Stat icon={TrendingUp} label="Conversion Rate" value={summary.conversionRate + '%'} />
        <Stat icon={Star} label="CAC → LTV" value={`${inr(summary.cac)} → ${inr(summary.ltv)}`} hint="43x ratio" />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Leads & Bookings — last 30 days</h3>
          <Badge variant="outline">Mock data — real API integration ready</Badge>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:11}} />
            <RTooltip />
            <Line type="monotone" dataKey="leads" stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="bookings" stroke="hsl(158 64% 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="calls" stroke="hsl(262 83% 58%)" strokeWidth={2} dot={false} />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Ad Spend vs Sessions</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{fontSize:10}} />
              <YAxis tick={{fontSize:10}} />
              <RTooltip />
              <Bar dataKey="adsSpend" fill="hsl(199 89% 48%)" />
              <Bar dataKey="sessions" fill="hsl(158 64% 45%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold mb-4">Lead sources</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={trafficMix} dataKey="value" nameKey="name" outerRadius={90} label>
                {trafficMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <RTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Google Business Profile</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Profile Views</div><div className="text-lg font-bold">{num(summary.gbpProfileViews)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Calls</div><div className="text-lg font-bold">{num(summary.gbpCalls)}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Directions</div><div className="text-lg font-bold">{num(summary.gbpDirectionRequests)}</div></div>
          </div>
          <div className="mt-4 space-y-2">
            {['Pune','Mumbai','Bangalore','Hyderabad'].map(c => (
              <div key={c} className="flex items-center justify-between text-sm"><span>{c}</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />4.{7 + Math.floor(Math.random()*3)} ({40 + Math.floor(Math.random()*80)} reviews)</span></div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnel.map((f, i) => {
              const pct = (f.value / funnel[0].value) * 100;
              return (
                <div key={f.name}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium">{f.name}</span><span>{num(f.value)}</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-secondary" style={{width: pct + '%'}} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ---------------- LEADS ---------------- */
function LeadsSection({ leads, setLeads, reload }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  async function setStatus(id, status) {
    await fetch(`/api/leads/${id}`, { method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    toast.success('Updated');
  }
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    booked: leads.filter(l => l.status === 'booked').length,
    won: leads.filter(l => l.status === 'won').length,
  };
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {[{k:'total',l:'Total',c:'primary'},{k:'new',l:'New',c:'blue'},{k:'contacted',l:'Contacted',c:'amber'},{k:'booked',l:'Booked',c:'purple'},{k:'won',l:'Won',c:'emerald'}].map(s => (
          <Card key={s.k} className={`p-4 cursor-pointer ${filter===s.k?'border-primary':''}`} onClick={()=>setFilter(s.k)}><div className="text-xs text-muted-foreground">{s.l}</div><div className="text-2xl font-extrabold">{stats[s.k]}</div></Card>
        ))}
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Service</TableHead><TableHead>City</TableHead><TableHead>Status</TableHead><TableHead>Note</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No leads yet. Submit a form on the homepage to see it here.</TableCell></TableRow>}
            {filtered.map(l => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell><a className="text-primary hover:underline" href={`tel:${l.phone}`}>{l.phone}</a></TableCell>
                <TableCell>{l.service}</TableCell>
                <TableCell>{l.city}</TableCell>
                <TableCell>
                  <Select value={l.status} onValueChange={(v)=>setStatus(l.id, v)}>
                    <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['new','contacted','booked','won','lost'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs max-w-xs truncate">{l.note}</TableCell>
                <TableCell><a href={`https://wa.me/${(l.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline">WhatsApp</Button></a></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

/* ---------------- AI CONTENT GENERATOR ---------------- */
function ContentGenerator() {
  const [type, setType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('warm and professional');
  const [length, setLength] = useState('medium');
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) { toast.error('Enter a topic'); return; }
    setLoading(true); setOutput('');
    try {
      const res = await fetch('/api/generate-content', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type, topic, tone, length, service, city }) });
      const data = await res.json();
      if (data.output) setOutput(data.output); else toast.error(data.error || 'Generation failed');
    } finally { setLoading(false); }
  }
  async function saveAsBlog() {
    if (!output) return;
    const title = topic || 'Untitled';
    const res = await fetch('/api/blog', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, content: output, excerpt: output.slice(0, 200), tags: [type, service, city].filter(Boolean), published: true }) });
    if (res.ok) toast.success('Saved to Blog CMS'); else toast.error('Save failed');
  }
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-primary" /><h3 className="font-bold">AI Content Generator</h3></div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog post</SelectItem>
                <SelectItem value="landing-page">Landing page copy</SelectItem>
                <SelectItem value="social-facebook">Facebook post</SelectItem>
                <SelectItem value="social-instagram">Instagram caption</SelectItem>
                <SelectItem value="google-ad">Google Ads (headlines + descriptions)</SelectItem>
                <SelectItem value="meta-ad">Meta Ads copy</SelectItem>
                <SelectItem value="gbp-post">Google Business Profile post</SelectItem>
                <SelectItem value="whatsapp-broadcast">WhatsApp broadcast</SelectItem>
                <SelectItem value="email">Marketing email</SelectItem>
                <SelectItem value="seo-meta">SEO meta title + description</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-xs font-medium">Topic / Prompt</label><Textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. 5 signs your parent needs home nursing care" rows={2} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">Tone</label><Input value={tone} onChange={e=>setTone(e.target.value)} /></div>
            <div><label className="text-xs font-medium">Length</label><Select value={length} onValueChange={setLength}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="short">Short</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="long">Long</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">Focus service</label><Select value={service} onValueChange={setService}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{SERVICES.map(s=><SelectItem key={s.slug} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="text-xs font-medium">Target city</label><Select value={city} onValueChange={setCity}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{CITIES.map(c=><SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary h-11">{loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate with AI</>}</Button>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><h3 className="font-bold">Output</h3></div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={()=>{navigator.clipboard.writeText(output); toast.success('Copied');}} disabled={!output}><Copy className="h-3 w-3 mr-1" />Copy</Button>
            <Button size="sm" variant="outline" onClick={saveAsBlog} disabled={!output}><Save className="h-3 w-3 mr-1" />Save as blog</Button>
          </div>
        </div>
        <Textarea value={output} onChange={(e)=>setOutput(e.target.value)} rows={22} placeholder="AI-generated content will appear here..." className="font-mono text-xs" />
      </Card>
    </div>
  );
}

/* ---------------- SEO ---------------- */
function SEOSection({ kpis }) {
  if (!kpis) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="p-6">
        <h3 className="font-bold mb-3">Top Search Keywords (Search Console)</h3>
        <div className="space-y-2">
          {kpis.topKeywords.map(k => (
            <div key={k.keyword} className="flex items-center justify-between rounded-lg border p-3">
              <div><div className="font-medium text-sm">{k.keyword}</div><div className="text-xs text-muted-foreground">Avg. position #{k.position}</div></div>
              <Badge variant="outline">{k.clicks} clicks</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold mb-3">Top Pages (GA4)</h3>
        <div className="space-y-2">
          {kpis.topPages.map(p => (
            <div key={p.url} className="flex items-center justify-between rounded-lg border p-3">
              <div className="font-mono text-xs">{p.url}</div>
              <Badge>{new Intl.NumberFormat('en-IN').format(p.views)} views</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 lg:col-span-2">
        <h3 className="font-bold mb-3">SEO Health Checklist</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {[
            'Sitemap.xml auto-generated',
            'Robots.txt configured',
            'Meta title & description on every page',
            'Schema.org markup (LocalBusiness, Service, FAQ)',
            'Mobile-responsive & Core Web Vitals green',
            'Open Graph + Twitter cards',
            'Canonical URLs',
            'H1-H6 hierarchy on all pages',
            'Fast image loading (WebP)',
            'City x Service programmatic pages',
          ].map(x => <div key={x} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />{x}</div>)}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- BLOG CMS ---------------- */
function BlogCMS({ posts, reload }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  async function save() {
    if (!title || !content) { toast.error('Title & content required'); return; }
    setSaving(true);
    const res = await fetch('/api/blog', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, content, excerpt: content.slice(0, 200), published: true }) });
    setSaving(false);
    if (res.ok) { toast.success('Post published'); setTitle(''); setContent(''); reload(); }
  }
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-bold mb-3">New blog post</h3>
        <Input placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} />
        <Textarea placeholder="Content (markdown supported)" className="mt-3" rows={12} value={content} onChange={e=>setContent(e.target.value)} />
        <Button onClick={save} disabled={saving} className="mt-3 bg-gradient-to-r from-primary to-secondary"><Plus className="h-4 w-4 mr-1" />Publish</Button>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold mb-3">Published posts ({posts.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {posts.length === 0 && <div className="text-sm text-muted-foreground">No posts yet.</div>}
          {posts.map(p => (
            <div key={p.id || p._id} className="rounded-lg border p-3">
              <div className="font-semibold text-sm">{p.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.excerpt}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{new Date(p.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- STAFF ---------------- */
function StaffSection() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name:'', role:'Nurse', city:'Pune', phone:'', status:'available' });
  useEffect(() => { fetch('/api/staff').then(r=>r.json()).then(d=>setStaff(d.staff||[])); }, []);
  async function add() {
    if (!form.name || !form.phone) { toast.error('Name & phone required'); return; }
    const res = await fetch('/api/staff', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    const d = await res.json();
    setStaff([d.staff, ...staff]);
    setForm({ name:'', role:'Nurse', city:'Pune', phone:'', status:'available' });
    toast.success('Staff added');
  }
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="font-bold mb-3">Add staff</h3>
        <div className="space-y-3">
          <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <Select value={form.role} onValueChange={v=>setForm({...form,role:v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Nurse','Physiotherapist','Caregiver','Doctor','Attendant','Coordinator'].map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
          <Select value={form.city} onValueChange={v=>setForm({...form,city:v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CITIES.map(c=><SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select>
          <Button onClick={add} className="w-full bg-gradient-to-r from-primary to-secondary"><Plus className="h-4 w-4 mr-1" />Add</Button>
        </div>
      </Card>
      <Card className="p-6 lg:col-span-2">
        <h3 className="font-bold mb-3">Team ({staff.length})</h3>
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>City</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
          {staff.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No staff yet.</TableCell></TableRow>}
          {staff.map(s => (
            <TableRow key={s.id}><TableCell className="font-medium">{s.name}</TableCell><TableCell>{s.role}</TableCell><TableCell>{s.city}</TableCell><TableCell>{s.phone}</TableCell><TableCell><Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">{s.status}</Badge></TableCell></TableRow>
          ))}
        </TableBody></Table>
      </Card>
    </div>
  );
}
