'use client';

import { useState } from 'react';
import { ArrowUpRight, CarFront, ChevronRight, Clock3, LayoutDashboard, MapPin, Menu, ShieldCheck, Smartphone } from 'lucide-react';
import { AdminPanelPreview, DriverScreen } from './product-previews';

const tabs = [{ id: 'passageiro', label: 'App do passageiro', icon: Smartphone }, { id: 'motorista', label: 'App do motorista', icon: CarFront }, { id: 'painel', label: 'Painel administrativo', icon: LayoutDashboard }] as const;

export function RouteMap({ className = '' }: { className?: string }) {
  return <svg className={`route-map ${className}`} viewBox="0 0 400 480" fill="none" aria-hidden="true">
    <rect width="400" height="480" fill="#e9eeeb"/>
    <path d="M-20 120 400 10M-40 240 440 110M-20 360 420 240M-30 490 420 360M25-20 160 500M145-20 280 500M275-20 410 500" stroke="#fff" strokeWidth="20"/>
    <path d="M-20 180 420 60M-20 305 420 185M-20 425 420 300M85-20 220 500M210-20 345 500M335-20 470 500" stroke="#f8faf8" strokeWidth="7"/>
    <path d="m0 400 46-47 12-78 40-24-8-52-65-60L0 146" fill="#c7ded1"/>
    <path d="m300 0-20 70 26 54 94-23V0M350 320l-50 12 18 85 82-22v-53Z" fill="#d0e2d6"/>
    <path d="m125 318-22-89 119-34 19 74 64-18" stroke="#b8e9e7" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m125 318-22-89 119-34 19 74 64-18" stroke="#008e9a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="125" cy="318" r="11" fill="#fff" stroke="#008e9a" strokeWidth="5"/><circle cx="305" cy="251" r="10" fill="#092326" stroke="#fff" strokeWidth="4"/>
    <text x="155" y="125" fill="#81928b" fontSize="11" fontFamily="Arial" letterSpacing="2">CENTRO</text><text x="252" y="385" fill="#81928b" fontSize="10" fontFamily="Arial" letterSpacing="1">SUA CIDADE</text>
  </svg>;
}

export function HeroPhones() {
  return <div className="hero-product" aria-label="Ilustração dos aplicativos com a marca do cliente">
    <div className="product-orbit orbit-one"/><div className="product-orbit orbit-two"/>
    <div className="floating-note note-brand"><span className="note-icon"><ShieldCheck size={18}/></span><div><strong>A sua marca em movimento.</strong><span>O seu negócio começa aqui.</span></div></div>
    <div className="phone phone-driver"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><DriverScreen/></div>
    <div className="phone phone-passenger"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><div className="passenger-brand"><span className="mini-symbol">n<span>.</span></span><span>SUA MARCA</span><Menu size={18}/></div><div className="passenger-map"><RouteMap/><span className="map-car"><CarFront size={20}/></span><div className="map-greeting">Seu próximo destino<br/><strong>está mais perto.</strong></div></div><div className="passenger-sheet"><div className="sheet-handle"/><strong>Para onde vamos?</strong><div className="destination"><MapPin size={17}/><span>Digite seu destino</span><ArrowUpRight size={17}/></div><div className="recent-place"><span><Clock3 size={16}/></span><div>Seus lugares favoritos<small>Uma nova conexão a cada viagem</small></div></div><div className="passenger-cta">Encontrar uma viagem <ChevronRight size={16}/></div></div></div>
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
      <div className={`demo-visual visual-${active}`}>{active === 'painel' ? <AdminPanelPreview/> : <div className="demo-phone-wrap"><div className="demo-halo"/>{active === 'passageiro' ? <div className="phone demo-phone"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><div className="passenger-brand"><span className="mini-symbol">n.</span><span>SUA MARCA</span><Menu size={18}/></div><div className="demo-app-map"><RouteMap/></div><div className="demo-app-sheet"><h4>Olá, para onde vamos?</h4><div className="destination"><MapPin size={17}/><span>Escolha seu próximo destino</span></div><div className="passenger-cta">Começar uma viagem <ArrowUpRight size={17}/></div></div></div> : <div className="phone demo-phone"><div className="phone-notch"/><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><DriverScreen/></div>}<div className="demo-float"><ShieldCheck size={21}/><span>Sua marca.<strong>Em cada conexão.</strong></span></div></div>}{active !== 'painel' && <span className="visual-caption">Representação visual · dados e mapas fictícios · identidade personalizável</span>}</div>
    </div></div>;
}
