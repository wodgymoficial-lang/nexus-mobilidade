import { z } from 'zod';

export const interests = ['Plataforma compartilhada', 'Plataforma dedicada', 'Código-fonte', 'Franquia', 'Preciso de orientação'] as const;
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().min(8).max(30).regex(/^[+\d\s().-]+$/),
  company: z.string().trim().max(160).optional().default(''),
  city: z.string().trim().min(2).max(160),
  interest: z.enum(interests),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  website: z.string().max(0).optional()
});

export const smtpSchema = z.object({
  host: z.string().trim().min(1).max(255).regex(/^[a-zA-Z0-9.-]+$/),
  port: z.coerce.number().int().min(1).max(65535),
  secure: z.boolean(),
  username: z.string().trim().min(1).max(255),
  password: z.string().max(1000).optional().default(''),
  fromName: z.string().trim().min(1).max(120).regex(/^[^\r\n]+$/),
  fromEmail: z.email().max(254),
  recipientEmail: z.email().max(254)
}).refine(v => v.port !== 465 || v.secure, { message: 'Na porta 465, ative a conexão TLS direta.', path: ['secure'] });
