import Link from 'next/link';
import { ArrowUpRight, Inbox, Mail, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { DatabaseAlert } from '@/components/admin/database-alert';

export default async function AdminPage() {
  await requireAdmin();
  let available = true;
  let count = 0; let pending = 0; let configured = false;
  try { [count, pending, configured] = await Promise.all([db.lead.count(), db.lead.count({ where: { emailSent: false } }), db.smtpSettings.count().then(n => n > 0)]); } catch { available = false; }
  return <><div className="admin-title"><div><h1>Visão geral</h1><p>As conexões do seu site começam aqui.</p></div></div>{!available && <DatabaseAlert/>}<div className="admin-stats"><div className="admin-stat"><Users className="stat-icon" size={20}/><span>Contatos recebidos</span><strong>{available ? count : '—'}</strong><small>Projetos registrados no site</small></div><div className="admin-stat"><Inbox className="stat-icon" size={20}/><span>Notificações pendentes</span><strong>{available ? pending : '—'}</strong><small>Contatos ainda sem e-mail enviado</small></div><div className="admin-stat"><Mail className="stat-icon" size={20}/><span>Canal de e-mail</span><strong style={{ fontSize: 20 }}>{!available ? 'Indisponível' : configured ? 'Configurado' : 'A configurar'}</strong><small>Servidor SMTP do site</small></div></div><div className="admin-panel"><h2>Configuração de e-mail</h2><p>Defina o servidor SMTP e o destinatário dos contatos comerciais. Depois, envie um e-mail de teste para conferir a conexão.</p><Link className="button button-primary" style={{ marginTop: 22 }} href="/admin/smtp">Configurar SMTP <ArrowUpRight size={16}/></Link></div><div className="admin-panel"><h2>Projetos recebidos</h2><p>Acompanhe as solicitações enviadas pelo formulário, incluindo modalidade de interesse, cidade e dados para retorno.</p><Link className="text-link" style={{ marginTop: 22 }} href="/admin/contatos">Ver contatos <ArrowUpRight size={16}/></Link></div></>;
}
