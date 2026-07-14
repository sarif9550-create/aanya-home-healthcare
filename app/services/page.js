import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { ServiceIcon } from '@/components/service-icon';
import { SERVICES } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'All Home Healthcare Services in India' };

export default function ServicesIndex() {
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero border-b">
        <div className="container py-14 text-center">
          <Badge variant="outline" className="border-primary/30 text-primary">Our Services</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>All Home Healthcare Services</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">17 medical & non-medical care services delivered at your home by trained, background-verified professionals.</p>
        </div>
      </section>
      <section className="container py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map(s => (
          <Link key={s.slug} href={`/services/${s.slug}`}>
            <Card className="card-hover p-5 h-full border-2 border-transparent">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary flex items-center justify-center"><ServiceIcon name={s.icon} /></div>
                <div className="flex-1">
                  <h3 className="font-bold">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.short}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600">From ₹{s.startingPrice}/{s.unit}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
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
