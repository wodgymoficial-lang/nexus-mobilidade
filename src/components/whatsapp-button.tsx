'use client';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { defaultWhatsapp, whatsappLink, whatsappSchema } from '@/lib/whatsapp';

export function WhatsappButton() {
  const [settings, setSettings] = useState(defaultWhatsapp);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/whatsapp', { cache: 'no-store', signal: controller.signal })
      .then(async response => { if (!response.ok) return; const result = whatsappSchema.safeParse(await response.json()); if (result.success) setSettings(result.data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return <a className="whatsapp-button" href={whatsappLink(settings.phone, settings.message)} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Nexus Mobilidade pelo WhatsApp"><MessageCircle size={25} strokeWidth={1.8}/><span>Fale pelo WhatsApp</span></a>;
}
