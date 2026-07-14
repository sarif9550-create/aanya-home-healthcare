import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, Users, Award, Target } from 'lucide-react';

export const metadata = { title: 'About Aanya Home Healthcare' };

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero border-b">
        <div className="container py-16 text-center max-w-3xl">
          <Badge variant="outline" className="border-primary/30 text-primary">About Us</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Bringing hospital-grade care <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">home</span></h1>
          <p className="mt-4 text-muted-foreground">Aanya Home Healthcare is India's fastest-growing home health company — combining trained clinicians, technology, and compassion to make premium care accessible.</p>
        </div>
      </section>
      <section className="container py-14 grid md:grid-cols-4 gap-6">
        {[{i:Users,n:'12,000+',l:'Families served'},{i:HeartPulse,n:'500+',l:'Care professionals'},{i:Award,n:'8 cities',l:'India presence'},{i:Target,n:'4.9★',l:'Family rating'}].map(({i:I,n,l}) => (
          <div key={l} className="rounded-2xl border bg-card p-6 text-center">
            <I className="h-8 w-8 text-primary mx-auto" />
            <div className="mt-3 text-3xl font-extrabold">{n}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{l}</div>
          </div>
        ))}
      </section>
      <section className="container pb-14 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Our Mission</h2>
          <p className="mt-3 text-muted-foreground">To make premium, hospital-grade healthcare accessible in every Indian home — combining trained clinicians, technology and empathy so families never have to choose between quality and comfort.</p>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Our Vision</h2>
          <p className="mt-3 text-muted-foreground">To be India's most trusted home healthcare brand, serving 1 million families by 2030 with a network of 25,000+ verified clinicians across 100+ cities.</p>
        </div>
      </section>
      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
