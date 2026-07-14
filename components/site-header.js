'use client';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Phone, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SERVICES, CITIES } from '@/lib/data';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+917903178064';
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 glass">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <Link href="/" className="px-3 py-2 rounded-md hover:bg-accent">Home</Link>
          <div className="relative group">
            <button className="px-3 py-2 rounded-md hover:bg-accent inline-flex items-center gap-1">Services <ChevronDown className="h-3.5 w-3.5" /></button>
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <div className="w-[560px] grid grid-cols-2 gap-1 p-3 rounded-2xl border bg-popover shadow-xl">
                {SERVICES.slice(0,12).map(s => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="px-3 py-2 rounded-md hover:bg-accent text-sm">
                    {s.name}
                  </Link>
                ))}
                <Link href="/services" className="col-span-2 mt-1 text-center text-sm font-semibold text-primary hover:underline">View all 17 services →</Link>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="px-3 py-2 rounded-md hover:bg-accent inline-flex items-center gap-1">Cities <ChevronDown className="h-3.5 w-3.5" /></button>
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <div className="w-64 grid grid-cols-2 gap-1 p-3 rounded-2xl border bg-popover shadow-xl">
                {CITIES.map(c => (
                  <Link key={c.slug} href={`/cities/${c.slug}`} className="px-3 py-2 rounded-md hover:bg-accent text-sm">{c.name}</Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/about" className="px-3 py-2 rounded-md hover:bg-accent">About</Link>
          <Link href="/blog" className="px-3 py-2 rounded-md hover:bg-accent">Blog</Link>
          <Link href="/careers" className="px-3 py-2 rounded-md hover:bg-accent">Careers</Link>
          <Link href="/contact" className="px-3 py-2 rounded-md hover:bg-accent">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${phone}`} className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <Phone className="h-4 w-4" /> {phone}
          </a>
          <ThemeToggle />
          <Link href="/contact" className="hidden sm:block">
            <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95">Book Now</Button>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-3 space-y-1 text-sm font-medium">
            <Link href="/" className="block py-2">Home</Link>
            <Link href="/services" className="block py-2">All Services</Link>
            <Link href="/cities/pune" className="block py-2">Cities</Link>
            <Link href="/about" className="block py-2">About</Link>
            <Link href="/blog" className="block py-2">Blog</Link>
            <Link href="/careers" className="block py-2">Careers</Link>
            <Link href="/contact" className="block py-2">Contact</Link>
            <Link href="/admin" className="block py-2 text-primary">Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
