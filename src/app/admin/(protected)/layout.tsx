import { redirect } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { isAdmin } from '@/lib/auth';
import { Sidebar } from '@/components/admin/sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/admin/login');
  return <div className="admin-shell"><Sidebar/><div className="admin-content"><div className="admin-topbar"><span><LockKeyhole size={12}/> Ambiente administrativo</span><span>{process.env.ADMIN_EMAIL}</span></div>{children}</div></div>;
}
