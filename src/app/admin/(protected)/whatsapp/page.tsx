import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { defaultWhatsapp } from '@/lib/whatsapp';
import { DatabaseAlert } from '@/components/admin/database-alert';
import { WhatsappForm } from '@/components/admin/whatsapp-form';

export default async function WhatsappPage() {
  await requireAdmin();
  let available = true; let initial = defaultWhatsapp;
  try {
    const stored = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (stored) initial = { phone: stored.whatsappPhone, message: stored.whatsappMessage };
  } catch { available = false; }
  return <><div className="admin-title"><div><h1>WhatsApp</h1><p>Configure o número e a mensagem inicial do botão de contato.</p></div></div>{!available && <DatabaseAlert/>}<WhatsappForm initial={initial} available={available}/></>;
}
