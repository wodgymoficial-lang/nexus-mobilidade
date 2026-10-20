import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sameOrigin } from '@/lib/auth';
import { allowRequest } from '@/lib/rate-limit';
import { leadSchema } from '@/lib/validation';
import { notifyLead } from '@/lib/mail';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  if (!allowRequest('contact-global', 60, 15 * 60 * 1000)) return NextResponse.json({ error: 'Recebemos muitas solicitações. Tente novamente em alguns minutos.' }, { status: 429 });
  let input;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return NextResponse.json({ error: 'Mensagem muito longa.' }, { status: 413 });
    input = leadSchema.safeParse(JSON.parse(raw));
  } catch { return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 }); }
  if (!input.success) return NextResponse.json({ error: 'Confira os campos e autorize o contato para continuar.' }, { status: 400 });
  const { consent: _consent, website: _website, ...data } = input.data;
  try {
    const lead = await db.lead.create({ data });
    try {
      const settings = await db.smtpSettings.findUnique({ where: { id: 1 } });
      if (settings) { await notifyLead(settings, lead); await db.lead.update({ where: { id: lead.id }, data: { emailSent: true } }); }
    } catch { console.error('Contato registrado; notificação SMTP pendente.'); }
    return NextResponse.json({ ok: true, message: 'Seu projeto foi registrado. Nossa equipe entrará em contato pelos dados informados.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Não foi possível registrar seu contato agora. Tente novamente mais tarde.' }, { status: 503 });
  }
}
