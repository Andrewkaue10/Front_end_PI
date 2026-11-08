import React, { useState } from 'react';
import './Notification.css';
import { 
  Bell, Home, Target, Star, Bookmark, MessageSquare, Briefcase, Settings, 
  Search, CheckCircle, Clock, Check, User, Shield 
} from 'lucide-react';

function Notification() {
  const [activeTab, setActiveTab] = useState('Todas');

  const notifications = [
    {
      id: 1,
      type: 'match',
      icon: <Target size={18} color="#10b981" />,
      title: 'Nova startup com 94% de match: Cohelita Digital',
      desc: 'AgroTech - Traccio, Marketplace B2B que conecta produtores rurais ao varejo, alinhado à sua tese de impacto social.',
      time: 'Há 20 min',
      tag: 'Média',
      tagColor: 'bg-blue-100 text-blue-700',
      actions: [{ label: 'Ver perfil', primary: true }, { label: 'Favoritar', primary: false }],
      unread: true
    },
    {
      id: 2,
      type: 'match',
      icon: <Target size={18} color="#10b981" />,
      title: 'Cohelita Digital chegou a 80% da meta de captação',
      desc: 'R$ 1,2M captados e rodada de R$ 1,5M aberta até o dia 10/08.',
      time: 'Há 1 h',
      tag: 'Alta',
      tagColor: 'bg-red-100 text-red-600',
      actions: [{ label: 'Ver detalhes', primary: true }],
      unread: true
    },
    {
      id: 3,
      type: 'alert',
      icon: <Clock size={18} color="#f59e0b" />,
      title: 'A rodada da Nuvia Health encerra em 3 dias',
      desc: 'A janela de investimento fecha em 12/07. Há 2 investidores em due diligence.',
      time: 'Há 2 h',
      tag: 'Alta',
      tagColor: 'bg-red-100 text-red-600',
      actions: [{ label: 'Ver rodada', primary: true }],
      unread: true
    },
    {
      id: 4,
      type: 'message',
      icon: <User size={18} color="#f59e0b" />,
      title: 'Mover quer se conectar com você',
      desc: 'Startup de Mobilidade - Seed, 85% de match com seu perfil. Enviou uma mensagem de apresentação.',
      time: 'Há 3 h',
      tag: 'Alta',
      tagColor: 'bg-red-100 text-red-600',
      actions: [{ label: 'Aceitar', primary: true }, { label: 'Recusar', primary: false }],
      unread: true
    },
    {
      id: 5,
      type: 'message',
      icon: <MessageSquare size={18} color="#3b82f6" />,
      title: 'Nova mensagem de Rafael Nogueira',
      desc: '"Marcos, posso enviar o deck atualizado com os números de setembro?"',
      time: 'Há 4 h',
      tag: 'Alta',
      tagColor: 'bg-red-100 text-red-600',
      actions: [{ label: 'Responder', primary: true }],
      unread: true
    },
    {
      id: 6,
      type: 'comment',
      icon: <MessageSquare size={18} color="#f59e0b" />,
      title: 'Beatriz Santos comentou no seu post',
      desc: '"Concordo com a tese de recorrência. Na Cohelita Digital o churn caiu para 3% depois do onboarding novo."',
      time: 'Há 5 h',
      tag: 'Média',
      tagColor: 'bg-blue-100 text-blue-700',
      actions: [],
      unread: true
    },
    {
      id: 7,
      type: 'match',
      icon: <Target size={18} color="#10b981" />,
      title: 'Vortice Capital (favorita) atualizou o MRR',
      desc: 'De R$84k para R$126k em 30 dias, crescimento de 50%. Também abriu uma nova rodada.',
      time: 'Há 6 h',
      tag: 'Média',
      tagColor: 'bg-blue-100 text-blue-700',
      actions: [{ label: 'Ver atualização', primary: true }],
      unread: true
    },
    {
      id: 8,
      type: 'match',
      icon: <CheckCircle size={18} color="#10b981" />,
      title: 'Édila atualizou o perfil e agora combina 87% com sua tese',
      desc: 'Mudou de estágio (Seed → Tração) e passou a receber rodada recorrente.',
      time: 'Ontem',
      tag: 'Média',
      tagColor: 'bg-blue-100 text-blue-700',
      actions: [{ label: 'Ver perfil', primary: true }],
      unread: false
    },
    {
      id: 9,
      type: 'match',
      icon: <Target size={18} color="#10b981" />,
      title: 'Édila está entre as startups mais vistas da semana',
      desc: '2,4 mil visualizações em 7 dias. 30 novos investidores e 4 novos leads.',
      time: 'Ontem',
      tag: 'Média',
      tagColor: 'bg-blue-100 text-blue-700',
      actions: [],
      unread: false
    }
  ];

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
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches</li>
            <li className="active"><Bell size={18} /> Notificações <span className="badge">7</span></li>
            <li><Star size={18} /> Favoritos</li>
            <li><Bookmark size={18} /> Portfólio</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Briefcase size={18} /> Minhas qualificações</li>
            <li><Settings size={18} /> Configurações</li>
          </ul>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="content">
          <div className="content-header">
            <div>
              <h1>Notificações</h1>
              <p className="subtitle">Você tem 7 notificações não lidas</p>
            </div>
            <div className="header-actions">
              <button className="btn-secondary"><Check size={16} /> Marcar todas como lidas</button>
              <button className="btn-secondary"><Settings size={16} /> Preferências</button>
            </div>
          </div>

          {/* FILTROS */}
          <div className="filters">
            {['Todas 23', 'Oportunidades 7', 'Conversas 6', 'Portfólio 4'].map((filter) => {
              const label = filter.split(' ')[0];
              return (
                <button 
                  key={label}
                  className={`filter-btn ${activeTab === label ? 'active' : ''}`}
                  onClick={() => setActiveTab(label)}
                >
                  {filter}
                </button>
              )
            })}
          </div>

          {/* LISTA DE NOTIFICAÇÕES */}
          <div className="notification-list">
            <div className="section-title">HOJE</div>
            {notifications.slice(0, 7).map((notif) => (
              <div key={notif.id} className={`notification-card ${notif.unread ? 'unread' : ''}`}>
                <div className="notif-icon">{notif.icon}</div>
                <div className="notif-content">
                  <div className="notif-header">
                    <h3>{notif.title}</h3>
                    <div className="notif-meta">
                      <span className="time">{notif.time}</span>
                      <span className={`tag ${notif.tagColor}`}>{notif.tag}</span>
                    </div>
                  </div>
                  <p className="notif-desc">{notif.desc}</p>
                  {notif.actions.length > 0 && (
                    <div className="notif-actions">
                      {notif.actions.map((action, idx) => (
                        <button key={idx} className={action.primary ? 'btn-primary-small' : 'btn-outline-small'}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="section-title">ONTEM</div>
            {notifications.slice(7).map((notif) => (
              <div key={notif.id} className={`notification-card ${notif.unread ? 'unread' : ''}`}>
                <div className="notif-icon">{notif.icon}</div>
                <div className="notif-content">
                  <div className="notif-header">
                    <h3>{notif.title}</h3>
                    <div className="notif-meta">
                      <span className="time">{notif.time}</span>
                      <span className={`tag ${notif.tagColor}`}>{notif.tag}</span>
                    </div>
                  </div>
                  <p className="notif-desc">{notif.desc}</p>
                  {notif.actions.length > 0 && (
                    <div className="notif-actions">
                      {notif.actions.map((action, idx) => (
                        <button key={idx} className={action.primary ? 'btn-primary-small' : 'btn-outline-small'}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel">
          <div className="summary-card">
            <h3>Resumo da semana</h3>
            <p>8 novas startups compatíveis · 3 conexões pendentes · 2 reuniões agendadas</p>
            <button className="btn-primary-full">Ver resumo completo</button>
          </div>

          <div className="priority-section">
            <h4>Níveis de prioridade</h4>
            <div className="priority-item">
              <span className="tag bg-red-100 text-red-600">Alta</span>
              <span>Push + e-mail, conexões, mensagens, reuniões e metas de captação</span>
            </div>
            <div className="priority-item">
              <span className="tag bg-blue-100 text-blue-700">Média</span>
              <span>SSO dentro do app, matches, favoritos e comentários</span>
            </div>
            <div className="priority-item">
              <span className="tag bg-gray-100 text-gray-600">Resumo</span>
              <span>Agrupa no resumo semanal: curtidas, seguidores e eventos</span>
            </div>
          </div>

          <div className="preferences-section">
            <h4>Preferências por canal</h4>
            
            <div className="pref-group">
              <div className="pref-title"><Target size={14} /> Oportunidades</div>
              <div className="pref-channels">
                <span className="channel active"><Check size={12}/> App</span>
                <span className="channel active"><Check size={12}/> E-mail</span>
                <span className="channel active"><Check size={12}/> WhatsApp</span>
              </div>
            </div>

            <div className="pref-group">
              <div className="pref-title"><MessageSquare size={14} /> Conversas e reuniões</div>
              <div className="pref-channels">
                <span className="channel active"><Check size={12}/> App</span>
                <span className="channel active"><Check size={12}/> E-mail</span>
                <span className="channel active"><Check size={12}/> WhatsApp</span>
              </div>
            </div>

            <div className="pref-group">
              <div className="pref-title"><Bookmark size={14} /> Portfólio</div>
              <div className="pref-channels">
                <span className="channel active"><Check size={12}/> App</span>
                <span className="channel active"><Check size={12}/> E-mail</span>
                <span className="channel inactive">WhatsApp</span>
              </div>
            </div>

            <div className="pref-group">
              <div className="pref-title"><Star size={14} /> Interações sociais</div>
              <div className="pref-channels">
                <span className="channel active"><Check size={12}/> App</span>
                <span className="channel active"><Check size={12}/> E-mail</span>
                <span className="channel inactive">WhatsApp</span>
              </div>
            </div>

            <div className="pref-group">
              <div className="pref-title"><Shield size={14} /> Conta e segurança</div>
              <div className="pref-channels">
                <span className="channel active"><Check size={12}/> App</span>
                <span className="channel active"><Check size={12}/> E-mail</span>
                <span className="channel inactive">WhatsApp</span>
              </div>
            </div>

            <div className="toggle-row">
              <span>Avisar quando startups virem meu perfil</span>
              <div className="toggle active"></div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}

export default Notification;