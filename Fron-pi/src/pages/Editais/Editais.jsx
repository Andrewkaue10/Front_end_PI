import React, { useState } from 'react';
import './Editais.css';
import { 
  Home, FileText, Layers, Rocket, Star, Users, MessageSquare, Briefcase, Settings, 
  Search, Calendar, ChevronRight, Check, X, ArrowRight, Save, Clock
} from 'lucide-react';

// --- MOCK API ---
// Aqui simulamos os dados que viriam do seu backend/API pública
const mockEditais = [
  {
    id: 1,
    nome: "Centelha PE: apoio a startups early-stage",
    tipo: "Subvenção",
    modalidade: "Pernambuco · FACEPE",
    prazo: "11/11",
    valor: "até R$100k",
    duracao: "12 meses",
    status: "Faltam 9 dias",
    statusColor: "bg-red-100 text-red-600",
    match: 4,
    requisitos: [
      "CNPJ com menos de 5 anos no estado",
      "Sede em Pernambuco",
      "Equipe com 2 ou mais sócios",
      "Plano de negócio no modelo do edital"
    ],
    linkInscricao: "https://facepe.br/centelha" // Link real para onde o botão vai
  },
  {
    id: 2,
    nome: "Porto Digital: incubação 2026",
    tipo: "Aceleração",
    modalidade: "Recife · Porto Digital",
    prazo: "30/11",
    valor: "Mentoria + espaço",
    duracao: "18 meses",
    status: "Faltam 24 dias",
    statusColor: "bg-red-100 text-red-600",
    match: 5,
    requisitos: [
      "Startup com MVP no mercado",
      "Time dedicado em tempo integral",
      "Modelo de negócio escalável",
      "Pitch de até 5 minutos",
      "Comprovação de endereço em Recife"
    ],
    linkInscricao: "https://portodigital.org"
  },
  {
    id: 3,
    nome: "Startup Brasil: aceleração",
    tipo: "Aceleração",
    modalidade: "Nacional · MCTI",
    prazo: "10/12",
    valor: "até R$500k",
    duracao: "6 meses",
    status: "Faltam 34 dias",
    statusColor: "bg-red-100 text-red-600",
    match: 4,
    requisitos: [
      "Faturamento anual abaixo do limite do edital",
      "Produto com base tecnológica",
      "Sócios com dedicação exclusiva",
      "Cadastro em aceleradoras parceiras"
    ],
    linkInscricao: "https://www.gov.br/mcti"
  }
];

function Editais() {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Lógica para filtrar os editais baseados no input de busca
  const editaisFiltrados = mockEditais.filter(edital => {
    const matchBusca = edital.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === 'Todos' || edital.tipo === filtroTipo;
    return matchBusca && matchTipo;
  });

  return (
    <div className="app-container">
      {/* HEADER - Mantido igual */}
      <header className="header">
        <div className="logo-area">
          <span className="logo-text">NEX</span><span className="logo-hub">hub</span>
          <span className="logo-star">*</span>
        </div>
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Buscar editais, programas..." />
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">Início</a>
          <a href="#" className="nav-link">Explorar</a>
          <a href="#" className="nav-link">Rede</a>
          <a href="#" className="nav-link">Mensagens</a>
          <a href="#" className="nav-link">Notificações</a>
        </nav>
        <div className="header-avatar">
          <div className="avatar-circle">JS</div>
        </div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><FileText size={18} /> Publicações</li>
            <li><Layers size={18} /> Meus reels</li>
            <li className="active"><Rocket size={18} /> Editais</li>
            <li><Star size={18} /> Mentores</li>
            <li><Users size={18} /> Investidores</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Briefcase size={18} /> Perfil da startup</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="content-editais">
          <div className="content-header-editais">
            <div>
              <h1>Editais e programas</h1>
              <p className="subtitle">Incubadoras, aceleradoras e fomento para startups em fase inicial, com os prazos e requisitos de cada um.</p>
            </div>
            <button className="btn-primary-orange">+ Criar alerta</button>
          </div>

          {/* FILTROS */}
          <div className="filters-editais">
            {['Todos 23', 'Incubadoras 6', 'Aceleradoras 6', 'Subvenção 7', 'Fomento 3'].map((f) => {
              const label = f.split(' ')[0];
              return (
                <button 
                  key={label}
                  className={`filter-btn-editais ${filtroTipo === label ? 'active' : ''}`}
                  onClick={() => setFiltroTipo(label)}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="sub-filters">
            <select className="select-filter"><option>Estágio</option></select>
            <select className="select-filter"><option>Valor</option></select>
            <select className="select-filter"><option>Região</option></select>
            <select className="select-filter ml-auto"><option>Ordenar: Prazo</option></select>
          </div>

          {/* BANNER ROXO */}
          <div className="banner-roxo">
            <div>
              <h3>3 editais encerram nos próximos 30 dias e combinam com a Cohelita Digital</h3>
              <p>Baseado no seu setor, estágio e localização</p>
            </div>
            <button className="btn-banner">Ver compatíveis</button>
          </div>

          <h2 className="section-title-editais">Abertos agora</h2>
          <p className="subtitle mb-4">Ordenados pelo prazo de inscrição</p>

          {/* CARDS DOS EDITAIS (Lógica aplicada aqui) */}
          <div className="editais-list">
            {editaisFiltrados.map(edital => (
              <div key={edital.id} className="edital-card">
                <div className="edital-header">
                  <div className="edital-title-area">
                    <div className="icon-placeholder"></div>
                    <div>
                      <h3>{edital.nome}</h3>
                      <div className="edital-tags">
                        <span className="tag tag-blue">{edital.tipo}</span>
                        <span className="tag-text">{edital.modalidade}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`tag ${edital.statusColor}`}><Clock size={12}/> {edital.status}</span>
                </div>

                <div className="edital-info-grid">
                  <div className="info-item">
                    <span className="info-label">Inscrições até</span>
                    <strong>{edital.prazo}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Valor</span>
                    <strong>{edital.valor}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duração</span>
                    <strong>{edital.duracao}</strong>
                  </div>
                </div>

                {/* BOX DE REQUISITOS COM MATCH */}
                <div className="match-box">
                  <div className="match-header">
                    <strong>Você atende {edital.match} de 5 requisitos</strong>
                    <a href="#">Ver todos <ChevronRight size={14}/></a>
                  </div>
                  <ul className="match-list">
                    {edital.requisitos.map((req, i) => (
                      <li key={i} className={i < edital.match ? 'matched' : 'unmatched'}>
                        {i < edital.match ? <Check size={14} color="#10b981"/> : <X size={14} color="#ef4444"/>}
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="edital-footer">
                  <a href="#" className="link-details">Ver edital completo <ArrowRight size={14}/></a>
                  <div className="edital-actions">
                    <button className="btn-outline-small"><Save size={14}/> Salvar</button>
                    {/* AQUI ESTÁ A LÓGICA DE IR PARA O SITE DO EDITAL */}
                    <a 
                      href={edital.linkInscricao} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary-orange-small"
                    >
                      Inscrever-se
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel-editais">
          <div className="right-header">
            <h4>Próximos prazos</h4>
            <a href="#" className="link-calendar">Calendário</a>
          </div>
          
          <div className="deadlines-list">
            <div className="deadline-item">
              <div className="date-box"><span>15</span><span>NOV</span></div>
              <div>
                <strong>Centelha PE</strong>
                <p>Subvenção · 9 dias</p>
              </div>
            </div>
            <div className="deadline-item">
              <div className="date-box"><span>30</span><span>NOV</span></div>
              <div>
                <strong>Porto Digital</strong>
                <p>Aceleração · 24 dias</p>
              </div>
            </div>
            <div className="deadline-item">
              <div className="date-box"><span>10</span><span>DEZ</span></div>
              <div>
                <strong>Startup Brasil</strong>
                <p>Aceleração · 34 dias</p>
              </div>
            </div>
          </div>

          <div className="alerts-section">
            <h4>Alertas de editais</h4>
            <div className="alert-row"><span>Incubadoras</span><div className="toggle active"></div></div>
            <div className="alert-row"><span>Aceleradoras</span><div className="toggle active"></div></div>
            <div className="alert-row"><span>Subvenção</span><div className="toggle active"></div></div>
            <div className="alert-row"><span>Fomento</span><div className="toggle"></div></div>
            <div className="alert-row"><span>Avisar 7 dias antes do prazo</span><div className="toggle active"></div></div>
          </div>

          <div className="saved-section">
            <div className="right-header">
              <h4>Editais salvos · 3</h4>
              <a href="#" className="link-calendar">Ver todos</a>
            </div>
            <div className="saved-item">
              <div className="icon-folder"></div>
              <div>
                <strong>Centelha PE</strong>
                <p>Aberto</p>
              </div>
            </div>
            <div className="saved-item">
              <div className="icon-folder"></div>
              <div>
                <strong>Porto Digital</strong>
                <p>Aberto</p>
              </div>
            </div>
            <div className="saved-item">
              <div className="icon-folder"></div>
              <div>
                <strong>Startup Brasil</strong>
                <p>Aberto</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Editais;