import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin, sameOrigin } from '@/lib/auth';
import { allowRequest } from '@/lib/rate-limit';
import { transport } from '@/lib/mail';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  if (!allowRequest('smtp-test', 5, 60_000)) return NextResponse.json({ error: 'Aguarde um minuto antes de testar novamente.' }, { status: 429 });
  try {
    const settings = await db.smtpSettings.findUnique({ where: { id: 1 } });
    if (!settings) return NextResponse.json({ error: 'Salve a configuração antes de testar.' }, { status: 400 });
    await transport(settings).sendMail({ from: { name: settings.fromName, address: settings.fromEmail }, to: settings.recipientEmail, subject: 'Teste SMTP | Relph Nexus Mobilidade', text: 'A configuração SMTP da Nexus Mobilidade está funcionando. Este e-mail foi solicitado pela área administrativa.' });
    return NextResponse.json({ ok: true, message: 'Servidor SMTP aceitou o e-mail de teste. Confira a caixa de entrada e o spam.' });
  } catch { return NextResponse.json({ error: 'Falha no teste. Confira banco, servidor SMTP, porta, TLS e credenciais.' }, { status: 502 }); }
}
