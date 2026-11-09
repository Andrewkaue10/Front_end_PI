import React, { useState } from 'react';
import './Settings.css';
import { 
  Home, Target, Star, Bell, Bookmark, MessageSquare, Briefcase, Settings, 
  Search, Check, ExternalLink, Zap, ShieldCheck, X
} from 'lucide-react';

function Configuracoes() {
  // Estados para os toggles
  const [verificacao, setVerificacao] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  const [avisarStartups, setAvisarStartups] = useState(true);
  const [analiseAlia, setAnaliseAlia] = useState(true);
  const [aparecerBusca, setAparecerBusca] = useState(true);
  const [mostrarVisitantes, setMostrarVisitantes] = useState(false);

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
        <aside className="sidebar-config">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches <span className="badge-orange">1</span></li>
            <li><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li><Star size={18} /> Favoritos</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Bookmark size={18} /> Portfólio</li>
            <li><Briefcase size={18} /> Minhas qualificações</li>
            <li className="active"><Settings size={18} /> Configurações</li>
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
        <main className="content-config">
          <div className="content-header-config">
            <div>
              <h1>Configurações</h1>
              <p className="subtitle">Gerencie sua conta, notificações, privacidade, plano e segurança.</p>
            </div>
            <button className="btn-primary-blue">Salvar alterações</button>
          </div>

          {/* CARD: CONTA */}
          <section className="config-card">
            <div className="card-header-config">
              <h3>Conta</h3>
              <p>Dados da conta e contato</p>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Nome completo</label>
                <input type="text" defaultValue="Marcos Lima" />
              </div>
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" defaultValue="marcos.lima@gmail.com" />
              </div>
              <div className="input-group">
                <label>Telefone</label>
                <input type="text" defaultValue="(81) 99509-0000" />
              </div>
              <div className="input-group">
                <label>Tipo de perfil</label>
                <select defaultValue="Investidor anjo">
                  <option>Investidor anjo</option>
                  <option>Startup</option>
                  <option>Mentor</option>
                </select>
              </div>
            </div>
            <div className="button-row">
              <button className="btn-outline">Alterar senha</button>
              <button className="btn-outline">Alterar e-mail</button>
            </div>
            
            <div className="toggle-row">
              <div>
                <strong>Verificação em dois etapas</strong>
                <p>Proteja sua conta com um código extra no momento do login.</p>
              </div>
              <div className={`toggle ${verificacao ? 'active' : ''}`} onClick={() => setVerificacao(!verificacao)}></div>
            </div>
          </section>

          {/* CARD: NOTIFICAÇÕES */}
          <section className="config-card">
            <div className="card-header-config">
              <h3>Notificações</h3>
              <p>Escolha o que você recebe e por qual canal. Tem de prioridade alta chegam por push + e-mail.</p>
            </div>
            
            <div className="notificacao-grupo">
              <div className="notif-titulo"><Zap size={14} color="#f97316"/> Oportunidades</div>
              <p className="notif-desc">Novas startups compatíveis e rodadas abertas.</p>
              <div className="channels">
                <label><input type="checkbox" defaultChecked /> App</label>
                <label><input type="checkbox" defaultChecked /> E-mail</label>
                <label><input type="checkbox" /> WhatsApp</label>
              </div>
            </div>

            <div className="notificacao-grupo">
              <div className="notif-titulo"><MessageSquare size={14} color="#3b82f6"/> Conversas e reuniões</div>
              <p className="notif-desc">Mensagens, pedidos de conexão e agendas.</p>
              <div className="channels">
                <label><input type="checkbox" defaultChecked /> App</label>
                <label><input type="checkbox" defaultChecked /> E-mail</label>
                <label><input type="checkbox" /> WhatsApp</label>
              </div>
            </div>

            <div className="notificacao-grupo">
              <div className="notif-titulo"><Briefcase size={14} color="#64748b"/> Portfólio</div>
              <p className="notif-desc">Relatórios e atualizações das startups do portfólio.</p>
              <div className="channels">
                <label><input type="checkbox" defaultChecked /> App</label>
                <label><input type="checkbox" defaultChecked /> E-mail</label>
                <label><input type="checkbox" /> WhatsApp</label>
              </div>
            </div>

            <div className="notificacao-grupo">
              <div className="notif-titulo"><Star size={14} color="#eab308"/> Interações sociais</div>
              <p className="notif-desc">Comentários, curtidas e novos seguidores.</p>
              <div className="channels">
                <label><input type="checkbox" defaultChecked /> App</label>
                <label><input type="checkbox" /> E-mail</label>
                <label><input type="checkbox" /> WhatsApp</label>
              </div>
            </div>

            <div className="notificacao-grupo">
              <div className="notif-titulo"><ShieldCheck size={14} color="#ef4444"/> Conta e segurança</div>
              <p className="notif-desc">Login, senha, dispositivos e alertas.</p>
              <div className="channels">
                <label><input type="checkbox" defaultChecked /> App</label>
                <label><input type="checkbox" defaultChecked /> E-mail</label>
                <label><input type="checkbox" /> WhatsApp</label>
              </div>
            </div>

            <div className="toggle-row border-top">
              <div>
                <strong>Resumo semanal por e-mail</strong>
                <p>8 novas startups compatíveis e conexões pendentes.</p>
              </div>
              <div className={`toggle ${notificacoesPush ? 'active' : ''}`} onClick={() => setNotificacoesPush(!notificacoesPush)}></div>
            </div>
            <div className="toggle-row">
              <div>
                <strong>Avisar quando eu levar novas startups compatíveis</strong>
                <p>Alertas em tempo real sobre oportunidades.</p>
              </div>
              <div className={`toggle ${avisarStartups ? 'active' : ''}`} onClick={() => setAvisarStartups(!avisarStartups)}></div>
            </div>
          </section>

          {/* CARD: PRIVACIDADE E A.L.I.A (Roxo) */}
          <section className="config-card roxo-card">
            <div className="card-header-config">
              <h3>Privacidade e A.L.I.A</h3>
              <p>Controle quem vê seu perfil e como a assistente de compatibilidade pode te ajudar.</p>
            </div>

            <div className="toggle-row">
              <div>
                <strong>Permitir a A.L.I.A ler meus textos de investimento</strong>
                <p>A A.L.I.A lê o seu perfil e suas teses de investimento e destaca startups com 90% de match.</p>
              </div>
              <div className={`toggle-purple ${analiseAlia ? 'active' : ''}`} onClick={() => setAnaliseAlia(!analiseAlia)}>
                 <div className="toggle-dot"></div>
              </div>
            </div>

            <div className="alia-warning">
              A leitura é feita dentro do seu espaço. A A.L.I.A não compartilha seus dados, anotações, mentorias, conversas ou o seu perfil com terceiros. Você pode desativar a análise a qualquer momento (e o histórico de leitura será limpo).
            </div>

            <div className="toggle-row border-top">
              <div>
                <strong>Aparecer nas sugestões</strong>
                <p>Seu perfil aparece como sugestão para startups compatíveis.</p>
              </div>
              <div className={`toggle ${aparecerBusca ? 'active' : ''}`} onClick={() => setAparecerBusca(!aparecerBusca)}></div>
            </div>

            <div className="toggle-row">
              <div>
                <strong>Mostrar quando eu visitar perfis</strong>
                <p>As startups veem que você visitou o perfil delas.</p>
              </div>
              <div className={`toggle ${mostrarVisitantes ? 'active' : ''}`} onClick={() => setMostrarVisitantes(!mostrarVisitantes)}></div>
            </div>

            <div className="toggle-row border-top">
               <div><strong>Quem pode solicitar conexões</strong></div>
               <a href="#" className="link-perfil">Perfil compatível ↗</a>
            </div>
          </section>

          {/* CARD: PLANO */}
          <section className="config-card">
            <div className="card-header-config">
              <h3>Plano</h3>
              <p>Você está no plano gratuito e o plano Pro é apenas uma atualização, sem cancelamento.</p>
            </div>

            <div className="planos-grid">
              <div className="plano-card">
                <h4>Gratuito</h4>
                <p className="plano-sub">Para começar a investir</p>
                <ul>
                  <li><Check size={14} color="#10b981"/> Sugestões por interesses básicos</li>
                  <li><Check size={14} color="#10b981"/> 5 conexões por mês</li>
                  <li><Check size={14} color="#10b981"/> Conexões, mensagens e reuniões</li>
                  <li><Check size={14} color="#10b981"/> Perfil, publicações e rede</li>
                </ul>
              </div>

              <div className="plano-card pro">
                <div className="pro-header">
                   <h4>Pro</h4>
                   <span className="tag-pro">Seu plano atual</span>
                </div>
                <p className="plano-sub">Para investidores em atividade</p>
                <ul>
                  <li><Check size={14} color="#9333ea"/> Tudo do plano Gratuito</li>
                  <li><Check size={14} color="#9333ea"/> Análise inteligente da A.L.I.A (100% do recurso)</li>
                  <li><Check size={14} color="#9333ea"/> Alertas antecipados de rodada</li>
                  <li><Check size={14} color="#9333ea"/> Exportar e comparar até 30 startups</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CARD: SEGURANÇA E DISPOSITIVOS */}
          <section className="config-card">
            <div className="card-header-config">
              <h3>Segurança e dispositivos</h3>
              <p>Sessões em que você está conectado</p>
            </div>
            
            <div className="dispositivo-row">
              <div className="disp-info">
                <strong>Chrome no Windows - Recife, PE</strong>
                <p>3 dias atrás</p>
              </div>
              <span className="tag-atual">Sessão atual</span>
            </div>
            
            <div className="dispositivo-row">
              <div className="disp-info">
                <strong>App no iPhone - Recife, PE</strong>
                <p>2 dias atrás</p>
              </div>
              <button className="btn-text-red">Encerrar</button>
            </div>

            <div className="dispositivo-row">
              <div className="disp-info">
                <strong>Safari no Mac - Olinda, PE</strong>
                <p>2 dias atrás</p>
              </div>
              <button className="btn-text-red">Encerrar</button>
            </div>
          </section>

          {/* ZONA DE PERIGO */}
          <section className="danger-zone">
             <div className="card-header-config">
              <h3>Zona de risco</h3>
              <p>Ações irreversíveis para a sua conta.</p>
            </div>
            
            <div className="danger-row">
              <div>
                <strong>Pausar perfil</strong>
                <p>Seu perfil e sugestões ficam ocultos até você reativar. Suas conexões e mensagens continuam.</p>
              </div>
              <button className="btn-outline-red">Pausar perfil</button>
            </div>

            <div className="danger-row border-top">
              <div>
                <strong>Excluir conta</strong>
                <p>Seus dados serão apagados permanentemente, incluindo seu acesso. A.L.I.A e seus matchs serão excluídos.</p>
              </div>
              <button className="btn-outline-red">Excluir conta</button>
            </div>
          </section>

        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel-config">
          
          <div className="user-profile-card">
            <div className="avatar-large dark">ML</div>
            <h3>Marcos Lima</h3>
            <p>Investidor anjo</p>
            <div className="profile-tags-config">
              <span className="tag-green"><Check size={10}/> Perfil completo</span>
              <span className="tag-purple"><Zap size={10}/> Pro: ativado</span>
            </div>
          </div>

          <div className="section-right-config">
            <h4>Atalhos</h4>
            <ul className="shortcuts-list">
              <li>Exportar meus dados <ExternalLink size={12}/></li>
              <li>Central de ajuda <ExternalLink size={12}/></li>
              <li>Falar com o suporte <ExternalLink size={12}/></li>
              <li>Termos de uso <ExternalLink size={12}/></li>
              <li>Política de privacidade <ExternalLink size={12}/></li>
            </ul>
          </div>

          <div className="section-right-config">
            <h4>Estado do perfil</h4>
            <div className="estado-row"><span>Visualizações</span><strong className="text-green-600">124</strong></div>
            <div className="estado-row"><span>Solicitações</span><strong className="text-green-600">8</strong></div>
            <div className="estado-row"><span>Visualização há 7 dias</span><strong className="text-green-600">Mais</strong></div>
          </div>

        </aside>
      </div>
    </div>
  );
}

export default Configuracoes;