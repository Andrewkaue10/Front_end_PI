import React, { useState } from 'react';
import './Favorites.css';
import { 
  Home, Target, Star, Bell, Bookmark, MessageSquare, Briefcase, Settings, 
  Search, Plus, ChevronRight, Check, Users, TrendingUp, Compass, Folder
} from 'lucide-react';

// Mock de dados dos favoritos
const mockFavoritos = [
  {
    id: 1, iniciais: "CD", cor: "orange", nome: "Cohelita Digital",
    tags: ["AgroTech", "Tração"], badge: "Rodada 80% preenchida", badgeColor: "bg-orange-100 text-orange-600",
    match: 94,
    stats: [
      { label: "MRR desde que salvou", value: "R$14k ➔ R$18k", sub: "+28%", subColor: "text-green-600" },
      { label: "Crescimento mensal", value: "22%", sub: "MRR desde que salvou", subColor: "text-gray-500" },
      { label: "Meta de captação", value: "80%", bar: true, barValue: 80, barText: "8/10" },
      { label: "Salva em", value: "12/10", sub: "", subColor: "" }
    ],
    nota: "Pedir detalhamento do churn e das parcerias com varejo.",
    btnAcao: "Conectar"
  },
  {
    id: 2, iniciais: "NH", cor: "purple", nome: "Nuvia Health",
    tags: ["HealthTech", "MVP"], badge: "Encerra em 3 dias", badgeColor: "bg-red-100 text-red-600",
    match: 81,
    stats: [
      { label: "Pré-receita", value: "46 pilotos", sub: "+12", subColor: "text-green-600" },
      { label: "Pilotos ativos", value: "+15%", sub: "Último mês", subColor: "text-gray-500" },
      { label: "Meta de captação", value: "62%", bar: true, barValue: 62, barText: "05/10" },
      { label: "Salva em", value: "28/09", sub: "", subColor: "" }
    ],
    nota: "Aguardando resultado dos pilotos antes de decidir.",
    btnAcao: "Conectar"
  },
  {
    id: 3, iniciais: "VC", cor: "blue", nome: "Vortice Capital",
    tags: ["Fintech", "Seed"], badge: "Rodada aberta", badgeColor: "bg-green-100 text-green-700",
    match: 89,
    stats: [
      { label: "MRR desde que salvou", value: "R$6k ➔ R$9k", sub: "+50%", subColor: "text-green-600" },
      { label: "Crescimento mensal", value: "41%", sub: "MRR desde que salvou", subColor: "text-gray-500" },
      { label: "Meta de captação", value: "35%", bar: true, barValue: 35, barText: "28/09" },
      { label: "Salva em", value: "15/09", sub: "", subColor: "" }
    ],
    nota: "Comparar com outras fintechs de crédito da lista.",
    btnAcao: "Conectar"
  }
];

function Favoritos() {
  // Estado para controlar os checkboxes dos cards
  const [selectedCards, setSelectedCards] = useState([]);
  // Estado para controlar os filtros ativos
  const [activeTab, setActiveTab] = useState('Todos');

  const toggleCard = (id) => {
    setSelectedCards(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-area">
          <span className="logo-text">NEX</span><span className="logo-hub">hub</span>
          <span className="logo-star">*</span>
        </div>
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Buscar startups, investidores, mentores..." />
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">Início</a>
          <a href="#" className="nav-link">Explorar</a>
          <a href="#" className="nav-link">Rede</a>
          <a href="#" className="nav-link">Mensagens</a>
          <a href="#" className="nav-link active">Notificações</a>
        </nav>
        <div className="header-avatar">
          <div className="avatar-circle">JS</div>
        </div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-fav">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches <span className="badge-orange">1</span></li>
            <li><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li className="active"><Star size={18} /> Favoritos</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Bookmark size={18} /> Portfólio</li>
            <li><Briefcase size={18} /> Minhas qualificações</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="content-fav">
          <div className="content-header-fav">
            <div>
              <h1>Favoritos</h1>
              <p className="subtitle">Startups que você salvou para acompanhar, com as novidades desde o dia em que foram salvas.</p>
            </div>
            <button className="btn-primary-blue"><Plus size={16}/> Nova lista</button>
          </div>

          {/* FILTROS */}
          <div className="filters-fav">
            {['Todos 12', 'Em acompanhamento 5', 'Due diligence 2', 'Arquivados 3'].map((f, i) => (
              <button 
                key={i} 
                className={`filter-btn-fav ${activeTab === f.split(' ')[0] ? 'active' : ''}`}
                onClick={() => setActiveTab(f.split(' ')[0])}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="sub-filters-fav">
            <select className="select-filter"><option>Setor</option></select>
            <select className="select-filter"><option>Estágio</option></select>
            <select className="select-filter ml-auto"><option>Ordenar: Novidades</option></select>
          </div>

          {/* MINHAS LISTAS */}
          <div className="section-header-fav">
            <div>
              <h2 className="section-title-fav">Minhas listas</h2>
              <p className="subtitle">Organize as favoritas por tese ou prioridade</p>
            </div>
          </div>
          
          <div className="listas-grid">
            <div className="lista-card">
              <div className="lista-icon bg-green-100 text-green-600"><TrendingUp size={20}/></div>
              <strong>AgroTech prioritárias</strong>
              <p>5 startups</p>
            </div>
            <div className="lista-card">
              <div className="lista-icon bg-blue-100 text-blue-600"><Compass size={20}/></div>
              <strong>Fintech seed</strong>
              <p>4 startups</p>
            </div>
            <div className="lista-card">
              <div className="lista-icon bg-orange-100 text-orange-600"><Search size={20}/></div>
              <strong>Para revisar</strong>
              <p>3 startups</p>
            </div>
            <div className="lista-card dashed">
              <div className="lista-icon bg-blue-50 text-blue-500"><Plus size={20}/></div>
              <strong>Nova lista</strong>
            </div>
          </div>

          {/* STARUPS SALVAS */}
          <h2 className="section-title-fav mt-8">Startups salvas</h2>
          <p className="subtitle mb-4">Com a evolução desde que você favoritou</p>

          <div className="favoritos-list">
            {mockFavoritos.map(startup => (
              <div key={startup.id} className="fav-card">
                
                {/* HEADER DO CARD */}
                <div className="fav-card-header">
                  <div className="fav-info-principal">
                    <div className={`avatar-box ${startup.cor} large`}>{startup.iniciais}</div>
                    <div>
                      <h3>{startup.nome}</h3>
                      <div className="fav-tags">
                        {startup.tags.map((tag, i) => (
                          <span key={i} className="tag-gray">{tag}</span>
                        ))}
                        <span className={`tag-badge ${startup.badgeColor}`}>{startup.badge}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="fav-match-area">
                    <span className="match-badge"><Star size={10} fill="currentColor"/> {startup.match}%</span>
                    <div 
                      className={`checkbox ${selectedCards.includes(startup.id) ? 'checked' : ''}`}
                      onClick={() => toggleCard(startup.id)}
                    >
                      {selectedCards.includes(startup.id) && <Check size={12} />}
                    </div>
                  </div>
                </div>

                {/* GRID DE ESTATÍSTICAS */}
                <div className="fav-stats-grid">
                  {startup.stats.map((stat, idx) => (
                    <div key={idx} className="fav-stat-item">
                      <span className="stat-label">{stat.label}</span>
                      <div className="stat-value-area">
                        <strong>{stat.value}</strong>
                        {stat.sub && <span className={`stat-sub ${stat.subColor}`}>{stat.sub}</span>}
                      </div>
                      {stat.bar && (
                        <div className="stat-bar-container">
                          <div className="stat-bar-bg">
                            <div className="stat-bar-fill" style={{ width: `${stat.barValue}%` }}></div>
                          </div>
                          <span className="stat-bar-text">{stat.barText}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* NOTA */}
                <div className="fav-nota">
                  <span className="nota-icon">✍️</span>
                  <p>{startup.nota}</p>
                </div>

                {/* FOOTER DO CARD */}
                <div className="fav-card-footer">
                  <a href="#" className="link-blue">Ver perfil completo <ChevronRight size={14}/></a>
                  <div className="fav-actions">
                    <button className="btn-outline-small">Remover</button>
                    <button className="btn-primary-blue-small">{startup.btnAcao}</button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel-fav">
          <div className="resumo-card">
            <h4>Resumo</h4>
            <div className="resumo-row"><span>Startups favoritas</span><strong>12</strong></div>
            <div className="resumo-row"><span>Com novidades</span><strong>4</strong></div>
            <div className="resumo-row"><span>Rodadas encerrando</span><strong>2</strong></div>
            <div className="resumo-row"><span>Em due diligence</span><strong>2</strong></div>
          </div>

          <div className="novidades-section">
            <div className="right-header">
              <h4>Novidades das favoritas</h4>
              <a href="#" className="link-blue">Ver todas</a>
            </div>
            
            <div className="novidade-item">
              <div className="novidade-dot orange"></div>
              <div>
                <p><strong>Cohelita Digital</strong> atingiu 80% da meta de captação</p>
                <span>Há 1 h</span>
              </div>
            </div>
            
            <div className="novidade-item">
              <div className="novidade-dot purple"></div>
              <div>
                <p><strong>Vortice Capital</strong> atualizou o MRR para R$9k</p>
                <span>Há 1 d</span>
              </div>
            </div>

            <div className="novidade-item">
              <div className="novidade-dot green"></div>
              <div>
                <p><strong>Edila</strong> publicou um novo pitch (0:42)</p>
                <span>Há 2 d</span>
              </div>
            </div>
          </div>

          <div className="comparar-card">
            <h4>Comparar startups</h4>
            <p>Marque até 3 startups para comparar métricas, rodada e match lado a lado.</p>
            <div className="comparar-avatares">
              {selectedCards.map(id => {
                const startup = mockFavoritos.find(s => s.id === id);
                return startup ? <div key={id} className={`avatar-box ${startup.cor} small`}>{startup.iniciais}</div> : null;
              })}
              {selectedCards.length === 0 && <span className="empty-text">Nenhuma selecionada</span>}
            </div>
            <button className="btn-primary-blue-full" disabled={selectedCards.length < 2}>
              Comparar ({selectedCards.length})
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Favoritos;