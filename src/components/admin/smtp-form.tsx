'use client';
import { FormEvent, useState } from 'react';
import { LoaderCircle, Save, Send, ShieldCheck } from 'lucide-react';

export type SmtpFormData = { host: string; port: number; secure: boolean; username: string; fromName: string; fromEmail: string; recipientEmail: string; hasPassword: boolean };
export function SmtpForm({ initial, available }: { initial: SmtpFormData | null; available: boolean }) {
  const [secure, setSecure] = useState(initial?.secure ?? false);
  const [busy, setBusy] = useState<'save' | 'test' | null>(null);
  const [feedback, setFeedback] = useState({ message: '', ok: false });
  const [saved, setSaved] = useState(!!initial);
  const [dirty, setDirty] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy('save'); setFeedback({ message: '', ok: false });
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/admin/smtp', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, secure }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSaved(true); setDirty(false);
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement; passwordInput.value = '';
      setFeedback({ message: 'Configuração SMTP salva. Você já pode enviar um teste.', ok: true });
    } catch (error) { setFeedback({ message: error instanceof Error ? error.message : 'Falha ao salvar.', ok: false }); }
    finally { setBusy(null); }
  }
  async function test() {
    setBusy('test'); setFeedback({ message: '', ok: false });
    try {
      const response = await fetch('/api/admin/smtp/test', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setFeedback({ message: result.message, ok: true });
    } catch (error) { setFeedback({ message: error instanceof Error ? error.message : 'Falha no teste.', ok: false }); }
    finally { setBusy(null); }
  }
  return <div className="admin-smtp"><div className="admin-panel"><form className="smtp-form" onSubmit={save} onChange={() => setDirty(true)}><fieldset disabled={!!busy || !available}><legend>Conexão com o servidor</legend><div className="form-row"><label>Servidor SMTP<input name="host" placeholder="smtp.seuprovedor.com.br" defaultValue={initial?.host} required maxLength={255}/></label><label>Porta<input name="port" type="number" min={1} max={65535} defaultValue={initial?.port ?? 587} required/></label></div><label className="checkbox-label"><input type="checkbox" checked={secure} onChange={e => setSecure(e.target.checked)}/><span>Usar TLS direto (normalmente porta 465). Desmarcado: STARTTLS obrigatório.</span></label><div className="form-row"><label>Usuário SMTP<input name="username" autoComplete="off" defaultValue={initial?.username} placeholder="usuario@empresa.com.br" required maxLength={255}/></label><label>Senha SMTP<input name="password" type="password" autoComplete="new-password" placeholder={saved ? 'Deixe vazio para manter a senha' : 'Senha ou senha de aplicativo'} required={!saved} maxLength={1000}/></label></div></fieldset><fieldset disabled={!!busy || !available}><legend>Remetente e recebimento</legend><label>Nome do remetente<input name="fromName" defaultValue={initial?.fromName ?? 'Relph Nexus Mobilidade'} required maxLength={120}/></label><div className="form-row"><label>E-mail do remetente<input name="fromEmail" type="email" defaultValue={initial?.fromEmail} placeholder="site@suaempresa.com.br" required maxLength={254}/></label><label>Receber contatos neste e-mail<input name="recipientEmail" type="email" defaultValue={initial?.recipientEmail} placeholder="comercial@suaempresa.com.br" required maxLength={254}/></label></div></fieldset>{feedback.message && <p className={`form-message ${feedback.ok ? 'success' : 'error'}`} role={feedback.ok ? 'status' : 'alert'}>{feedback.message}</p>}<div className="admin-actions"><button type="submit" className="button button-primary" disabled={!!busy || !available}>{busy === 'save' ? <LoaderCircle size={16} className="spin"/> : <Save size={16}/>}Salvar configuração</button><button type="button" className="button button-outline" disabled={!!busy || !saved || dirty || !available} onClick={test}>{busy === 'test' ? <LoaderCircle size={16} className="spin"/> : <Send size={16}/>}Enviar teste</button></div>{dirty && saved && <p className="form-note" style={{ textAlign: 'left' }}>Salve as alterações antes de enviar o teste.</p>}</form></div><aside className="smtp-help"><h3>Seu canal de contato, conectado.</h3><p>Os projetos enviados no site ficam registrados no banco e são encaminhados ao destinatário configurado aqui.</p><p><strong>Porta 587:</strong> STARTTLS obrigatório.<br/><strong>Porta 465:</strong> marque TLS direto.</p><p>Alguns provedores exigem uma senha de aplicativo em vez da senha de acesso ao e-mail.</p><hr/><div className="help-lock"><ShieldCheck size={17}/><p>A senha SMTP é criptografada com AES-256-GCM e não é devolvida ao navegador.</p></div><p>O teste usa a configuração salva e envia somente ao destinatário cadastrado.</p></aside></div>;
}
