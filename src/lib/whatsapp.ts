import { z } from 'zod';

export const defaultWhatsapp = {
  phone: '551130902861',
  message: 'Olá! Gostaria de conhecer a Nexus Mobilidade e saber como criar meu próprio aplicativo de mobilidade.'
};

export const whatsappSchema = z.object({
  phone: z.string().trim().max(40).regex(/^[+\d\s().-]+$/, 'Informe somente o número, com DDI e DDD.')
    .transform(value => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^[1-9]\d{7,14}$/, 'Informe um número válido com DDI e DDD, por exemplo 551130902861.')),
  message: z.string().trim().min(1, 'Escreva a mensagem inicial.').max(1000, 'A mensagem deve ter até 1.000 caracteres.')
});

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
