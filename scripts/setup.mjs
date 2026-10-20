import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('.env');
if (existsSync(path)) {
  console.log('.env já existe. Configurações preservadas.');
  process.exit(0);
}
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
const env = readFileSync('.env.example', 'utf8')
  .replace('AUTH_SECRET=""', `AUTH_SECRET="${randomBytes(48).toString('hex')}"`)
  .replace('ENCRYPTION_KEY=""', `ENCRYPTION_KEY="${randomBytes(32).toString('hex')}"`)
  .replace('ADMIN_PASSWORD_HASH=""', `ADMIN_PASSWORD_HASH="${hash}"`);
writeFileSync(path, env, { mode: 0o600 });
writeFileSync('.admin-access.local.txt', `ACESSO LOCAL — não compartilhar nem versionar\n\nURL: http://127.0.0.1:3000/admin\nE-mail: admin@localhost\nSenha: ${password}\n\nAltere a senha com npm run admin:password.\nConfigure o MySQL no .env e execute npm run db:migrate.\n`, { mode: 0o600 });
console.log('.env e .admin-access.local.txt criados. Credenciais não exibidas no terminal.');
