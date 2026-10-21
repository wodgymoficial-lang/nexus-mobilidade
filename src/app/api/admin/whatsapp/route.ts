import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin, sameOrigin } from '@/lib/auth';
import { whatsappSchema } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  let input;
  try { input = whatsappSchema.safeParse(await request.json()); }
  catch { return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 }); }
  if (!input.success) return NextResponse.json({ error: input.error.issues[0]?.message ?? 'Confira os campos.' }, { status: 400 });
  const data = { whatsappPhone: input.data.phone, whatsappMessage: input.data.message };
  try {
    await db.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Não foi possível salvar. Confira a conexão com o banco de dados.' }, { status: 503 }); }
}
