import React, { useState, useRef, useEffect } from 'react';
import './ALIA.css';
import { 
  Home, Target, Star, Bell, Bookmark, MessageSquare, Briefcase, Settings, 
  Search, Check, X, Zap, CheckCircle, Info, Sparkles, TrendingUp, Send
} from 'lucide-react';

const mockSugestoes = [
  {
    id: 1, iniciais: 'CD', cor: 'orange', nome: 'Cohelita Digital', tags: ['AgroTech', 'Tração'], match: 94,
    regras: 70, semantica: 90, compatibilidade: 94,
    requisitos: [
      { text: 'Mesmo setor de atuação', ok: true },
      { text: 'Valor procurado dentro da faixa do investidor', ok: true },
      { text: 'Descrição próxima da sua tese de receita recorrente', ok: true }
    ]
  },
  {
    id: 2, iniciais: 'VC', cor: 'blue', nome: 'Vórtice Capital', tags: ['Fintech', 'Seed'], match: 89,
    regras: 70, semantica: 70, compatibilidade: 70,
    requisitos: [
      { text: 'Mesmo setor de atuação', ok: true },
      { text: 'Fase de startup compatível com sua preferência', ok: true },
      { text: 'Valor procurado dentro da faixa do investidor', ok: true }
    ]
  },
  {
    id: 3, iniciais: 'MV', cor: 'dark', nome: 'Mover', tags: ['Mobilidade', 'Seed'], match: 87,
    regras: 60, semantica: 60, compatibilidade: 60,
    requisitos: [
      { text: 'Fase de startup compatível com sua preferência', ok: true },
      { text: 'Valor procurado dentro da faixa do investidor', ok: true },
      { text: 'Localização compatível', ok: true }
    ],
    footer: 'Compatibilidade por critérios; a análise de texto não entra porque uma das partes não autorizou o uso do próprio texto.'
  }
];

function ALIA() {
  const [aliaAtiva, setAliaAtiva] = useState(true);

  // ==========================================
  // LÓGICA DO CHAT DA A.L.I.A
  // ==========================================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'received', text: 'Oi, Marcos! Sou a A.L.I.A. 🤖 Posso te ajudar a encontrar as melhores startups para o seu portfólio ou tirar dúvidas sobre compatibilidade. O que você gostaria de saber?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  const gerarResposta = (textoUsuario) => {
    const texto = textoUsuario.toLowerCase();
    
    if (texto.includes('agro') || texto.includes('agrotech')) {
      return "Encontrei 3 startups de AgroTech com alta compatibilidade. A **Cohelita Digital** é a principal, com **94% de match**, pois tem receita recorrente e está no estágio de Tração. Quer que eu abra o perfil dela?";
    }
    if (texto.includes('ticket') || texto.includes('valor')) {
      return "Seu ticket médio configurado é de **R$50k a R$200k**. Das minhas sugestões atuais, a **Cohelita Digital** e a **Vórtice Capital** buscam rodadas dentro dessa faixa.";
    }
    if (texto.includes('fintech')) {
      return "A **Vórtice Capital** é uma Fintech com **89% de match**. Ela acabou de atualizar o MRR para R$9k (+50% no mês). É uma boa oportunidade se você quiser diversificar.";
    }
    if (texto.includes('match') || texto.includes('como funciona')) {
      return "Meu cálculo de match funciona assim: **70% baseado nas regras** (setor, ticket, fase, localização) e **30% baseado na análise de texto** (se a descrição combina com a sua tese). Tudo com total transparência!";
    }
    if (texto.includes('ver perfil') || texto.includes('abra')) {
      return "Perfeito! Simulando a ação: Abrindo o perfil da Cohelita Digital agora... (No sistema real, eu te redirecionaria para a página).";
    }
    if (texto.includes('obrigado') || texto.includes('valeu')) {
      return "Por nada, Marcos! Estou sempre aqui no cantinho da tela se precisar. Boas análises! 🚀";
    }
    
    return "Entendi! Estou analisando as startups com base no que você escreveu. A **Cohelita Digital (94%)** e **Vórtice Capital (89%)** são as que mais combinam com seu perfil. Como posso ajudar mais?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), type: 'sent', text: input }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const responseText = gerarResposta(input);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'received', text: responseText }]);
    }, 1500);
  };

  // ==========================================
  // RENDERIZAÇÃO DA TELA
  // ==========================================
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
        <aside className="sidebar-alia">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li>
            <li><Target size={18} /> Matches <span className="badge-orange">1</span></li>
            <li className="active"><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li><Star size={18} /> Favoritos</li>
            <li><MessageSquare size={18} /> Mensagens</li>
            <li><Bookmark size={18} /> Portfólio</li>
            <li><Briefcase size={18} /> Minhas qualificações</li>
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
        <main className="content-alia">
          
          <div className="alia-header-title">
             <div className="alia-avatar-icon">A</div>
             <div>
               <h1>A.L.I.A</h1>
               <p className="subtitle">A assistente de compatibilidade do Nexhub</p>
             </div>
             <span className="tag-pro-top"><Zap size={12} fill="currentColor"/> Plano Pro: ativado</span>
          </div>

          {/* BANNER ROXO DA ALIA */}
          <div className="banner-alia-main">
            <h2>Oi, Marcos! Eu ajudo a decidir quem aparece primeiro nas suas sugestões.</h2>
            <p>Comparo o que você escreve com o que cada startup traz, com as regras da plataforma e o match de texto. As decisões importantes continuam com você e com as regras do sistema.</p>
            <div className="banner-decoration"><Sparkles size={40} opacity={0.2} /></div>
          </div>

          {/* O QUE ELA FAZ / NÃO FAZ */}
          <div className="faz-nao-faz-grid">
            <div className="info-box">
              <div className="info-box-header"><CheckCircle size={16} color="#16a34a"/> O que eu faço</div>
              <ul>
                <li>Ordeno quem aparece primeiro nas suas sugestões.</li>
                <li>Leio sua tese de investimento e a descrição das startups, só no nível autorizado e publicável.</li>
                <li>Mostro a nota de compatibilidade e a 3 motivos, com os critérios.</li>
                <li>Comunico funcionando por regras e só analiso inteligente.</li>
              </ul>
            </div>
            <div className="info-box">
              <div className="info-box-header"><X size={16} color="#ef4444"/> O que eu não faço</div>
              <ul>
                <li>Não escrevo perfil nem converso com os usuários.</li>
                <li>Não aprovo cadastros nem decido quem pode fazer parte da plataforma.</li>
                <li>Não sugiro perfis bloqueados, pausados ou incompletos.</li>
                <li>Não acesso a sua carteira nem dar o seu retorno financeiro.</li>
              </ul>
            </div>
          </div>

          {/* COMO CALCULA A COMPATIBILIDADE */}
          <h2 className="section-title-alia mt-8">Como calculo a compatibilidade</h2>
          
          <div className="calculo-alia-container">
             <div className="calculo-boxes">
                <div className="calc-box purple-light">
                  <h3>70%</h3>
                  <p><strong>Regras</strong><br/>Etapa 1 - Filtro de 100 critérios</p>
                </div>
                <div className="calc-plus">+</div>
                <div className="calc-box purple-light">
                  <h3>30%</h3>
                  <p><strong>Análise de texto (IA)</strong><br/>Etapa 2 - IA (Pro)</p>
                </div>
                <div className="calc-equals">=</div>
                <div className="calc-box green-light">
                  <h3>83</h3>
                  <p><strong>Compatibilidade</strong><br/>Exemplo de nota: 10/100</p>
                </div>
             </div>
             <div className="calculo-footer">
                <Info size={14} /> Essa número mostra o quanto os perfis combinam. Ele não indica a chance de uma parceria dar certo nem de gerar retorno financeiro.
             </div>
          </div>

          <div className="etapas-grid">
             <div className="etapa-card">
                <span className="etapa-badge blue">Etapa 1 - Regras</span>
                <h3>Filtro e nota de 0 a 100 por critérios</h3>
                <p>Comparo setor, fase, ticket, localização e outros critérios objetivos. Você pode selecionar no que cada critério está e sobre o impacto que ele tem no resultado.</p>
                <ul className="check-list">
                  <li><Check size={12} color="#16a34a"/> Comparar setor, fase da startup, valor procurado e critérios de match da investida.</li>
                  <li><Check size={12} color="#16a34a"/> Selecionar um ou mais filtros de investidor.</li>
                  <li><Check size={12} color="#16a34a"/> Se a startup não aparece em nada, ela fica fora.</li>
                </ul>
             </div>

             <div className="etapa-card purple-border">
                <span className="etapa-badge purple">Etapa 2 - IA (Pro)</span>
                <h3>Semelhança de sentido entre os textos</h3>
                <p>Quando a análise inteligente está ativada, a etapa 2 compara o sentido dos textos e ajusta o score de destaque nas ordens.</p>
                <ul className="check-list">
                  <li><Check size={12} color="#9333ea"/> Entende que "pagamentos para pequenos comerciantes" e "fintechs voltadas ao varejo" são parecidos, sem usar termos.</li>
                  <li><Check size={12} color="#9333ea"/> Só aumenta (nunca piora) os pesos gerados pelo filtro de segurança.</li>
                </ul>
             </div>
          </div>

          {/* SUAS SUGESTÕES */}
          <div className="section-header-alia mt-8">
            <div>
              <h2 className="section-title-alia">Suas sugestões, ordenadas pela A.L.I.A</h2>
              <p className="subtitle">Cada nota mostra quais critérios foram decisivos.</p>
            </div>
            <a href="#" className="link-purple">Ver todas <TrendingUp size={14}/></a>
          </div>

          <div className="sugestoes-list">
            {mockSugestoes.map(sugestao => (
              <div key={sugestao.id} className="sugestao-card">
                
                <div className="sugestao-header">
                   <div className="sugestao-info">
                      <div className={`avatar-mini ${sugestao.cor}`}>{sugestao.iniciais}</div>
                      <div>
                         <h3>{sugestao.nome}</h3>
                         <div className="sugestao-tags">
                            {sugestao.tags.map((tag, i) => <span key={i} className="tag-gray">{tag}</span>)}
                         </div>
                      </div>
                   </div>
                   
                   <div className="sugestao-match">
                      <div className="match-circle">
                        <span>{sugestao.match}</span>
                        <small>de 100</small>
                      </div>
                   </div>
                </div>

                <div className="sugestao-body">
                   <div className="sugestao-requisitos">
                      <div className="req-title">
                        <Zap size={12} color="#9333ea"/> <strong>Análise inteligente</strong>
                      </div>
                      {sugestao.requisitos.map((req, i) => (
                        <div key={i} className="req-row">
                           {req.ok ? <Check size={12} color="#16a34a"/> : <X size={12} color="#ef4444"/>}
                           <span>{req.text}</span>
                        </div>
                      ))}
                   </div>
                   
                   <div className="sugestao-breakdown">
                      <span>Regras: {sugestao.regras} (70%) + semântica de texto: {sugestao.semantica} (30%) = compatibilidade {sugestao.compatibilidade}</span>
                      <button className="btn-outline-purple">Ver perfil</button>
                   </div>
                </div>

                {sugestao.footer && (
                  <div className="sugestao-footer-alert">
                     {sugestao.footer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </main>

        {/* COLUNA DIREITA */}
        <aside className="right-panel-alia">
          
          <div className="seu-controle-card">
             <h4>Seu controle</h4>
             <div className="controle-row">
                <div>
                   <strong>Permitir que a A.L.I.A leia meus textos de investimento</strong>
                   <p>Você desliga por perfil, você pode ligar ou desligar a qualquer momento. As configurações de privacidade da A.L.I.A para o uso dos textos na análise de IA e os dados gerais ficam sujeitos em até 24 horas.</p>
                </div>
                <div className={`toggle ${aliaAtiva ? 'active' : ''}`} onClick={() => setAliaAtiva(!aliaAtiva)}></div>
             </div>
          </div>

          <div className="section-right-alia">
             <h4>O que a A.L.I.A lê</h4>
             <div className="leitura-list">
                <div className="leitura-ok"><Check size={12} color="#16a34a"/> Texto da sua tese de investimento</div>
                <div className="leitura-ok"><Check size={12} color="#16a34a"/> E-mail, WhatsApp e conversas</div>
                <div className="leitura-no"><X size={12} color="#ef4444"/> Avaliações, anexos e materiais restritos</div>
                <div className="leitura-no"><X size={12} color="#ef4444"/> Rascunhos</div>
             </div>
             <p className="leitura-footer">Os textos são processados no servidor do próprio Nexhub. Nada é enviado a empresas externas.</p>
          </div>

          <div className="section-right-alia">
             <h4>Seu plano</h4>
             <div className="plano-box">
                <div>
                   <strong>Gratuito</strong>
                   <p>Tudo o que é essencial: match, mensagens, sugestões por regras (1º critério).</p>
                </div>
                <span className="tag-status-gratis">Grátis</span>
             </div>
             <div className="plano-box pro">
                <div>
                   <strong>Pro</strong>
                   <p>Acrescenta a ordenação com IA (Análise inteligente) e análise de texto para 100% das startups visíveis.</p>
                   <a href="#" className="link-pro">Ver recursos Pro <CheckCircle size={10}/></a>
                </div>
                <span className="tag-status-pro">Ativo</span>
             </div>
          </div>

          <div className="aviso-alia-card">
             <h4>⚠️ E se a A.L.I.A falhar?</h4>
             <p>Se a análise demorar mais de 10 segundos ou falhar, a fila de sugestões continua ordenada por regras e critérios. No caso de falha total, a rede de proteção, a nota "Análise inteligente indisponível" fica marcada e você pode seguir sem ela.</p>
          </div>

        </aside>
      </div>

      {/* ========================================== */}
      {/* CHAT FLUTUANTE DA A.L.I.A ACOPLADO AQUI    */}
      {/* ========================================== */}
      <div className="chat-alia-wrapper">
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="chat-alia-info">
                <div className="alia-avatar-mini"><Sparkles size={14} /></div>
                <div>
                  <h3>A.L.I.A</h3>
                  <p>Assistente de Investimentos</p>
                </div>
              </div>
              <button className="btn-close-chat" onClick={() => setIsChatOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-window-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-msg-row ${msg.type}`}>
                  {msg.type === 'received' && (
                    <div className="msg-avatar"><Sparkles size={12} /></div>
                  )}
                  <div className={`chat-msg-bubble ${msg.type}`}>
                    <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="chat-msg-row received">
                   <div className="msg-avatar"><Sparkles size={12} /></div>
                   <div className="chat-msg-bubble received typing">
                     <span></span><span></span><span></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-window-input" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Pergunte sobre startups, matches..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn-send-alia">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        <button className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? <X size={24} color="white" /> : <MessageSquare size={24} color="white" />}
          {!isChatOpen && <span className="notification-dot"></span>}
        </button>
      </div>

    </div>
  );
}

export default ALIA;