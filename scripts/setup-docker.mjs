import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

if (existsSync('.env.docker')) {
  console.log('.env.docker já existe. Configurações e credenciais preservadas.');
  process.exit(0);
}
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const replacements = {
  __MYSQL_PASSWORD__: randomBytes(24).toString('hex'),
  __MYSQL_ROOT_PASSWORD__: randomBytes(32).toString('hex'),
  __AUTH_SECRET__: randomBytes(48).toString('hex'),
  __ENCRYPTION_KEY__: randomBytes(32).toString('hex'),
  __ADMIN_PASSWORD_HASH__: `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
};
let env = readFileSync('.env.docker.example', 'utf8');
for (const [token, value] of Object.entries(replacements)) env = env.replaceAll(token, value);
writeFileSync('.env.docker', env, { mode: 0o600 });
writeFileSync('.admin-access.docker.local.txt', `ACESSO DOCKER LOCAL — não compartilhar nem versionar\n\nURL: http://127.0.0.1:3000/admin\nE-mail: admin@localhost\nSenha: ${password}\n\nAs credenciais são independentes do ambiente de desenvolvimento.\nTroca: node scripts/admin-password.mjs --env-file .env.docker\nDepois, recrie o serviço app para aplicar a nova senha.\n`, { mode: 0o600 });
console.log('.env.docker e .admin-access.docker.local.txt criados. Credenciais não exibidas no terminal.');
