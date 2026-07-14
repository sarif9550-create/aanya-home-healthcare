import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB, WhatsAppLink } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { LeadForm } from '@/components/lead-form';
import { ServiceIcon } from '@/components/service-icon';
import { SERVICES, CITIES, TESTIMONIALS, FAQS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle2, ShieldCheck, Clock, Award, Users, ArrowRight, Phone, MessageCircle, HeartPulse, Sparkles, MapPin, BadgeCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="container relative py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"><BadgeCheck className="h-3.5 w-3.5 mr-1" />NABH-Aligned · Verified Nurses · 4.9★ by 12,000+ families</Badge>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]" style={{fontFamily:'Plus Jakarta Sans'}}>
              Premium <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Home Healthcare</span><br />
              trusted by families across India
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              24/7 home nursing, elder care, ICU setup at home, physiotherapy, doctor visits & more — delivered by verified professionals in 8 cities.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#book"><Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white h-12 px-6 text-base font-semibold">Book a Care Visit <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
              <WhatsAppLink message="Hi Aanya Home Healthcare, I'd like a free consultation.">
                <Button size="lg" variant="outline" className="h-12 px-6 text-base font-semibold border-2"><MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />WhatsApp Us</Button>
              </WhatsAppLink>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
              {[{n:'12,000+',l:'Families served'},{n:'500+',l:'Verified professionals'},{n:'8 cities',l:'Pan-India presence'}].map(s => (
                <div key={s.l} className="rounded-xl border bg-card/60 backdrop-blur px-4 py-3">
                  <div className="text-2xl font-extrabold text-primary">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border shadow-2xl aspect-[4/5] max-w-md mx-auto">
              <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800" alt="Home healthcare nurse" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 backdrop-blur p-4 flex items-center gap-3 shadow-xl">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <div className="text-sm font-semibold">Care within 2 hours</div>
                  <div className="text-xs text-muted-foreground">Free consultation · No advance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y bg-card/50">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            {i:ShieldCheck,t:'Background-verified',s:'All caregivers'},
            {i:Clock,t:'24/7 Availability',s:'365 days a year'},
            {i:Award,t:'Trained by AIIMS-linked mentors',s:'Continuous upskilling'},
            {i:HeartPulse,t:'Doctor-on-call',s:'Every case supervised'},
          ].map(({i:Ic,t,s}) => (
            <div key={t} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Ic className="h-5 w-5 text-primary" /></div>
              <div><div className="font-semibold">{t}</div><div className="text-xs text-muted-foreground">{s}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="border-primary/30 text-primary">Our Services</Badge>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Comprehensive home healthcare, one platform</h2>
          <p className="mt-3 text-muted-foreground">From basic nurse visits to full ICU setup at home — we cover every step of your family's care journey.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(s => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              <Card className="card-hover p-5 h-full border-2 border-transparent group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-secondary group-hover:text-white transition">
                    <ServiceIcon name={s.icon} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base group-hover:text-primary transition">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.short}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600">From ₹{s.startingPrice}/{s.unit}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/40 border-y">
        <div className="container py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="outline" className="border-primary/30 text-primary">How it works</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Care starts in 3 simple steps</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {n:'01',t:'Tell us your needs',d:'Book online or WhatsApp us. Our care coordinator calls within 15 minutes.'},
              {n:'02',t:'Personalised care plan',d:'A doctor reviews the case and assigns the right nurse / caregiver / equipment.'},
              {n:'03',t:'Care at home',d:'Verified professional arrives within 2–4 hours. Doctor supervises throughout.'},
            ].map(s => (
              <div key={s.n} className="rounded-2xl bg-card border p-6 relative overflow-hidden">
                <div className="text-6xl font-extrabold text-primary/10 absolute -top-2 right-4">{s.n}</div>
                <h3 className="font-bold text-lg">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="container py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <Badge variant="outline" className="border-primary/30 text-primary">Cities we serve</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Care that reaches your city</h2>
          </div>
          <p className="text-muted-foreground max-w-md">Rapidly expanding across metros & tier-2 cities in India.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {CITIES.map(c => (
            <Link key={c.slug} href={`/cities/${c.slug}`}>
              <Card className="card-hover p-5 border-2 border-transparent group">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-bold text-lg group-hover:text-primary">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.state} · {c.population} population</p>
                <p className="text-sm mt-2 text-muted-foreground line-clamp-1">{c.tagline}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/40 border-y">
        <div className="container py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="outline" className="border-primary/30 text-primary">Testimonials</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Loved by 12,000+ families</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="p-6">
                <div className="flex gap-1">{[...Array(t.rating)].map((_,i)=><Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="mt-3 text-sm leading-relaxed">“{t.text}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                  <div><div className="font-semibold text-sm">{t.name}</div><div className="text-xs text-muted-foreground">{t.city}</div></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD FORM CTA */}
      <section id="book" className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">Free consultation</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Book a free care consultation</h2>
            <p className="mt-3 text-muted-foreground">Share your requirement. Our care coordinator will call you in 15 minutes with a personalised plan & transparent pricing.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {['Free doctor-led case review','Transparent pricing, no hidden fees','Care starts within 2–4 hours','Free replacement of caregiver in 24h'].map(x => (
                <li key={x} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />{x}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border p-4 bg-card flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"><MessageCircle className="h-5 w-5" /></div>
              <div className="text-sm">
                <div className="font-semibold">Prefer WhatsApp?</div>
                <WhatsAppLink className="text-primary hover:underline">Chat with our team on WhatsApp →</WhatsAppLink>
              </div>
            </div>
          </div>
          <div><LeadForm /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/40 border-y">
        <div className="container py-16 md:py-20 max-w-3xl">
          <div className="text-center">
            <Badge variant="outline" className="border-primary/30 text-primary">FAQs</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map((f,i) => (
              <AccordionItem value={`f${i}`} key={i}>
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
