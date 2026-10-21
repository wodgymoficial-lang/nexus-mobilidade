'use client';

import { useState } from 'react';
import { ArrowLeft, Building2, CalendarDays, CarFront, ChartNoAxesCombined, Check, ChevronDown, CircleHelp, Crosshair, Eye, Filter, Flame, Gauge, Headphones, Info, LayoutGrid, Map, MapPin, Menu, Route, Settings, Sun, Users } from 'lucide-react';

// Reconstructed from layout references. All figures, identifiers and maps are fictional.
export function DemoCityMap({ trip = false }: { trip?: boolean }) {
  return <svg className="reference-city-map" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
    <rect width="400" height="600" fill={trip ? '#e7e5e0' : '#dceef3'}/>
    <path d="M-30 385C90 425 75 300 190 335S300 260 450 302" stroke="#99cadb" strokeWidth="12"/>
    <path d="M-20 85 440 230M-20 165 440 310M-20 260 440 405M-20 365 440 510M-20 470 440 615M-5-30 105 650M95-30 205 650M210-30 320 650M320-30 430 650" stroke="#fff" strokeWidth="8"/>
    <path d="M-40 125 440 270M-40 215 440 360M-40 310 440 455M-40 415 440 560M-40 525 300 625M40-30 150 650M150-30 260 650M265-30 375 650" stroke="#fff" strokeWidth="3"/>
    <path d="M-5 0 30 85 16 132 35 195 17 250M340 390l-70 45-8 47-50 23-19 95" stroke="#40b989" strokeWidth="5"/>
    <path d="m30 280 45-16 18 45-37 12Zm242-155 48 16-13 46-45-15ZM185 490l44-12 13 47-47 12Z" fill="#bfdbbb"/>
    <g fill="#6f9aab" fontFamily="Arial, sans-serif" fontSize="9"><text x="140" y="122">SETOR NORTE</text><text x="30" y="365">CENTRO</text><text x="205" y="440">SETOR SUL</text><text x="112" y="255" transform="rotate(18 112 255)">Avenida Central</text><text x="240" y="555" transform="rotate(-70 240 555)">Via de demonstração</text></g>
    {trip && <><path d="m116 385 57-44-11-69 65-50 64 44" stroke="#3e87b3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M116 358c-12 0-20 8-20 19 0 16 20 32 20 32s20-16 20-32c0-11-8-19-20-19Z" fill="#3b82f6" stroke="#fff" strokeWidth="2"/><circle cx="116" cy="377" r="6" fill="#fff"/><path d="M291 239c-12 0-20 8-20 19 0 16 20 32 20 32s20-16 20-32c0-11-8-19-20-19Z" fill="#10b981" stroke="#fff" strokeWidth="2"/><circle cx="291" cy="258" r="6" fill="#fff"/></>}
  </svg>;
}

export function DriverScreen() {
  return <div className="reference-driver-screen" role="img" aria-label="Layout ilustrativo do app motorista: mapa, status online, botão conectado e ganhos da semana fictícios">
    <DemoCityMap/>
    <div className="reference-driver-menu"><Menu/></div>
    <div className="reference-driver-online">Você está Online <i/></div>
    <div className="reference-driver-brand">SUA<br/><b>MARCA</b></div>
    <div className="reference-driver-locate"><Crosshair/></div>
    <div className="reference-driver-emblem"><CarFront/><span>SUA MARCA</span></div>
    <div className="reference-driver-car"><CarFront/></div>
    <div className="reference-driver-connected"><span>Conectado</span><i><ArrowLeft/></i></div>
    <div className="reference-driver-earnings"><span>GANHOS DA SEMANA</span><strong>R$ 286,40</strong></div>
    <span className="reference-driver-disclaimer">MAPA E VALORES ILUSTRATIVOS</span>
  </div>;
}

const sidebarGroups = [
  { title: 'MONITORAMENTO', items: [{ label: 'Acompanhamento', icon: MapPin }, { label: 'Mapa de Calor', icon: Flame }, { label: 'Mapa Geral', icon: Map }, { label: 'Monitoramento', icon: Eye }, { label: 'Status dos Motoristas', icon: ChartNoAxesCombined }] },
  { title: 'SUPORTE', items: [{ label: 'Configurações de Disputa', icon: Settings }, { label: 'Itens Perdidos', icon: CircleHelp }, { label: 'Solicitações de Revisão', icon: Headphones }] },
  { title: 'CORPORATIVO', items: [{ label: 'Painel Corporativo', icon: LayoutGrid }, { label: 'Empresas Corporativas', icon: Building2 }] }
];
const metrics = [
  { label: 'TOTAL DE CORRIDAS', value: '1.280', icon: Route, tone: 'blue' },
  { label: 'RECEITA TOTAL', value: 'R$ 24.680,00', icon: ChartNoAxesCombined, tone: 'green' },
  { label: 'PASSAGEIROS', value: '2.450', icon: Users, tone: 'orange' },
  { label: 'MOTORISTAS', value: '380', note: '24 online', icon: CarFront, tone: 'blue' },
  { label: 'CORRIDAS AGENDADAS', value: '12', icon: CalendarDays, tone: 'orange' },
  { label: 'CORRIDAS CONCLUÍDAS', value: '1.168', icon: Check, tone: 'green' }
];
const filters = [
  ['Franquia', 'Todas as unidades'], ['Data de Início', 'dd/mm/aaaa'], ['Data Final', 'dd/mm/aaaa'], ['Status', 'Todos os Status'],
  ['Processo Inicial', 'Todos'], ['Simulação', 'Todos'], ['Corporativo', 'Todos'], ['Origem', 'Todas']
];
const tripFields = [
  ['STATUS DA VIAGEM', 'Concluída'], ['ID DO BANCO DE DADOS', 'DEMO-001'], ['ID VIAGEM', 'VIAGEM-DEMO-001'], ['PASSAGEIRO', 'Passageiro exemplo'],
  ['MOTORISTA', 'Motorista exemplo'], ['VEÍCULO', 'Veículo de demonstração'], ['SERVIÇO DO MOTORISTA', 'Carro comum'], ['TIPO DE TARIFA', 'Padrão'],
  ['FRANQUIA', 'Unidade demonstração'], ['TIPO DE SERVIÇO', 'Executivo'], ['DISTÂNCIA TOTAL', '4,8 km'], ['TEMPO ESTIMADO', '12 min']
];

export function AdminPanelPreview() {
  const [view, setView] = useState<'overview' | 'trip'>('overview');
  return <div className="reference-panel-preview">
    <div className="reference-preview-switch" role="group" aria-label="Telas ilustrativas do painel"><button type="button" aria-pressed={view === 'overview'} onClick={() => setView('overview')}><Gauge size={14}/>Visão geral</button><button type="button" aria-pressed={view === 'trip'} onClick={() => setView('trip')}><Route size={14}/>Detalhes da corrida</button><span>DADOS FICTÍCIOS</span></div>
    <div className="reference-dashboard">
      <aside className="reference-sidebar" aria-hidden="true"><div className="reference-panel-brand"><span>n.</span><strong>Sua Marca</strong><small>Admin</small></div><div className="reference-sidebar-active"><Gauge/> <span>Painel</span></div>{sidebarGroups.map(group => <div className="reference-nav-group" key={group.title}><small>{group.title}</small>{group.items.map(({ label, icon: Icon }) => <div key={label}><Icon/><span>{label}</span></div>)}</div>)}<div className="reference-sidebar-account"><Settings/><span>Configs da Conta</span></div></aside>
      <div className="reference-dashboard-body"><div className="reference-panel-topbar"><span>Ambiente de demonstração</span><Sun/><small>BR</small><i>A</i><b>Admin</b><ChevronDown/></div>
        {view === 'overview' ? <div className="reference-panel-content"><div className="reference-filter-card"><h4>Filtros Avançados</h4><div className="reference-filter-grid">{filters.map(([label, value], index) => <div key={label}><span>{label}</span><div>{value}{index === 1 || index === 2 ? <CalendarDays/> : <ChevronDown/>}</div></div>)}</div><div className="reference-filter-actions"><span><Filter/>Filtrar</span><span>Limpar</span></div></div><div className="reference-metrics">{metrics.map(({ label, value, note, icon: Icon, tone }) => <div key={label} className="reference-metric-card"><i className={`reference-tone-${tone}`}><Icon/></i><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>)}</div><div className="reference-panel-footnote"><Info size={12}/> Valores de exemplo, sem relação com resultados reais da plataforma.</div></div>
          : <div className="reference-panel-content"><div className="reference-trip-heading"><div><h4>Detalhes da Corrida</h4><p>ID: VIAGEM-DEMO-001</p></div><span><ArrowLeft/>Voltar</span></div><div className="reference-trip-grid"><section className="reference-trip-card"><h5><Info/>Informações Gerais</h5><div className="reference-trip-fields">{tripFields.map(([label, value], index) => <div key={label}><span>{label}</span><strong className={index === 0 ? 'reference-trip-status' : ''}>{value}</strong></div>)}</div></section><section className="reference-trip-card"><h5><Map/>Mapa da Viagem</h5><div className="reference-trip-map"><DemoCityMap trip/><span>TRAJETO FICTÍCIO</span></div></section></div><div className="reference-panel-footnote"><Info size={12}/> Pessoas, identificadores e trajeto exclusivamente ilustrativos.</div></div>}
      </div>
    </div>
    <span className="reference-preview-caption">Layout baseado na plataforma · dados e mapas fictícios</span>
  </div>;
}
