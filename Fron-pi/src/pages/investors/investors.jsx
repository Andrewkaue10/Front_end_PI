import React, { useState } from 'react';
import './investors.css';
import { 
  Home, FileText, Layers, Rocket, Star, Users, MessageSquare, Briefcase, Settings, 
  Search, Check, X, ArrowRight, ShieldCheck, Zap, MapPin, Tag
} from 'lucide-react';

function Investidores() {
  // Lógica para os botões de Passar/Conectar
  const [cardActions, setCardActions] = useState({});

  const handleAction = (id, action) => {
    setCardActions(prev => ({ ...prev, [id]: action }));
  };

  return (
    <div className="app-container">
      {/* HEADER PADRÃO */}
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
            <li><Rocket size={18} /> Editais</li>
            <li><Star size={18} /> Mentores</li>
            <li className="active"><Users size={18} /> Investidores</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Briefcase size={18} /> Perfil da startup</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="content-investidores">
          <div className="content-header-inv">
            <div>
              <h1>Investidores</h1>
              <p className="subtitle">Investidores que mais combinam com o perfil da Cohelita Digital, ordenados pela A.L.I.A.</p>
            </div>
            <button className="btn-primary-orange">+ Avisar entradas</button>
          </div>

          {/* FILTROS */}
          <div className="filters-inv">
            {['Para você 16', 'Pendentes 2', 'Conectados 6', 'Salvos 5'].map((f, i) => (
              <button key={i} className={`filter-btn-inv ${i === 0 ? 'active' : ''}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="sub-filters-inv">
            <select className="select-filter"><option>Tipo</option></select>
            <select className="select-filter"><option>Setor</option></select>
            <select className="select-filter"><option>Ticket</option></select>
            <select className="select-filter ml-auto"><option>Ordenar: Maior match</option></select>
          </div>

          {/* BANNER A.L.I.A */}
          <div className="banner-alia">
            <div className="alia-icon"><Zap size={16} color="#ea580c" fill="#ea580c"/></div>
            <p>O <strong>sinal "Análise inteligente"</strong> aparece quando a A.L.I.A comparou o texto do seu perfil com a tese do investidor (plano, foco, família e a nota "explicável" estão <em>safety first</em> para você priorizar a localização).</p>
          </div>

          {/* CARD EM DESTAQUE (MARLOS LIMA) */}
          <div className="destaque-card">
            <div className="destaque-header">
              <div className="investidor-info-principal">
                <div className="investidor-avatar dark">ML</div>
                <div>
                  <h2>Marlos Lima</h2>
                  <p>Investidor anjo <span className="tag-alia"><Zap size={10}/> Análise inteligente</span></p>
                </div>
              </div>
              <div className="match-circle destaque-match">
                <span>94</span>
                <small>de 100</small>
              </div>
            </div>

            <div className="requisitos-list">
              <div className="req-item"><Check size={16} color="#10b981" /> Mesmo setor de atuação</div>
              <div className="req-item"><Check size={16} color="#10b981" /> Valor procurado dentro da faixa aceita pelo investidor</div>
              <div className="req-item"><Check size={16} color="#10b981" /> Mesma região</div>
            </div>

            <p className="destaque-desc">Tese: startups B2B com tração inicial e receita recorrente. Prefere times com sócios dedicados e crescimento mensal consistente.</p>

            <div className="barras-progresso">
              <div className="barra-item">
                <div className="barra-header"><span>Setor</span><strong>98%</strong></div>
                <div className="barra-bg"><div className="barra-fill green" style={{ width: '98%' }}></div></div>
              </div>
              <div className="barra-item">
                <div className="barra-header"><span>Fase</span><strong>92%</strong></div>
                <div className="barra-bg"><div className="barra-fill green" style={{ width: '92%' }}></div></div>
              </div>
              <div className="barra-item">
                <div className="barra-header"><span>Localização</span><strong>88%</strong></div>
                <div className="barra-bg"><div className="barra-fill green" style={{ width: '88%' }}></div></div>
              </div>
            </div>

            <div className="destaque-footer-info">
              <div><span className="label">R$50k-200k</span><span className="sub">Ticket</span></div>
              <div><span className="label">12</span><span className="sub">Investimentos</span></div>
              <div><span className="label">AgroTech, Fintech, SaaS</span><span className="sub">Setores</span></div>
            </div>

            <div className="destaque-actions">
              <a href="#" className="link-laranja">Ver perfil <ArrowRight size={14}/></a>
              <div className="actions-group">
                <button className="btn-outline">Passar</button>
                <button className="btn-primary-orange-small">Solicitar conexão</button>
              </div>
            </div>
          </div>

          <h2 className="section-title-inv">Mais investidores para você</h2>
          <p className="subtitle mb-4">Todos passaram pelos filtros da plataforma e têm nota de pelo menos 40.</p>

          {/* GRID DE INVESTIDORES */}
          <div className="investidores-grid">
            
            {/* CARD 1 */}
            <div className={`investidor-card ${cardActions[1] === 'pass' ? 'passed' : ''}`}>
              <div className="card-header">
                <div className="investidor-avatar blue">FA</div>
                <div className="investidor-title">
                  <h3>Fundo Alvorada</h3>
                  <p>Venture Capital</p>
                </div>
                <div className="match-circle small"><span>86</span></div>
              </div>
              <span className="tag-alia mini"><Zap size={10}/> Análise inteligente</span>
              
              <div className="mini-requisitos">
                <div className="req-item small"><Check size={12} color="#10b981" /> Mesmo setor de atuação</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Fase compatível: Tração</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Valor procurado dentro da faixa aceita</div>
              </div>

              <p className="card-desc">Seed em AgroTech e marketplaces B2B.</p>

              <div className="mini-footer-info">
                <div><strong>R$500k-2M</strong><span>Ticket</span></div>
                <div><strong>27</strong><span>Investimentos</span></div>
                <div><strong>AgroTech, Marketpl.</strong><span>Setores</span></div>
              </div>

              {cardActions[1] === 'pass' ? (
                <button className="btn-undo" onClick={() => handleAction(1, null)}>Desfazer</button>
              ) : (
                <div className="card-actions">
                  <a href="#" className="link-laranja">Ver perfil <ArrowRight size={14}/></a>
                  <div className="actions-group">
                    <button className="btn-outline" onClick={() => handleAction(1, 'pass')}>Passar</button>
                    <button className="btn-primary-orange-small" onClick={() => handleAction(1, 'connect')}>Conectar</button>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 2 */}
            <div className={`investidor-card ${cardActions[2] === 'pass' ? 'passed' : ''}`}>
              <div className="card-header">
                <div className="investidor-avatar green">GV</div>
                <div className="investidor-title">
                  <h3>Gaia Ventures</h3>
                  <p>Venture Capital</p>
                </div>
                <div className="match-circle small"><span>83</span></div>
              </div>
              <span className="tag-alia mini"><Zap size={10}/> Análise inteligente</span>

              <div className="mini-requisitos">
                <div className="req-item small"><Check size={12} color="#10b981" /> Mesmo setor de atuação</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Fase compatível: Tração</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Localização compatível</div>
              </div>

              <p className="card-desc">Foco em AgroTech e sustentabilidade.</p>

              <div className="mini-footer-info">
                <div><strong>R$300k-1M</strong><span>Ticket</span></div>
                <div><strong>15</strong><span>Investimentos</span></div>
                <div><strong>AgroTech, ESG</strong><span>Setores</span></div>
              </div>

              {cardActions[2] === 'pass' ? (
                <button className="btn-undo" onClick={() => handleAction(2, null)}>Desfazer</button>
              ) : (
                <div className="card-actions">
                  <a href="#" className="link-laranja">Ver perfil <ArrowRight size={14}/></a>
                  <div className="actions-group">
                    <button className="btn-outline" onClick={() => handleAction(2, 'pass')}>Passar</button>
                    <button className="btn-primary-orange-small" onClick={() => handleAction(2, 'connect')}>Conectar</button>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 3 */}
            <div className="investidor-card">
              <div className="card-header">
                <div className="investidor-avatar purple">CP</div>
                <div className="investidor-title">
                  <h3>Camila Prado</h3>
                  <p>Investidora anjo</p>
                </div>
                <div className="match-circle small"><span>80</span></div>
              </div>
              <span className="tag-alia mini"><Zap size={10}/> Análise inteligente</span>

              <div className="mini-requisitos">
                <div className="req-item small"><Check size={12} color="#10b981" /> Setor de interesse em comum</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Valor procurado dentro da faixa aceita</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Mesma região</div>
              </div>

              <p className="card-desc">Apoia founders com receita recorrente.</p>

              <div className="mini-footer-info">
                 <div><strong>R$50k-300k</strong><span>Ticket</span></div>
              </div>

              <div className="card-actions">
                <a href="#" className="link-laranja">Ver perfil <ArrowRight size={14}/></a>
                <div className="actions-group">
                  <button className="btn-outline">Passar</button>
                  <button className="btn-primary-orange-small">Conectar</button>
                </div>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="investidor-card">
              <div className="card-header">
                <div className="investidor-avatar orange">VA</div>
                <div className="investidor-title">
                  <h3>Vértice Angels</h3>
                  <p>Rede de anjos</p>
                </div>
                <div className="match-circle small"><span>79</span></div>
              </div>
              
              <div className="mini-requisitos">
                <div className="req-item small"><Check size={12} color="#10b981" /> Fase compatível: Tração</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Valor procurado dentro da faixa aceita</div>
                <div className="req-item small"><Check size={12} color="#10b981" /> Localização compatível</div>
              </div>

              <p className="card-desc">Rede com capital semente de investimento.</p>

              <div className="card-actions" style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <a href="#" className="link-laranja">Ver perfil <ArrowRight size={14}/></a>
                <div className="actions-group">
                  <button className="btn-outline">Passar</button>
                  <button className="btn-primary-orange-small">Conectar</button>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel-inv">
          <div className="right-header-inv">
            <h4>Pedidos de conexão · 2</h4>
            <a href="#" className="link-laranja">Ver todos</a>
          </div>
          
          <div className="pedidos-list">
            <div className="pedido-item">
              <div className="investidor-avatar small purple">CP</div>
              <div className="pedido-info">
                <strong>Camila Prado</strong>
                <p>87% match</p>
              </div>
              <div className="pedido-actions">
                <button className="btn-icon green"><Check size={14}/></button>
                <button className="btn-icon red"><X size={14}/></button>
              </div>
            </div>
            <div className="pedido-item">
              <div className="investidor-avatar small orange">VA</div>
              <div className="pedido-info">
                <strong>Vértice Angels</strong>
                <p>79% match</p>
              </div>
              <div className="pedido-actions">
                <button className="btn-icon green"><Check size={14}/></button>
                <button className="btn-icon red"><X size={14}/></button>
              </div>
            </div>
          </div>

          <div className="quem-viu-section">
             <div className="right-header-inv">
              <h4>Quem viu seu perfil</h4>
              <a href="#" className="link-laranja">Ver todos</a>
            </div>
            <div className="viu-item">
              <div className="investidor-avatar small dark">ML</div>
              <div><strong>Marcos Lima</strong><p>Investidor anjo · Há 3 horas</p></div>
            </div>
            <div className="viu-item">
              <div className="investidor-avatar small blue">FA</div>
              <div><strong>Fundo Alvorada</strong><p>VC</p></div>
            </div>
            <div className="viu-item">
              <div className="investidor-avatar small green">GV</div>
              <div><strong>Gaia Ventures</strong><p>VC</p></div>
            </div>
          </div>

          <div className="alia-info-card">
            <h4>Melhore a análise da A.L.I.A</h4>
            <p>A A.L.I.A. te dá dicas do seu perfil, mas também vai reportar o modo em que o site foi feito e os outros de seu perfil se você autorizar.</p>
            <button className="btn-roxo-full">Revisar descrição</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Investidores;