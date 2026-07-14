'use client';
import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Briefcase, MapPin, Upload, CheckCircle2 } from 'lucide-react';

const OPENINGS = [
  { title:'ICU Nurse (BSc / GNM)', city:'Pune / Mumbai / Bangalore', type:'Full-time' },
  { title:'Home Care Physiotherapist', city:'All cities', type:'Full-time / Freelance' },
  { title:'Care Coordinator', city:'Ranchi / Bhubaneswar', type:'Full-time' },
  { title:'Caregiver / Attendant', city:'All cities', type:'Full-time' },
  { title:'Digital Marketing Manager', city:'Remote', type:'Full-time' },
];

export default function CareersPage() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', role:'', experience:'', message:'' });
  const [resume, setResume] = useState(null);
  const [sent, setSent] = useState(false);
  async function submit(e){
    e.preventDefault();
    if(!form.name || !form.phone){ toast.error('Name & phone required'); return; }
    const payload = { ...form, resumeName: resume?.name || null };
    const res = await fetch('/api/careers', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (res.ok) { setSent(true); toast.success('Application received! We will call within 24h.'); }
    else toast.error('Something went wrong');
  }
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero border-b">
        <div className="container py-14 text-center">
          <Badge variant="outline" className="border-primary/30 text-primary">Careers</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Care for people. Grow with us.</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Join India's fastest-growing home healthcare team. Competitive pay, training, and purpose-driven work.</p>
        </div>
      </section>
      <section className="container py-14 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Open positions</h2>
          <div className="mt-5 space-y-3">
            {OPENINGS.map(o => (
              <Card key={o.title} className="card-hover p-5 border-2 border-transparent">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /><h3 className="font-bold">{o.title}</h3></div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.city}</span><span>{o.type}</span></div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">Hiring</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Apply now</h2>
          {sent ? (
            <div className="mt-5 rounded-2xl border p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
              <p className="mt-3 font-semibold">Thanks for applying!</p>
              <p className="text-sm text-muted-foreground">Our talent team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 rounded-2xl border p-6 space-y-3 bg-card">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Full name*" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                <Input placeholder="Phone*" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
              </div>
              <Input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Applying for role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} />
                <Input placeholder="Experience (years)" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} />
              </div>
              <Textarea placeholder="Tell us about yourself..." rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
              <label className="flex items-center gap-3 rounded-xl border-2 border-dashed p-4 cursor-pointer hover:border-primary">
                <Upload className="h-5 w-5 text-primary" />
                <span className="text-sm">{resume ? resume.name : 'Upload resume (PDF/DOC)'}</span>
                <input type="file" accept=".pdf,.doc,.docx" hidden onChange={e=>setResume(e.target.files?.[0]||null)} />
              </label>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary h-11">Submit Application</Button>
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
