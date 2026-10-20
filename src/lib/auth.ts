import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySession } from './security';

export async function isAdmin() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}

export function secureSessionCookie() {
  return process.env.APP_URL ? new URL(process.env.APP_URL).protocol === 'https:' : process.env.NODE_ENV === 'production';
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.APP_URL ? new URL(process.env.APP_URL).origin : new URL(request.url).origin;
  return origin === expected;
}
