import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Administração | Nexus Mobilidade', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="admin-body">{children}</div>; }
