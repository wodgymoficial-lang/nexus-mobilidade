import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultWhatsapp, whatsappLink, whatsappSchema } from '../src/lib/whatsapp';

test('WhatsApp preserves accents, line breaks and special characters in the prefilled message', () => {
  const message = 'Olá! Meu negócio: João & Cia.\nCidade: São Paulo?';
  const url = new URL(whatsappLink(defaultWhatsapp.phone, message));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/551130902861');
  assert.equal(url.searchParams.get('text'), message);
});
test('WhatsApp settings normalize international phone formatting and reject invalid or empty input', () => {
  const result = whatsappSchema.parse({ phone: '+55 (11) 3090-2861', message: ' Olá! ' });
  assert.equal(result.phone, '551130902861');
  assert.equal(result.message, 'Olá!');
  assert.equal(whatsappSchema.safeParse({ phone: 'javascript:alert(1)', message: 'Olá' }).success, false);
  assert.equal(whatsappSchema.safeParse({ phone: '123', message: 'Olá' }).success, false);
  assert.equal(whatsappSchema.safeParse({ phone: defaultWhatsapp.phone, message: '   ' }).success, false);
  assert.equal(whatsappSchema.safeParse({ phone: defaultWhatsapp.phone, message: 'x'.repeat(1001) }).success, false);
});
