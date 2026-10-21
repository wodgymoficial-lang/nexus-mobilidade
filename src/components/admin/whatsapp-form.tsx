'use client';
import { FormEvent, useState } from 'react';
import { ArrowUpRight, LoaderCircle, Save } from 'lucide-react';
import { whatsappLink, whatsappSchema } from '@/lib/whatsapp';

export function WhatsappForm({ initial, available }: { initial: { phone: string; message: string }; available: boolean }) {
  const [phone, setPhone] = useState(initial.phone);
  const [message, setMessage] = useState(initial.message);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', ok: false });
  const preview = whatsappSchema.safeParse({ phone, message });
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    if (!preview.success) { setFeedback({ text: preview.error.issues[0].message, ok: false }); return; }
    setBusy(true); setFeedback({ text: '', ok: false });
    try {
      const response = await fetch('/api/admin/whatsapp', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preview.data) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPhone(preview.data.phone); setMessage(preview.data.message);
      setFeedback({ text: 'WhatsApp atualizado. As alterações aparecem ao abrir ou recarregar o site.', ok: true });
    } catch (error) { setFeedback({ text: error instanceof Error ? error.message : 'Não foi possível salvar.', ok: false }); }
    finally { setBusy(false); }
  }
  return <div className="admin-smtp"><div className="admin-panel"><form className="smtp-form" onSubmit={save}><fieldset disabled={busy || !available}><legend>Conversa com o visitante</legend><label>Número do WhatsApp, com DDI e DDD<input name="phone" type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="551130902861" maxLength={40} required/></label><label>Mensagem inicial<textarea name="message" value={message} onChange={event => setMessage(event.target.value)} rows={5} maxLength={1000} required/></label><p className="whatsapp-form-help">Este texto fica preenchido no WhatsApp do visitante ao abrir a conversa. O visitante decide quando enviar; não é uma resposta automática da empresa.</p></fieldset>{feedback.text && <p role={feedback.ok ? 'status' : 'alert'} className={`form-message ${feedback.ok ? 'success' : 'error'}`}>{feedback.text}</p>}<div className="admin-actions"><button type="submit" disabled={busy || !available} className="button button-primary">{busy ? <LoaderCircle size={16} className="spin"/> : <Save size={16}/>}Salvar configuração</button></div></form></div><aside className="whatsapp-preview"><span className="eyebrow">PRÉVIA DA MENSAGEM</span><div className="whatsapp-preview-bubble">{message || 'Escreva a mensagem inicial.'}</div><p>Número: +{phone.replace(/\D/g, '')}</p>{preview.success && <a className="text-link" href={whatsappLink(preview.data.phone, preview.data.message)} target="_blank" rel="noopener noreferrer">Abrir prévia no WhatsApp <ArrowUpRight size={15}/></a>}<p>Salve a configuração para aplicar no site.</p></aside></div>;
}
