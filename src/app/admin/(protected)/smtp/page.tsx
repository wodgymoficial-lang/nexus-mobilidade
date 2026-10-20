import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { DatabaseAlert } from '@/components/admin/database-alert';
import { SmtpForm, type SmtpFormData } from '@/components/admin/smtp-form';

export default async function SmtpPage() {
  await requireAdmin();
  let available = true; let initial: SmtpFormData | null = null;
  try {
    const saved = await db.smtpSettings.findUnique({ where: { id: 1 } });
    if (saved) initial = { host: saved.host, port: saved.port, secure: saved.secure, username: saved.username, fromName: saved.fromName, fromEmail: saved.fromEmail, recipientEmail: saved.recipientEmail, hasPassword: !!saved.passwordEncrypted };
  } catch { available = false; }
  return <><div className="admin-title"><div><h1>Configuração SMTP</h1><p>Conecte o formulário comercial ao e-mail da sua equipe.</p></div></div>{!available && <DatabaseAlert/>}<SmtpForm initial={initial} available={available}/></>;
}
