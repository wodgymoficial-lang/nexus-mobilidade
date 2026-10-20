import { NextResponse } from 'next/server';
import { sameOrigin, secureSessionCookie } from '@/lib/auth';
import { SESSION_COOKIE } from '@/lib/security';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'strict', secure: secureSessionCookie(), path: '/', maxAge: 0 });
  return response;
}
