import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { isAdmin } from '@/lib/auth';
import { Brand } from '@/components/brand';
import { LoginForm } from '@/components/admin/login-form';

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  return <main className="login-page"><section className="login-brand-panel"><Brand light/><div><h1>Por trás de cada conexão,<br/><span>uma boa gestão.</span></h1><p>Seu espaço para configurar os canais de contato e acompanhar os próximos negócios.</p></div><small>RELPH NEXUS · MOBILIDADE</small></section><section className="login-form-panel"><div className="login-box"><span className="eyebrow">ÁREA ADMINISTRATIVA</span><h2>Bom ter você por aqui.</h2><p>Entre com suas credenciais para continuar.</p><LoginForm/><Link href="/" className="login-back"><ArrowLeft size={14}/> Voltar ao site</Link></div></section></main>;
}
