import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB, WhatsAppLink } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { LeadForm } from '@/components/lead-form';
import { ServiceIcon } from '@/components/service-icon';
import { SERVICES, CITIES, TESTIMONIALS, FAQS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, ArrowRight, MessageCircle, Phone, Star, ShieldCheck, Clock } from 'lucide-react';

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = SERVICES.find(x => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.name} at Home in India | Aanya Home Healthcare`,
    description: s.description,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = SERVICES.find(x => x.slug === slug);
  if (!s) notFound();
  const related = SERVICES.filter(x => x.slug !== s.slug).slice(0, 3);
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="container relative py-14 md:py-20 grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3">
            <nav className="text-xs text-muted-foreground"><Link href="/" className="hover:text-primary">Home</Link> / <Link href="/services" className="hover:text-primary">Services</Link> / <span className="text-foreground">{s.name}</span></nav>
            <div className="mt-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white"><ServiceIcon name={s.icon} className="h-8 w-8" /></div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight" style={{fontFamily:'Plus Jakarta Sans'}}>{s.name}{!/at Home|Home /i.test(s.name) && ' at Home'}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{s.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#book"><Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white">Book {s.name} <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
              <WhatsAppLink message={`Hi, I need ${s.name} at home.`}><Button size="lg" variant="outline"><MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />WhatsApp</Button></WhatsAppLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div><span className="font-semibold text-primary text-lg">₹{s.startingPrice}</span> <span className="text-muted-foreground">/ {s.unit}</span></div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />4.9 by 2,400+ patients</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-600" />Starts in 2–4 hours</div>
            </div>
          </div>
          <div className="lg:col-span-2" id="book">
            <LeadForm defaultService={s.slug} />
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>What's included in {s.name}?</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          {s.includes.map(i => (
            <div key={i} className="flex items-start gap-3 rounded-xl border p-4 bg-card">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <span className="text-sm font-medium">{i}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="container py-14">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Available in these cities</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/cities/${c.slug}`}><Card className="card-hover p-4 text-center border-2 border-transparent hover:border-primary/40"><div className="font-semibold">{s.name} in {c.name}</div><div className="text-xs text-muted-foreground mt-1">{c.state}</div></Card></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center" style={{fontFamily:'Plus Jakarta Sans'}}>FAQ</h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQS.map((f,i) => (
            <AccordionItem value={`f${i}`} key={i}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container pb-14">
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Related services</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {related.map(r => (
            <Link key={r.slug} href={`/services/${r.slug}`}><Card className="card-hover p-5 border-2 border-transparent hover:border-primary/40">
              <ServiceIcon name={r.icon} className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-bold">{r.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{r.short}</p>
            </Card></Link>
          ))}
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
