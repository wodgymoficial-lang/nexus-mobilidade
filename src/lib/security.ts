import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'nexus_session';
export const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET não configurado.');
  return value;
}

export function verifyPassword(password: string, encoded: string): boolean {
  try {
    const [salt, hash] = encoded.split(':');
    if (!salt || !/^[a-f0-9]{128}$/i.test(hash)) return false;
    return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, 'hex'));
  } catch { return false; }
}

export function createSession(now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ exp: now + SESSION_SECONDS * 1000, nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

function signature(payload: string) {
  return createHmac('sha256', secret()).update(payload).update(process.env.ADMIN_PASSWORD_HASH ?? '').digest('base64url');
}

export function verifySession(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payload, mac] = parts;
    const expected = Buffer.from(signature(payload));
    const received = Buffer.from(mac);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof data.exp === 'number' && data.exp > now && data.exp <= now + SESSION_SECONDS * 1000;
  } catch { return false; }
}

function encryptionKey() {
  const value = process.env.ENCRYPTION_KEY ?? '';
  if (!/^[a-f0-9]{64}$/i.test(value)) throw new Error('ENCRYPTION_KEY não configurada.');
  return Buffer.from(value, 'hex');
}

export function encrypt(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(v => v.toString('base64')).join('.');
}

export function decrypt(value: string): string {
  const [iv, tag, data] = value.split('.').map(v => Buffer.from(v, 'base64'));
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
