'use client';

import { useState } from 'react';
import { ArrowUpRight, CarFront, LayoutDashboard, ShieldCheck, Smartphone } from 'lucide-react';
import { AdminPanelPreview, DriverScreen, PassengerScreen } from './product-previews';

const tabs = [{ id: 'passageiro', label: 'App do passageiro', icon: Smartphone }, { id: 'motorista', label: 'App do motorista', icon: CarFront }, { id: 'painel', label: 'Painel administrativo', icon: LayoutDashboard }] as const;

export function HeroPhones() {
  return <div className="hero-product" aria-label="Ilustração dos aplicativos com a marca do cliente">
    <div className="product-orbit orbit-one"/><div className="product-orbit orbit-two"/>
    <div className="floating-note note-brand"><span className="note-icon"><ShieldCheck size={18}/></span><div><strong>A sua marca em movimento.</strong><span>O seu negócio começa aqui.</span></div></div>
    <div className="phone phone-driver"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><DriverScreen/></div>
    <div className="phone phone-passenger"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><PassengerScreen route/></div>
    <div className="floating-note note-tech"><span className="online-dot"/><span>Tecnologia <strong>21Driver</strong></span><ArrowUpRight size={16}/></div>
    <span className="hero-demo-label">Layout de referência · dados fictícios</span>
  </div>;
}

export function PlatformDemo() {
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('passageiro');
  const content = {
    passageiro: { number: '01', title: 'A experiência começa\ncom a sua marca.', description: 'Um aplicativo para conectar seus passageiros à sua operação. A identidade do seu negócio acompanha a experiência de quem vai viajar.', points: ['Identidade visual personalizada', 'Aplicativo Flutter para passageiros', 'Conexão com a sua operação'] },
    motorista: { number: '02', title: 'Quem move a cidade\ntambém está conectado.', description: 'O aplicativo do motorista faz parte do mesmo ecossistema. Sua operação, seus parceiros e sua marca conectados pela tecnologia 21Driver.', points: ['Aplicativo Flutter para motoristas', 'Identidade alinhada ao seu negócio', 'Integração com a plataforma'] },
    painel: { number: '03', title: 'Sua operação merece\numa visão completa.', description: 'O painel administrativo conecta a gestão aos aplicativos. Conheça os recursos disponíveis e defina a configuração adequada ao seu modelo de operação.', points: ['Painel administrativo web', 'Backend conectado aos aplicativos', 'Configuração conforme o projeto'] }
  }[active];
  return <div className="platform-demo"><div className="platform-tabs" role="tablist" aria-label="Componentes da plataforma">{tabs.map(({ id, label, icon: Icon }) => <button key={id} id={`tab-${id}`} role="tab" aria-selected={active === id} aria-controls={`panel-${id}`} onClick={() => setActive(id)}><Icon size={18}/>{label}<ArrowUpRight size={15}/></button>)}</div>
    <div className={`demo-grid ${active === 'painel' ? 'demo-grid-panel' : ''}`} role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} tabIndex={0}>
      <div className="demo-description"><span className="eyebrow">UM ECOSSISTEMA. SUA IDENTIDADE.</span><h3>{content.title}</h3><p>{content.description}</p><ul>{content.points.map(p => <li key={p}><span className="check-small">✓</span>{p}</li>)}</ul><a className="text-link" href="#contato">Quero ver uma demonstração <ArrowUpRight size={18}/></a><span className="demo-page">{content.number} <span>/ 03</span></span></div>
      <div className={`demo-visual visual-${active}`}>{active === 'painel' ? <AdminPanelPreview/> : <div className="demo-phone-wrap"><div className="demo-halo"/>{active === 'passageiro' ? <div className="phone demo-phone"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><PassengerScreen/></div> : <div className="phone demo-phone"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><DriverScreen/></div>}<div className="demo-float"><ShieldCheck size={21}/><span>Sua marca.<strong>Em cada conexão.</strong></span></div></div>}{active !== 'painel' && <span className="visual-caption">Representação visual · dados e mapas fictícios · identidade personalizável</span>}</div>
    </div></div>;
}
