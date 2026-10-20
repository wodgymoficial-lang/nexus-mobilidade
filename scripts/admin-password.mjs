import { randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const optionIndex = process.argv.indexOf('--env-file');
const envFile = optionIndex === -1 ? '.env' : process.argv[optionIndex + 1];
if (!envFile || !['.env', '.env.docker'].includes(envFile)) {
  rl.close(); console.error('Use --env-file .env ou --env-file .env.docker.'); process.exit(1);
}
console.log('Defina a senha em um terminal privado. A entrada fica visível.');
const password = await rl.question('Nova senha administrativa (mínimo 12 caracteres): ');
rl.close();
if (password.length < 12) { console.error('Use pelo menos 12 caracteres.'); process.exit(1); }
const salt = randomBytes(16).toString('hex');
const hash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
const env = readFileSync(envFile, 'utf8');
if (!/^ADMIN_PASSWORD_HASH=.*$/m.test(env)) throw new Error('ADMIN_PASSWORD_HASH ausente no arquivo de ambiente.');
writeFileSync(envFile, env.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH="${hash}"`), { mode: 0o600 });
writeFileSync(envFile === '.env.docker' ? '.admin-access.docker.local.txt' : '.admin-access.local.txt', 'Senha alterada. Use a nova senha definida no terminal.\n', { mode: 0o600 });
console.log('Senha atualizada. Reinicie o servidor; sessões anteriores serão invalidadas.');
