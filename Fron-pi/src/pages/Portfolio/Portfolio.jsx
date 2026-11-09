import React, { useState } from 'react';
import './Portfolio.css';
import { 
  Home, Target, Star, Bell, Bookmark, MessageSquare, Briefcase, Settings, 
  Search, Download, ArrowRight, FileText, CheckCircle, AlertTriangle, TrendingUp, Building
} from 'lucide-react';

// Mock dos dados do portfólio
const mockInvestimentos = [
  { id: 1, iniciais: 'CD', cor: 'orange', nome: 'Cohelita Digital', tag: 'AgroTech · Tração', aporte: 'R$150k', participacao: '4,2%', data: '12/09/26', status: 'Ativo', statusCor: 'bg-green-100 text-green-700' },
  { id: 2, iniciais: 'E', cor: 'green', nome: 'Edila', tag: 'EdTech · Tração', aporte: 'R$100k', participacao: '3,0%', data: '20/08/26', status: 'Ativo', statusCor: 'bg-green-100 text-green-700' },
  { id: 3, iniciais: 'VC', cor: 'blue', nome: 'Vórtice Capital', tag: 'Fintech · Seed', aporte: 'R$80k', participacao: '2,5%', data: '02/10/26', status: 'Ativo', statusCor: 'bg-green-100 text-green-700' },
  { id: 4, iniciais: 'GA', cor: 'slate', nome: 'Gaia AgroTech', tag: 'AgroTech · Seed', aporte: 'R$60k', participacao: '1,8%', data: '15/07/26', status: 'Ativo', statusCor: 'bg-green-100 text-green-700' },
  { id: 5, iniciais: 'PP', cor: 'dark', nome: 'Pixel Pay', tag: 'Fintech · MVP', aporte: 'R$30k', participacao: '1,2%', data: '03/06/26', status: 'Ativo', statusCor: 'bg-green-100 text-green-700' },
  { id: 6, iniciais: 'NH', cor: 'purple', nome: 'Nuvia Health', tag: 'HealthTech · MVP', aporte: 'R$50k', participacao: 'previsto', data: 'due diligence', status: 'Em due diligence', statusCor: 'bg-purple-100 text-purple-700' },
  { id: 7, iniciais: 'MV', cor: 'dark', nome: 'Mover', tag: 'Mobilidade · Seed', aporte: 'R$40k', participacao: 'previsto', data: 'termo em análise', status: 'Em negociação', statusCor: 'bg-orange-100 text-orange-700' },
];

const mockUpdates = [
  { id: 1, tipo: 'grafico', titulo: 'Cohelita Digital enviou o relatório de setembro', desc: 'GMV +22% · 320 produtores ativos · há 1 dia' },
  { id: 2, tipo: 'doc', titulo: 'Edila atualizou o pitch deck e liberou o data room', desc: 'Projeções 2026 e contratos-modelo · há 2 dias' },
  { id: 3, tipo: 'seta', titulo: 'Vórtice Capital atingiu MRR de R$9k', desc: '+50% em 30 dias · há 3 dias' },
  { id: 4, tipo: 'estrela', titulo: 'Gaia AgroTech fechou parceria com cooperativa', desc: 'Marco do primeiro trimestre · há 5 dias' },
];

function Portfolio() {
  const [activeTab, setActiveTab] = useState('Todos');

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
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-port">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches <span className="badge-orange">1</span></li>
            <li><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li><Star size={18} /> Favoritos</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li className="active"><Bookmark size={18} /> Portfólio</li>
            <li><Briefcase size={18} /> Minhas qualificações</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>

          {/* Card do Usuário no rodapé da Sidebar */}
          <div className="user-footer">
             <div className="user-avatar dark">ML</div>
             <div>
               <strong>Marcos Lima</strong>
               <p>Investidor Anjo</p>
             </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="content-port">
          <div className="content-header-port">
            <div>
              <h1>Portfólio</h1>
              <p className="subtitle">Startups em que você investiu ou está negociando, com atualizações, relatórios e documentos.</p>
            </div>
            <button className="btn-primary-blue">Registrar investimento</button>
          </div>

          {/* FILTROS */}
          <div className="filters-port">
            {['Todos 7', 'Ativos 5', 'Em negociação 2', 'Encerrados 0'].map((f, i) => (
              <button 
                key={i} 
                className={`filter-btn-port ${activeTab === f.split(' ')[0] ? 'active' : ''}`}
                onClick={() => setActiveTab(f.split(' ')[0])}
              >
                {f}
              </button>
            ))}
          </div>

          {/* CARDS RESUMO */}
          <div className="resumo-grid-port">
            <div className="resumo-card-port">
              <h2>R$420k</h2>
              <p>Capital aplicado</p>
              <span className="resumo-sub">5 investimentos ativos</span>
            </div>
            <div className="resumo-card-port">
              <h2>5</h2>
              <p>Startups ativas</p>
              <span className="resumo-sub">3 setores</span>
            </div>
            <div className="resumo-card-port">
              <h2>2</h2>
              <p>Em negociação</p>
              <span className="resumo-sub blue">R$90k previstos</span>
            </div>
            <div className="resumo-card-port">
              <h2>3</h2>
              <p>Relatórios novos</p>
              <span className="resumo-sub orange">para ler</span>
            </div>
          </div>

          {/* TABELA DE INVESTIMENTOS */}
          <div className="section-header-port">
            <h2 className="section-title-port">Investimentos</h2>
            <a href="#" className="link-blue">Exportar CSV <ArrowRight size={14}/></a>
          </div>
          <p className="subtitle mb-4">Aportes registrados e negociações em andamento</p>

          <div className="tabela-container">
            <table className="tabela-portfolio">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Aporte</th>
                  <th>Participação</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockInvestimentos.map(inv => (
                  <tr key={inv.id}>
                    <td>
                      <div className="startup-cell">
                        <div className={`avatar-mini ${inv.cor}`}>{inv.iniciais}</div>
                        <div>
                          <strong>{inv.nome}</strong>
                          <span>{inv.tag}</span>
                        </div>
                      </div>
                    </td>
                    <td className="bold-cell">{inv.aporte}</td>
                    <td>{inv.participacao}</td>
                    <td className="gray-cell">{inv.data}</td>
                    <td>
                      <span className={`status-badge ${inv.statusCor}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ATUALIZAÇÕES RECENTES */}
          <div className="section-header-port mt-8">
            <h2 className="section-title-port">Atualizações recentes</h2>
            <a href="#" className="link-blue">Ver todas <ArrowRight size={14}/></a>
          </div>
          <p className="subtitle mb-4">Relatórios, marcos e documentos das startups do portfólio</p>

          <div className="updates-list">
            {mockUpdates.map(update => (
              <div key={update.id} className="update-card">
                <div className="update-icon">
                  {update.tipo === 'grafico' && <TrendingUp size={16} color="#2563eb" />}
                  {update.tipo === 'doc' && <FileText size={16} color="#64748b" />}
                  {update.tipo === 'seta' && <TrendingUp size={16} color="#ef4444" />}
                  {update.tipo === 'estrela' && <Star size={16} color="#f59e0b" />}
                </div>
                <div className="update-content">
                  <strong>{update.titulo}</strong>
                  <p>{update.desc}</p>
                </div>
                <button className="btn-outline-blue">Abrir</button>
              </div>
            ))}
          </div>

        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel-port">
          
          <div className="section-right-port">
            <h4>Distribuição por setor</h4>
            <div className="bar-item">
              <div className="bar-header"><span>AgroTech</span><span>46%</span></div>
              <div className="bar-bg"><div className="bar-fill green" style={{ width: '46%' }}></div></div>
            </div>
            <div className="bar-item">
              <div className="bar-header"><span>Fintech</span><span>28%</span></div>
              <div className="bar-bg"><div className="bar-fill blue" style={{ width: '28%' }}></div></div>
            </div>
            <div className="bar-item">
              <div className="bar-header"><span>EdTech</span><span>18%</span></div>
              <div className="bar-bg"><div className="bar-fill purple" style={{ width: '18%' }}></div></div>
            </div>
            <div className="bar-item">
              <div className="bar-header"><span>Outros</span><span>8%</span></div>
              <div className="bar-bg"><div className="bar-fill gray" style={{ width: '8%' }}></div></div>
            </div>
          </div>

          <div className="section-right-port">
            <div className="right-header">
              <h4>Próximos eventos</h4>
              <a href="#" className="link-blue">Agenda</a>
            </div>
            
            <div className="evento-item">
              <div className="evento-data"><span>Qui</span><span>14h</span></div>
              <p>Reunião com Edila</p>
            </div>
            <div className="evento-item">
              <div className="evento-data green"><span>15/11</span></div>
              <p>Relatório trimestral da Vórtice</p>
            </div>
            <div className="evento-item">
              <div className="evento-data purple"><span>18/11</span></div>
              <p>Due diligence da Nuvia Health</p>
            </div>
          </div>

          <div className="section-right-port">
            <h4>Documentos pendentes</h4>
            <div className="doc-pendente">
              <AlertTriangle size={14} color="#f59e0b" />
              <p>Assinar contrato de investimento da <strong>Mover</strong></p>
            </div>
            <div className="doc-pendente">
              <FileText size={14} color="#64748b" />
              <p>Termo de confidencialidade da <strong>Nuvia Health</strong></p>
            </div>
            <button className="btn-outline-blue-full">Ver documentos</button>
          </div>

        </aside>
      </div>
    </div>
  );
}

export default Portfolio;