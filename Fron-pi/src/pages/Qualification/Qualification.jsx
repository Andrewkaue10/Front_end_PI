import React, { useState } from 'react';
import './Qualification.css';
import { 
  Home, Target, Star, Bell, Bookmark, MessageSquare, Briefcase, Settings, 
  Search, Check, Plus, Edit3, Save, Briefcase as BriefcaseIcon, TrendingUp, 
  MapPin, DollarSign, Award, ShieldCheck
} from 'lucide-react';

function Qualificacoes() {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(['AgroTech', 'Fintech', 'SaaS B2B', 'Marketplace', 'ESG']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
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
          <a href="#" className="nav-link">Notificações</a>
        </nav>
        <div className="header-avatar">
          <div className="avatar-circle">JS</div>
        </div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR */}
        <aside className="sidebar-qual">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches <span className="badge-orange">1</span></li>
            <li><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li><Star size={18} /> Favoritos</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Bookmark size={18} /> Portfólio</li>
            <li className="active"><Briefcase size={18} /> Minhas qualificações</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>
          <div className="user-footer">
             <div className="user-avatar dark">ML</div>
             <div>
               <strong>Marcos Lima</strong>
               <p>Investidor Anjo</p>
             </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="content-qual">
          <div className="content-header-qual">
            <div>
              <h1>Minhas qualificações</h1>
              <p className="subtitle">Complete seu perfil para receber recomendações de startups mais precisas da A.L.I.A.</p>
            </div>
            <button 
              className={isEditing ? "btn-primary-blue" : "btn-outline-blue"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <><Save size={16}/> Salvar alterações</> : <><Edit3 size={16}/> Editar perfil</>}
            </button>
          </div>

          {/* CARD DE PROGRESSO */}
          <div className="progress-card">
            <div className="progress-header">
              <div>
                <h3>Perfil 80% completo</h3>
                <p>Falta apenas adicionar seu portfólio de investimentos anteriores.</p>
              </div>
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">80%</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="qual-grid">
            
            {/* COLUNA ESQUERDA: DADOS BÁSICOS */}
            <div className="qual-col">
              <section className="config-card">
                <div className="card-header-config">
                  <h3>Informações Básicas</h3>
                  <p>Como você se apresenta no ecossistema.</p>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Nome completo</label>
                    <input type="text" defaultValue="Marcos Lima" disabled={!isEditing} />
                  </div>
                  <div className="input-group">
                    <label>Cargo / Título</label>
                    <input type="text" defaultValue="Investidor Anjo e Advisor" disabled={!isEditing} />
                  </div>
                  <div className="input-group full-width">
                    <label>Bio / Resumo profissional</label>
                    <textarea rows="3" defaultValue="Investidor anjo com foco em startups B2B de tecnologia. Mais de 10 anos de experiência como executivo de vendas em multinacionais." disabled={!isEditing}></textarea>
                  </div>
                  <div className="input-group">
                    <label>Localização</label>
                    <div className="input-with-icon">
                       <MapPin size={16} />
                       <input type="text" defaultValue="Recife, PE" disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>LinkedIn</label>
                    <input type="url" defaultValue="linkedin.com/in/marcoslima" disabled={!isEditing} />
                  </div>
                </div>
              </section>

              <section className="config-card">
                <div className="card-header-config">
                  <h3>Tese de Investimento</h3>
                  <p>O que você busca e como pode agregar.</p>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Ticket Médio</label>
                    <div className="input-with-icon">
                      <DollarSign size={16} />
                      <input type="text" defaultValue="R$ 50k - R$ 200k" disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Estágio Preferido</label>
                    <select disabled={!isEditing}>
                      <option>Seed / Tração</option>
                      <option>Pré-seed</option>
                      <option>Série A</option>
                    </select>
                  </div>
                  <div className="input-group full-width">
                    <label>Setores de Interesse</label>
                    <div className="skills-container">
                      {skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                      {isEditing && (
                        <form onSubmit={handleAddSkill} className="add-skill-form">
                          <input 
                            type="text" 
                            placeholder="+ Adicionar" 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)}
                          />
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* COLUNA DIREITA: QUALIFICAÇÕES E EXPERIÊNCIA */}
            <div className="qual-col">
              <section className="config-card">
                <div className="card-header-config">
                  <h3>Qualificações</h3>
                  <p>Selos e verificações de competência.</p>
                </div>
                <ul className="qual-list">
                  <li>
                    <div className="qual-icon bg-green-100"><ShieldCheck size={16} color="#16a34a"/></div>
                    <div>
                      <strong>Investidor Verificado</strong>
                      <p>Identidade e dados bancários confirmados.</p>
                    </div>
                    <span className="tag-green">Verificado</span>
                  </li>
                  <li>
                    <div className="qual-icon bg-blue-100"><Award size={16} color="#2563eb"/></div>
                    <div>
                      <strong>Membro Fundador</strong>
                      <p>Um dos primeiros investidores da plataforma.</p>
                    </div>
                    <span className="tag-blue">2024</span>
                  </li>
                  <li>
                    <div className="qual-icon bg-orange-100"><TrendingUp size={16} color="#ea580c"/></div>
                    <div>
                      <strong>Investidor Ativo</strong>
                      <p>Mais de 5 aportes registrados no portfólio.</p>
                    </div>
                    <span className="tag-orange">5 Aportes</span>
                  </li>
                </ul>
              </section>

              <section className="config-card">
                <div className="card-header-config">
                  <h3>Experiência Anterior</h3>
                  <p>Histórico profissional fora do ecossistema.</p>
                </div>
                <div className="experience-item">
                  <div className="exp-logo">XP</div>
                  <div>
                    <strong>Diretor de Vendas</strong>
                    <p>XP Inc. · 2018 - 2022</p>
                  </div>
                </div>
                <div className="experience-item">
                  <div className="exp-logo blue">HS</div>
                  <div>
                    <strong>Gerente Comercial</strong>
                    <p>HSBC · 2012 - 2018</p>
                  </div>
                </div>
                {isEditing && (
                  <button className="btn-outline-full"><Plus size={14}/> Adicionar Experiência</button>
                )}
              </section>
            </div>

          </div>
        </main>

        {/* COLUNA DIREITA (Resumo lateral) */}
        <aside className="right-panel-qual">
          <div className="resumo-perfil-card">
            <div className="avatar-large dark">ML</div>
            <h3>Marcos Lima</h3>
            <p>Investidor Anjo</p>
            <div className="badges-row">
              <span className="tag-green"><Check size={10}/> Verificado</span>
              <span className="tag-purple"><Star size={10}/> A.L.I.A Pro</span>
            </div>
          </div>

          <div className="section-right-qual">
            <h4>Estatísticas do Perfil</h4>
            <div className="stat-row"><span>Visualizações</span><strong>1.240</strong></div>
            <div className="stat-row"><span>Conexões feitas</span><strong>48</strong></div>
            <div className="stat-row"><span>Startups no portfólio</span><strong>5</strong></div>
          </div>

          <div className="section-right-qual">
            <h4>Visibilidade</h4>
            <div className="toggle-row">
              <div>
                <strong>Perfil público</strong>
                <p>Visível para startups.</p>
              </div>
              <div className="toggle active"></div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default Qualificacoes;