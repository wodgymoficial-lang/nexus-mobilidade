'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, LoaderCircle, LockKeyhole } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setBusy(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.replace('/admin'); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível entrar.'); setBusy(false); }
  }
  return <><form className="login-form" onSubmit={submit}><label>E-mail administrativo<input type="email" name="email" autoComplete="username" placeholder="Seu e-mail de acesso" required maxLength={254}/></label><label>Senha<input type="password" name="password" autoComplete="current-password" placeholder="Sua senha" required maxLength={512}/></label>{error && <p className="form-message error" role="alert">{error}</p>}<button className="button button-primary" disabled={busy}>{busy ? <><LoaderCircle size={17} className="spin"/> Entrando…</> : <>Entrar na administração <ArrowUpRight size={18}/></>}</button></form><div className="login-lock"><LockKeyhole size={12}/> Acesso restrito à equipe autorizada.</div></>;
}
