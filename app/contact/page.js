import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB, WhatsAppLink } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { LeadForm } from '@/components/lead-form';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const metadata = { title: 'Contact Aanya Home Healthcare' };

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+917903178064';
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero border-b">
        <div className="container py-14 text-center">
          <Badge variant="outline" className="border-primary/30 text-primary">Get in touch</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>We're here to help — 24/7</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Call, WhatsApp or fill the form. A care coordinator will get back within 15 minutes.</p>
        </div>
      </section>
      <section className="container py-14 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <a href={`tel:${phone}`} className="flex items-start gap-4 rounded-2xl border p-5 hover:border-primary/50 hover:bg-accent/30 transition">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Phone className="h-6 w-6" /></div>
            <div><div className="font-semibold">Call us</div><div className="text-primary">{phone}</div><div className="text-xs text-muted-foreground">Available 24 × 7</div></div>
          </a>
          <WhatsAppLink className="block">
            <div className="flex items-start gap-4 rounded-2xl border p-5 hover:border-emerald-500/50 hover:bg-accent/30 transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><MessageCircle className="h-6 w-6" /></div>
              <div><div className="font-semibold">WhatsApp</div><div className="text-emerald-600">Chat with us instantly</div><div className="text-xs text-muted-foreground">Fastest response</div></div>
            </div>
          </WhatsAppLink>
          <a href="mailto:care@aanyahomehealthcare.com" className="flex items-start gap-4 rounded-2xl border p-5 hover:border-primary/50 hover:bg-accent/30 transition">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Mail className="h-6 w-6" /></div>
            <div><div className="font-semibold">Email</div><div className="text-primary">care@aanyahomehealthcare.com</div></div>
          </a>
          <div className="flex items-start gap-4 rounded-2xl border p-5">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><MapPin className="h-6 w-6" /></div>
            <div><div className="font-semibold">Service Locations</div><div className="text-sm text-muted-foreground">Pune · Mumbai · Bangalore · Hyderabad · Delhi NCR · Kolkata · Ranchi · Bhubaneswar</div></div>
          </div>
        </div>
        <LeadForm />
      </section>
      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
