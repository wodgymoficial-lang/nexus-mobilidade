import Link from 'next/link';
import { Inbox } from 'lucide-react';
import type { Lead } from '@prisma/client';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { DatabaseAlert } from '@/components/admin/database-alert';

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  await requireAdmin();
  const { pagina } = await searchParams;
  const page = Math.min(10000, Math.max(1, Number.parseInt(pagina ?? '1', 10) || 1));
  let available = true; let leads: Lead[] = []; let total = 0;
  try { [leads, total] = await Promise.all([db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 20, skip: (page - 1) * 20 }), db.lead.count()]); } catch { available = false; }
  const format = (date: Date) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(date);
  return <><div className="admin-title"><div><h1>Contatos recebidos</h1><p>Projetos, ideias e novas oportunidades de mobilidade.</p></div></div>{!available && <DatabaseAlert/>}<div className="admin-panel">{!leads.length ? <div className="admin-empty"><Inbox size={34}/><h3>{available ? 'O próximo negócio está a caminho.' : 'Aguardando conexão com o banco.'}</h3><p>{available ? 'As solicitações enviadas pelo formulário do site aparecerão aqui.' : 'Os contatos serão carregados quando a conexão com o MySQL estiver disponível.'}</p></div> : <div className="table-scroll"><table><thead><tr><th>CONTATO</th><th>PROJETO</th><th>MENSAGEM</th><th>NOTIFICAÇÃO</th><th>RECEBIDO EM</th></tr></thead><tbody>{leads.map(lead => <tr key={lead.id}><td><strong>{lead.name}</strong><small><a href={`mailto:${lead.email}`}>{lead.email}</a></small><small>{lead.phone}</small><small>{lead.company}</small></td><td>{lead.interest}<small>{lead.city}</small></td><td className="lead-message">{lead.message}</td><td><span className={`status-pill ${lead.emailSent ? '' : 'pending'}`}>{lead.emailSent ? 'E-mail enviado' : 'Pendente'}</span></td><td>{format(lead.createdAt)}</td></tr>)}</tbody></table></div>}{available && total > 20 && <div className="lead-pagination">{page > 1 ? <Link href={`/admin/contatos?pagina=${page - 1}`}>← Anterior</Link> : <span/>}<span>Página {page} · {total} contatos</span>{page * 20 < total ? <Link href={`/admin/contatos?pagina=${page + 1}`}>Próxima →</Link> : <span/>}</div>}</div></>;
}
