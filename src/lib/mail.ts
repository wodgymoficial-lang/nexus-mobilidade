import nodemailer from 'nodemailer';
import type { SmtpSettings, Lead } from '@prisma/client';
import { decrypt } from './security';

export function transport(settings: SmtpSettings) {
  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    requireTLS: !settings.secure,
    auth: { user: settings.username, pass: decrypt(settings.passwordEncrypted) },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    tls: { minVersion: 'TLSv1.2' }
  });
}

export async function notifyLead(settings: SmtpSettings, lead: Lead) {
  return transport(settings).sendMail({
    from: { name: settings.fromName, address: settings.fromEmail },
    to: settings.recipientEmail,
    replyTo: lead.email,
    subject: `Novo interesse: ${lead.interest} | Nexus Mobilidade`,
    text: `Novo contato comercial\n\nNome: ${lead.name}\nE-mail: ${lead.email}\nTelefone: ${lead.phone}\nEmpresa: ${lead.company || 'Não informada'}\nCidade: ${lead.city}\nInteresse: ${lead.interest}\n\n${lead.message}\n\nRegistro: ${lead.id}`
  });
}
