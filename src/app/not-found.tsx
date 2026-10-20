import Link from 'next/link';
import { Brand } from '@/components/brand';
export default function NotFound() { return <main className="not-found"><Brand/><span className="eyebrow">404 — CAMINHO NÃO ENCONTRADO</span><h1>Vamos encontrar<br/>um novo caminho.</h1><p>Esta página não está disponível.</p><Link className="button button-primary" href="/">Voltar ao início ↗</Link></main>; }
