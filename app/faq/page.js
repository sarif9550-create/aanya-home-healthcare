import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppFAB } from '@/components/whatsapp-button';
import { ChatWidget } from '@/components/chat-widget';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQS } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'FAQ' };

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <section className="gradient-hero border-b">
        <div className="container py-14 text-center max-w-3xl">
          <Badge variant="outline" className="border-primary/30 text-primary">FAQ</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold" style={{fontFamily:'Plus Jakarta Sans'}}>Frequently asked questions</h1>
        </div>
      </section>
      <section className="container py-14 max-w-3xl">
        <Accordion type="single" collapsible>
          {FAQS.map((f,i) => (
            <AccordionItem value={`f${i}`} key={i}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <SiteFooter />
      <WhatsAppFAB />
      <ChatWidget />
    </>
  );
}
