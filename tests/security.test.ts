import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, scryptSync } from 'node:crypto';
import { createSession, verifySession, verifyPassword, encrypt, decrypt, SESSION_SECONDS } from '../src/lib/security';
import { leadSchema, smtpSchema } from '../src/lib/validation';
import { allowRequest } from '../src/lib/rate-limit';

process.env.AUTH_SECRET = randomBytes(48).toString('hex');
process.env.ENCRYPTION_KEY = randomBytes(32).toString('hex');
process.env.ADMIN_PASSWORD_HASH = 'test-fingerprint';

test('sessions reject tampering, expiration and password rotation', () => {
  const now = Date.now(); const token = createSession(now);
  assert.equal(verifySession(token, now), true);
  assert.equal(verifySession(`${token}x`, now), false);
  assert.equal(verifySession(token, now + SESSION_SECONDS * 1000 + 1), false);
  assert.equal(verifySession(undefined), false);
  process.env.ADMIN_PASSWORD_HASH = 'rotated';
  assert.equal(verifySession(token, now), false);
});
test('password verification checks scrypt hashes and rejects malformed hashes', () => {
  const salt = randomBytes(16).toString('hex');
  const hash = `${salt}:${scryptSync('a-long-private-password', salt, 64).toString('hex')}`;
  assert.equal(verifyPassword('a-long-private-password', hash), true);
  assert.equal(verifyPassword('wrong', hash), false);
  assert.equal(verifyPassword('wrong', 'broken'), false);
});
test('SMTP encryption is authenticated and has a fresh IV for every write', () => {
  const a = encrypt('SMTP credential'); const b = encrypt('SMTP credential');
  assert.notEqual(a, b); assert.equal(decrypt(a), 'SMTP credential');
  const parts = a.split('.'); parts[2] = Buffer.from('tampered').toString('base64');
  assert.throws(() => decrypt(parts.join('.')));
});
test('lead intake requires consent and rejects honeypot submissions', () => {
  const lead = { name: 'Teste Cliente', email: 'teste@example.com', phone: '(11) 99999-9999', city: 'Cosmópolis, SP', interest: 'Código-fonte', message: 'Quero conhecer a plataforma.', consent: true };
  assert.equal(leadSchema.safeParse(lead).success, true);
  assert.equal(leadSchema.safeParse({ ...lead, consent: false }).success, false);
  assert.equal(leadSchema.safeParse({ ...lead, website: 'spam' }).success, false);
  assert.equal(leadSchema.safeParse({ ...lead, interest: 'invalid' }).success, false);
});
test('SMTP validation enforces a usable TLS mode and prevents header injection', () => {
  const smtp = { host: 'smtp.example.com', port: 465, secure: true, username: 'user', password: 'secret', fromName: 'Nexus', fromEmail: 'site@example.com', recipientEmail: 'team@example.com' };
  assert.equal(smtpSchema.safeParse(smtp).success, true);
  assert.equal(smtpSchema.safeParse({ ...smtp, secure: false }).success, false);
  assert.equal(smtpSchema.safeParse({ ...smtp, fromName: 'Nexus\r\nBcc: other@example.com' }).success, false);
});
test('rate limiter rejects bursts and resets after its time window', () => {
  assert.equal(allowRequest('unit-test', 2, 100, 1000), true);
  assert.equal(allowRequest('unit-test', 2, 100, 1001), true);
  assert.equal(allowRequest('unit-test', 2, 100, 1002), false);
  assert.equal(allowRequest('unit-test', 2, 100, 1101), true);
});
