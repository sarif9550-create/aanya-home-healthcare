import { HeartPulse, Stethoscope, Activity, Users, HandHeart, Baby, Syringe, Wind, Brain, Sparkles, Bed, Ribbon, ShieldPlus } from 'lucide-react';

const MAP = { HeartPulse, Stethoscope, Activity, Users, HandHeart, Baby, Syringe, Wind, Brain, Sparkles, Bed, Ribbon, ShieldPlus, Wheelchair: HeartPulse };

export function ServiceIcon({ name, className = 'h-6 w-6' }) {
  const I = MAP[name] || HeartPulse;
  return <I className={className} strokeWidth={2} />;
}
