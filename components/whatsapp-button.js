'use client';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFAB({ message = "Hi Aanya Home Healthcare, I'd like to know more about your services." }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917903178064';
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 transition"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.415-.545-.489-1.09-1.076-1.512-1.673-.398-.561-.075-.75.174-.983.135-.126.311-.302.402-.409.156-.183.219-.31.302-.484.083-.174.037-.36-.031-.522s-.719-1.633-.966-2.242c-.194-.5-.406-.446-.594-.446-.155 0-.331-.019-.508-.019a.987.987 0 0 0-.713.336c-.244.267-.929.9-.929 2.204s.951 2.564 1.084 2.744c.135.174 1.905 3.16 4.727 4.394 2.822 1.24 2.822.7 3.33.649.508-.05 1.678-.735 1.914-1.44.239-.7.239-1.31.166-1.42-.075-.104-.271-.176-.581-.311-.312-.132-1.808-.94-2.09-1.045m-2.906 7.09h-.019a9.869 9.869 0 0 1-4.755-1.212l-.34-.203-3.537.928.945-3.443-.221-.354a9.879 9.879 0 0 1-1.51-5.256c.002-5.462 4.462-9.907 9.939-9.907 2.654 0 5.147 1.038 7.021 2.919a9.85 9.85 0 0 1 2.909 7.014c-.002 5.462-4.462 9.514-9.933 9.514m8.412-18.322A11.815 11.815 0 0 0 16.205 2.5C9.647 2.5 4.303 7.844 4.3 14.4a11.8 11.8 0 0 0 1.588 5.92L4.199 26.5l6.335-1.66a11.865 11.865 0 0 0 5.667 1.44h.005c6.554 0 11.898-5.344 11.9-11.902A11.83 11.83 0 0 0 24.615 5.973"/>
      </svg>
    </a>
  );
}

export function WhatsAppLink({ message = 'Hi, I need home healthcare support.', className = '', children }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917903178064';
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  );
}
