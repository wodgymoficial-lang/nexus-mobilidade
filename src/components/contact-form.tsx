'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { interests } from '@/lib/validation';

export function ContactForm({ interest }: { interest: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(form.entries()), consent: form.get('consent') === 'on' }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatus('success'); setMessage(data.message);
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Não foi possível enviar. Tente novamente.'); }
  }
  if (status === 'success') return <div className="contact-success" role="status"><CheckCircle2 size={48}/><h3>O primeiro passo está dado.</h3><p>{message}</p><button className="button button-outline" onClick={() => setStatus('idle')}>Enviar outro projeto <ArrowUpRight size={17}/></button></div>;
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row"><label>Seu nome<input name="name" autoComplete="name" placeholder="Como podemos te chamar?" required minLength={2} maxLength={120}/></label><label>E-mail profissional<input type="email" name="email" autoComplete="email" placeholder="voce@empresa.com.br" required maxLength={254}/></label></div>
    <div className="form-row"><label>Telefone / WhatsApp<input type="tel" name="phone" autoComplete="tel" placeholder="(11) 99999-9999" required minLength={8} maxLength={30}/></label><label>Cidade e estado<input name="city" autoComplete="address-level2" placeholder="Ex.: Cosmópolis, SP" required minLength={2} maxLength={160}/></label></div>
    <div className="form-row"><label>Empresa <span className="optional">opcional</span><input name="company" autoComplete="organization" placeholder="Nome da sua empresa" maxLength={160}/></label><label>O que você procura?<select key={interest} name="interest" defaultValue={interest || 'Preciso de orientação'} required>{interests.map(v => <option key={v}>{v}</option>)}</select></label></div>
    <label>Conte um pouco da sua ideia<textarea name="message" placeholder="Você quer começar do zero ou já tem uma operação?" required minLength={10} maxLength={4000} rows={3}/></label>
    <div className="honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="checkbox-label"><input type="checkbox" name="consent" required/><span>Autorizo o contato da Relph sobre meu projeto e li o <Link href="/privacidade">aviso de privacidade</Link>.</span></label>
    {status === 'error' && <p className="form-message error" role="alert">{message}</p>}
    <button className="button button-primary contact-submit" disabled={status === 'sending'} type="submit">{status === 'sending' ? <><LoaderCircle className="spin" size={18}/> Enviando projeto…</> : <>Vamos conversar sobre seu projeto <ArrowUpRight size={19}/></>}</button>
    <p className="form-note">Sem compromisso. A proposta é construída a partir do seu momento.</p>
  </form>;
}
