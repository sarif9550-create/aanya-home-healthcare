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
import { MapPin, ArrowRight, MessageCircle, Star, ShieldCheck, Clock, Phone } from 'lucide-react';

export async function generateStaticParams() {
  return CITIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = CITIES.find(x => x.slug === slug);
  if (!c) return {};
  return {
    title: `Home Healthcare in ${c.name} — Nurses, Elder Care, ICU at Home`,
    description: `Trusted home nursing, elder care, ICU setup at home, physiotherapy & doctor visits in ${c.name}, ${c.state}. 24/7 verified caregivers.`,
  };
}

export default async function CityPage({ params }) {
  const { slug } = await params;
  const c = CITIES.find(x => x.slug === slug);
  if (!c) notFound();
  const testimonials = TESTIMONIALS.filter(t => t.city.toLowerCase().includes(c.name.toLowerCase().split(' ')[0].toLowerCase())).slice(0,3);
  const show = testimonials.length ? testimonials : TESTIMONIALS.slice(0,3);
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="container relative py-14 md:py-20 grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3">
            <nav className="text-xs text-muted-foreground"><Link href="/" className="hover:text-primary">Home</Link> / <span>Cities</span> / <span className="text-foreground">{c.name}</span></nav>
            <Badge className="mt-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">Now serving {c.name}, {c.state}</Badge>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Home Healthcare in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{c.name}</span></h1>
            <p className="mt-4 text-lg text-muted-foreground">{c.tagline} 24/7 verified nurses, elder-care attendants, ICU-at-home setup, physiotherapy & doctor visits across {c.name}.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#book"><Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white">Book Care in {c.name} <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
              <WhatsAppLink message={`Hi, I need home healthcare in ${c.name}.`}><Button size="lg" variant="outline"><MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />WhatsApp</Button></WhatsAppLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Verified caregivers</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-600" />Care in 2–4 hours</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />4.9★ in {c.name}</div>
            </div>
          </div>
          <div className="lg:col-span-2" id="book">
            <LeadForm defaultCity={c.slug} />
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Services available in {c.name}</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(s => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              <Card className="card-hover p-4 border-2 border-transparent">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><ServiceIcon name={s.icon} className="h-5 w-5" /></div>
                  <div><h3 className="font-semibold text-sm">{s.name} in {c.name}</h3><span className="text-xs text-emerald-600 font-semibold">From ₹{s.startingPrice}/{s.unit}</span></div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="container py-14">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Areas we cover in {c.name}</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.areas.map(a => (<span key={a} className="px-4 py-2 rounded-full bg-card border text-sm font-medium"><MapPin className="h-3.5 w-3.5 inline mr-1 text-primary" />{a}</span>))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Families in {c.name} love us</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {show.map(t => (
            <Card key={t.name} className="p-6">
              <div className="flex gap-1">{[...Array(t.rating)].map((_,i)=><Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="mt-3 text-sm">“{t.text}”</p>
              <div className="mt-4 text-sm font-semibold">{t.name} · <span className="text-muted-foreground font-normal">{t.city}</span></div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="container py-14 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center" style={{fontFamily:'Plus Jakarta Sans'}}>Common questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {FAQS.map((f,i) => (
              <AccordionItem value={`c${i}`} key={i}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
