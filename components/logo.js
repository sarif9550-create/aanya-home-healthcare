import { HeartPulse } from 'lucide-react';
import Link from 'next/link';

export function Logo({ compact = false }) {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition">
          <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-extrabold tracking-tight text-[15px] sm:text-base" style={{fontFamily:'Plus Jakarta Sans'}}>
            Aanya <span className="text-primary">Home</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Healthcare</div>
        </div>
      )}
    </Link>
  );
}
