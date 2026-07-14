import { Logo } from './logo';
import Link from 'next/link';
import { SERVICES, CITIES } from '@/lib/data';
import { Mail, MapPin, Phone } from 'lucide-react';

export function SiteFooter() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+917903178064';
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Premium home healthcare across India — nursing, elder care, ICU at home, physiotherapy & more.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />{phone}</a>
            <a href="mailto:care@aanyahomehealthcare.com" className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" />care@aanyahomehealthcare.com</a>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />Pan-India Service</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Top Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {SERVICES.slice(0,8).map(s => <li key={s.slug}><Link href={`/services/${s.slug}`} className="hover:text-primary">{s.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Cities</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CITIES.map(c => <li key={c.slug}><Link href={`/cities/${c.slug}`} className="hover:text-primary">Home Care {c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-primary">Admin Portal</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Aanya Home Healthcare. All rights reserved.</span>
          <span>Made with care in India ❤️</span>
        </div>
      </div>
    </footer>
  );
}
