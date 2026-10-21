import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { defaultWhatsapp } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let settings = defaultWhatsapp;
  try {
    const stored = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (stored) settings = { phone: stored.whatsappPhone, message: stored.whatsappMessage };
  } catch { /* O contato padrão continua disponível se o banco estiver indisponível. */ }
  return NextResponse.json(settings, { headers: { 'Cache-Control': 'no-store' } });
}
