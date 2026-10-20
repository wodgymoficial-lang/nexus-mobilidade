import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://127.0.0.1:3000'),
  title: 'Relph Nexus Mobilidade | Seu aplicativo. Sua marca. Seu negócio.',
  description: 'Crie seu negócio de mobilidade com aplicativos personalizados, painel administrativo e a tecnologia 21Driver. Plataforma compartilhada, implantação dedicada e código-fonte.',
  openGraph: { title: 'Relph Nexus Mobilidade', description: 'A tecnologia por trás do seu próximo negócio de mobilidade.', locale: 'pt_BR', type: 'website', images: ['/images/nexus-mobilidade.png'] },
  robots: { index: true, follow: true }
};
export const viewport: Viewport = { themeColor: '#092326' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
