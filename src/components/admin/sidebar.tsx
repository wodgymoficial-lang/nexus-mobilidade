'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, LayoutDashboard, LogOut, Mail, Users } from 'lucide-react';
import { Brand } from '../brand';

export function Sidebar() {
  const path = usePathname(); const router = useRouter(); const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    try { const response = await fetch('/api/auth/logout', { method: 'POST' }); if (!response.ok) throw new Error(); router.replace('/admin/login'); router.refresh(); }
    catch { setBusy(false); }
  }
  return <aside className="admin-sidebar"><Brand light/><small>ÁREA ADMINISTRATIVA</small><nav aria-label="Menu administrativo">{[{ href: '/admin', label: 'Visão geral', icon: LayoutDashboard }, { href: '/admin/smtp', label: 'Configuração SMTP', icon: Mail }, { href: '/admin/contatos', label: 'Contatos recebidos', icon: Users }].map(({ href, label, icon: Icon }) => <Link key={href} className={path === href ? 'active' : ''} href={href} aria-current={path === href ? 'page' : undefined}><Icon size={17}/>{label}</Link>)}</nav><div className="admin-sidebar-footer"><Link href="/">Visitar o site <ArrowUpRight size={14}/></Link><button className="logout-button" onClick={logout} disabled={busy}><LogOut size={15}/>{busy ? 'Saindo…' : 'Sair da conta'}</button></div></aside>;
}
