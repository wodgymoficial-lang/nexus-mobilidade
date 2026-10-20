import { NextResponse } from 'next/server';
import { sameOrigin, secureSessionCookie } from '@/lib/auth';
import { allowRequest } from '@/lib/rate-limit';
import { createSession, SESSION_COOKIE, SESSION_SECONDS, verifyPassword } from '@/lib/security';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  if (!allowRequest('admin-login', 8, 15 * 60 * 1000)) return NextResponse.json({ error: 'Muitas tentativas. Aguarde 15 minutos.' }, { status: 429 });
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || password.length > 512) return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    const passwordValid = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? '');
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase() || !passwordValid) return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, createSession(), { httpOnly: true, secure: secureSessionCookie(), sameSite: 'strict', path: '/', maxAge: SESSION_SECONDS });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch { return NextResponse.json({ error: 'Não foi possível acessar. Confira a configuração do servidor.' }, { status: 500 }); }
}
