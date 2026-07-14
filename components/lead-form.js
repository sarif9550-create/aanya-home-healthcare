'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SERVICES, CITIES } from '@/lib/data';
import { CheckCircle2 } from 'lucide-react';

export function LeadForm({ defaultService = '', defaultCity = '', variant = 'card' }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(defaultService);
  const [city, setCity] = useState(defaultCity);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please enter your name and phone.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, service, city, note, source: 'website' }),
      });
      if (!res.ok) throw new Error('Failed');
      setDone(true);
      toast.success('Thanks! Our care coordinator will call you within 15 minutes.');
    } catch (err) {
      toast.error('Something went wrong. Please WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold">Request received</h3>
        <p className="text-muted-foreground mt-2">Our care coordinator will call you within 15 minutes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={variant === 'card' ? 'rounded-2xl border bg-card p-6 shadow-sm space-y-3' : 'space-y-3'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input placeholder="Full Name*" value={name} onChange={(e)=>setName(e.target.value)} />
        <Input placeholder="Phone Number*" value={phone} onChange={(e)=>setPhone(e.target.value)} />
      </div>
      <Input placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select value={service} onValueChange={setService}>
          <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
          <SelectContent>
            {SERVICES.map(s => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
          <SelectContent>
            {CITIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Textarea placeholder="Tell us about the patient / requirement..." value={note} onChange={(e)=>setNote(e.target.value)} rows={3} />
      <Button type="submit" disabled={submitting} className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-95">
        {submitting ? 'Submitting...' : 'Request Free Consultation'}
      </Button>
      <p className="text-xs text-muted-foreground text-center">Free consultation. No spam. We reply in 15 minutes.</p>
    </form>
  );
}
