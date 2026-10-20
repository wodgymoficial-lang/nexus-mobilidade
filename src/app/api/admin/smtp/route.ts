import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin, sameOrigin } from '@/lib/auth';
import { encrypt } from '@/lib/security';
import { smtpSchema } from '@/lib/validation';

export const runtime = 'nodejs';
export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  try {
    const parsed = smtpSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Confira os campos.' }, { status: 400 });
    const { password, ...data } = parsed.data;
    const previous = await db.smtpSettings.findUnique({ where: { id: 1 } });
    if (!password && !previous) return NextResponse.json({ error: 'Informe a senha SMTP na primeira configuração.' }, { status: 400 });
    const passwordEncrypted = password ? encrypt(password) : previous!.passwordEncrypted;
    await db.smtpSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data, passwordEncrypted }, update: { ...data, passwordEncrypted } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Não foi possível salvar. Verifique o MySQL e a chave de criptografia no servidor.' }, { status: 503 }); }
}
