import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: {
    default: 'Aanya Home Healthcare | Nursing, Elder Care & ICU at Home',
    template: '%s | Aanya Home Healthcare',
  },
  description: 'India\u2019s trusted home healthcare \u2014 24/7 home nursing, elder care, ICU setup at home, physiotherapy, doctor at home & more across Pune, Mumbai, Bangalore, Hyderabad, Delhi, Kolkata, Ranchi & Bhubaneswar.',
  keywords: ['home nursing India', 'ICU at home', 'elder care', 'physiotherapy at home', 'doctor at home', 'Aanya Home Healthcare', 'home healthcare Pune', 'home healthcare Mumbai', 'home healthcare Bangalore', 'home healthcare Kolkata', 'home healthcare Ranchi'],
  openGraph: {
    title: 'Aanya Home Healthcare',
    description: 'Premium home healthcare across India \u2014 nursing, elder care, ICU at home, physiotherapy & more.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
