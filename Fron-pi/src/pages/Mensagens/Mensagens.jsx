import React, { useState } from 'react';
import './Mensagens.css';
import { 
  Search, MessageSquare, Calendar, MoreHorizontal, Paperclip, Send, 
  CheckCheck, User, Play, Bell, Home, Target, Star, Bookmark, Briefcase, Settings, Zap
} from 'lucide-react';

function Mensagens() {
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
          <a href="#" className="nav-link active">Mensagens</a>
          <a href="#" className="nav-link">Notificações</a>
        </nav>
        <div className="header-avatar">
          <div className="avatar-circle">JS</div>
        </div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-msg">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches <span className="badge-orange">1</span></li>
            <li><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li><Star size={18} /> Favoritos</li>
            <li className="active"><MessageSquare size={18} /> Mensagens</li>
            <li><Bookmark size={18} /> Portfólio</li>
            <li><Briefcase size={18} /> Minhas qualificações</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>

          <div className="user-footer">
             <div className="user-avatar">ML</div>
             <div>
               <strong>Marcos Lima</strong>
               <p>Investidor Anjo</p>
             </div>
          </div>
        </aside>

        {/* LISTA DE CONVERSAS (COLUNA 2) */}
        <div className="lista-conversas">
          <div className="lista-header">
            <h2>Mensagens</h2>
            <div className="search-conversas">
              <Search size={14} color="#94a3b8" />
              <input type="text" placeholder="Buscar conversas" />
            </div>
            <div className="tabs-conversas">
              {['Todos', 'Startups', 'Não lidas'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="conversas-list">
            {/* Conversa Ativa */}
            <div className="conversa-item active">
              <div className="avatar-box orange">CD</div>
              <div className="conversa-info">
                <div className="conversa-top">
                  <strong>Cohelita Digital</strong>
                  <span className="time">14:12</span>
                </div>
                <p className="conversa-preview">Segue o deck. O churn caiu para 3%</p>
              </div>
              <span className="unread-badge">1</span>
            </div>

            {/* Outras conversas */}
            <div className="conversa-item">
              <div className="avatar-box purple">NH</div>
              <div className="conversa-info">
                <div className="conversa-top">
                  <strong>Nuvia Health</strong>
                  <span className="time">12:40</span>
                </div>
                <p className="conversa-preview">Podemos agendar a due diligence?</p>
              </div>
              <span className="unread-badge">2</span>
            </div>

            <div className="conversa-item">
              <div className="avatar-box green">E</div>
              <div className="conversa-info">
                <div className="conversa-top">
                  <strong>Edila</strong>
                  <span className="time">ontem</span>
                </div>
                <p className="conversa-preview">Reunião confirmada, quinta 14h</p>
              </div>
            </div>

            <div className="conversa-item">
              <div className="avatar-box dark">MV</div>
              <div className="conversa-info">
                <div className="conversa-top">
                  <strong>Mover</strong>
                  <span className="time">ontem</span>
                </div>
                <p className="conversa-preview">Obrigado por aceitar a conexão</p>
              </div>
            </div>

            <div className="conversa-item">
              <div className="avatar-box blue">VC</div>
              <div className="conversa-info">
                <div className="conversa-top">
                  <strong>Vortice Capital</strong>
                  <span className="time">2 d</span>
                </div>
                <p className="conversa-preview">Enviamos o relatório de setembro</p>
              </div>
            </div>

            <div className="conversa-item">
              <div className="avatar-box slate">GA</div>
              <div className="conversa-info">
                <div className="conversa-top">
                  <strong>Gaia AgroTech</strong>
                  <span className="time">3 d</span>
                </div>
                <p className="conversa-preview">Gostaríamos de apresentar o pitch</p>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DO CHAT (COLUNA 3) */}
        <main className="chat-area">
          <div className="chat-header">
            <div className="avatar-box orange small">CD</div>
            <div className="chat-header-info">
              <h3>Rafael Nogueira</h3>
              <p>Fundador · Cohelita Digital <span className="online-dot"></span> Online agora</p>
            </div>
            <div className="chat-header-actions">
              <button className="btn-outline"><Calendar size={14}/> Agendar</button>
              <button className="btn-icon"><MoreHorizontal size={16}/></button>
            </div>
          </div>

          <div className="chat-messages">
            <div className="date-divider"><span>Hoje</span></div>

            {/* Balão Recebido */}
            <div className="msg-row received">
              <div className="msg-bubble white">
                <p>Oi Marcos! Obrigado por conectar. Posso te apresentar a Cohelita Digital em 10 minutos?</p>
                <span className="msg-time">13:50</span>
              </div>
            </div>

            {/* Balão Enviado */}
            <div className="msg-row sent">
              <div className="msg-bubble blue">
                <p>Claro, Rafael. Vi o reels de vocês e gostei do crescimento. Como está o churn dos produtores?</p>
                <span className="msg-time">13:58 <CheckCheck size={12}/></span>
              </div>
            </div>

            {/* Balão Recebido */}
            <div className="msg-row received">
              <div className="msg-bubble white">
                <p>Caiu para 3% depois do novo onboarding. Segue o deck atualizado com os números de setembro.</p>
                <span className="msg-time">14:10</span>
              </div>
            </div>

            {/* Anexo */}
            <div className="msg-row received">
               <div className="file-attachment">
                 <div className="file-icon"><Paperclip size={16} /></div>
                 <div className="file-info">
                   <strong>Cohelita_Digital_Deck_Set26.pdf</strong>
                   <span>4.2 MB · Postado 14:12</span>
                 </div>
               </div>
            </div>

            {/* Balão Enviado */}
            <div className="msg-row sent">
              <div className="msg-bubble blue">
                <p>Obrigado. Vamos marcar uma conversa para falar da rodada de R$1.2M?</p>
                <span className="msg-time">14:15 <CheckCheck size={12}/></span>
              </div>
            </div>

            {/* Reunião Sugerida */}
            <div className="msg-row received">
              <div className="reuniao-card">
                <div className="reuniao-header">
                  <span className="icon-calendar-badge"><Calendar size={14}/></span>
                  <strong>Reunião sugerida por você</strong>
                </div>
                <h4>Quinta, 14h · videochamada de 30 minutos</h4>
                <p>Pauta: números de setembro, uso dos recursos e próximos passos.</p>
                <div className="reuniao-actions">
                  <button className="btn-primary-blue">Aceitar</button>
                  <button className="btn-outline">Sugerir outro horário</button>
                </div>
              </div>
            </div>

          </div>

          <div className="chat-input-area">
            <button className="btn-icon"><Paperclip size={18}/></button>
            <input type="text" placeholder="Escreva uma mensagem..." />
            <button className="btn-enviar">Enviar</button>
          </div>
        </main>

        {/* COLUNA DIREITA (DETALHES) */}
        <aside className="right-panel-msg">
          <div className="profile-details">
            <div className="avatar-box orange large">CD</div>
            <h3>Rafael Nogueira</h3>
            <p className="profile-role">AgroTech · Tração · Recife, PE</p>
            
            <div className="profile-tags">
              <span className="match-tag">94% match</span>
              <span className="tag-alia"><Zap size={10}/> Análise inteligente</span>
            </div>

            <div className="profile-actions">
              <button className="btn-outline">Ver perfil</button>
              <button className="btn-primary-blue"><Calendar size={14}/> Agendar</button>
            </div>
          </div>

          <div className="info-section">
            <h4>Sobre a startup</h4>
            <p>Marketplace B2B que conecta pequenos produtores rurais ao varejo, com logística integrada e pagamento em 7 dias.</p>
            <div className="metrics-row">
              <div><span className="metric-label">R$18k</span><span className="metric-sub">MRR</span></div>
              <div><span className="metric-value green">+22%</span><span className="metric-sub">Crescimento</span></div>
              <div><span className="metric-label blue">R$1.2M</span><span className="metric-sub">Buscado</span></div>
            </div>
          </div>

          <div className="info-section">
            <div className="info-header">
              <h4>Arquivos compartilhados</h4>
              <a href="#" className="link-blue">Ver todos</a>
            </div>
            <div className="file-list-item">
              <div className="file-icon"><Paperclip size={14}/></div>
              <div className="file-info">
                <strong>Cohelita_Digital_Deck_Set26.pdf</strong>
                <span>4.2 MB</span>
              </div>
            </div>
            <div className="file-list-item">
              <div className="file-icon"><Paperclip size={14}/></div>
              <div className="file-info">
                <strong>Projeções_2026.xlsx</strong>
                <span>210 KB</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Notas privadas</h4>
            <div className="nota-privada">
              <p>Só você vê estas notas. Ex: pedir contrato-modelo e referências de clientes.</p>
              <span>🔒 Conversas não são lidas pela A.L.I.A.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Mensagens;