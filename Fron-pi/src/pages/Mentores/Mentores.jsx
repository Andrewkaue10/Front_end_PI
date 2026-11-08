import React, { useState, useRef, useEffect } from 'react';
import './Mensagens.css';
import { 
  Search, MessageSquare, Calendar, MoreHorizontal, Paperclip, 
  CheckCheck, Zap, Bell, Home, Target, Star, Bookmark, Briefcase, Settings
} from 'lucide-react';

// --- BANCO DE DADOS INICIAL ---
const initialContacts = [
  { id: 'cohelita', name: 'Cohelita Digital', initials: 'CD', color: 'orange', time: '14:12', unread: 0, isStartup: true, role: 'AgroTech · Tração', match: '94% match', description: 'Marketplace B2B...', metrics: [] },
  { id: 'nuvia', name: 'Nuvia Health', initials: 'NH', color: 'purple', time: '12:40', unread: 2, isStartup: true, role: 'HealthTech · Seed', match: '88% match', description: 'Plataforma de telemedicina...', metrics: [] },
  { id: 'edila', name: 'Edila', initials: 'E', color: 'green', time: 'ontem', unread: 0, isStartup: true, role: 'EdTech · Tração', match: '87% match', description: 'Sistema de gestão escolar...', metrics: [] },
  { id: 'mover', name: 'Mover', initials: 'MV', color: 'dark', time: 'ontem', unread: 0, isStartup: true, role: 'Mobilidade · Seed', match: '85% match', description: 'App de caronas...', metrics: [] },
  { id: 'vortice', name: 'Vortice Capital', initials: 'VC', color: 'blue', time: '2 d', unread: 0, isStartup: false, role: 'Venture Capital', match: '90% match', description: 'Fundo de investimento...', metrics: [] }
];

const initialMessages = {
  cohelita: [
    { id: 1, type: 'received', text: 'Oi Marcos! Obrigado por conectar. Posso te apresentar a Cohelita Digital em 10 minutos?', time: '13:50' },
    { id: 2, type: 'sent', text: 'Claro, Rafael. Vi o reels de vocês e gostei do crescimento. Como está o churn dos produtores?', time: '13:58' },
    { id: 3, type: 'received', text: 'Caiu para 3% depois do novo onboarding. Segue o deck atualizado com os números de setembro.', time: '14:10' },
    { id: 4, type: 'sent', text: 'Obrigado. Vamos marcar uma conversa para falar da rodada de R$1.2M?', time: '14:15' }
  ],
  nuvia: [{ id: 1, type: 'received', text: 'Olá Marcos, tudo bem? Podemos agendar a due diligence?', time: '12:40' }],
  edila: [{ id: 1, type: 'sent', text: 'Olá, podemos confirmar a reunião?', time: 'ontem' }, { id: 2, type: 'received', text: 'Confirmada, quinta 14h!', time: 'ontem' }],
  mover: [{ id: 1, type: 'received', text: 'Obrigado por aceitar a conexão', time: 'ontem' }],
  vortice: [{ id: 1, type: 'received', text: 'Enviamos o relatório de setembro', time: '2 d' }]
};

// Respostas automáticas para simular o "Outro Lado"
const autoReplies = [
  "Perfeito, Marcos! Vou verificar minha agenda e te confirmo.",
  "Ótimo! Vou passar isso para o time e retornamos em breve.",
  "Combinado. Vou preparar alguns dados adicionais para te mostrar.",
  "Excelente ponto. Vamos discutir isso na nossa próxima call.",
  "Faz sentido. Vou atualizar o deck com essas informações."
];

function Mensagens() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeContactId, setActiveContactId] = useState('cohelita');
  
  // Estados com persistência no LocalStorage
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('nexhub_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('nexhub_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Salva no LocalStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('nexhub_contacts', JSON.stringify(contacts));
    localStorage.setItem('nexhub_messages', JSON.stringify(messages));
  }, [contacts, messages]);

  // Rola para o final
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContactId, isTyping]);

  const activeContact = contacts.find(c => c.id === activeContactId);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'Startups' && !contact.isStartup) return false;
    if (activeTab === 'Não lidas' && contact.unread === 0) return false;
    return matchesSearch;
  });

  const handleSelectContact = (id) => {
    setActiveContactId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  // --- LÓGICA DE ENVIO E RESPOSTA ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = { id: Date.now(), type: 'sent', text: inputText, time: timeNow };

    // Adiciona a mensagem enviada
    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    
    setInputText('');

    // Simula o outro lado digitando e respondendo
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const receivedMessage = { 
        id: Date.now() + 1, 
        type: 'received', 
        text: randomReply, 
        time: replyTime 
      };

      setMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), receivedMessage]
      }));
      
      // Atualiza o preview da lista
      setContacts(prev => prev.map(c => c.id === activeContactId ? { ...c, time: replyTime } : c));

    }, 2500); // 2.5 segundos de delay
  };

  return (
    <div className="app-container">
      {/* HEADER PADRÃO */}
      <header className="header">
        <div className="logo-area"><span className="logo-text">NEX</span><span className="logo-hub">hub</span><span className="logo-star">*</span></div>
        <div className="search-bar"><Search size={16} className="search-icon" /><input type="text" placeholder="Buscar..." /></div>
        <nav className="header-nav">
          <a href="#" className="nav-link">Início</a><a href="#" className="nav-link">Rede</a><a href="#" className="nav-link active">Mensagens</a>
        </nav>
        <div className="header-avatar"><div className="avatar-circle">JS</div></div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-msg">
          <ul className="sidebar-menu">
            <li><Home size={18} /> Início</li><li><Target size={18} /> Matches</li><li><Star size={18} /> A.L.I.A</li>
            <li><Bell size={18} /> Notificações <span className="badge-red">7</span></li>
            <li className="active"><MessageSquare size={18} /> Mensagens</li>
            <li><Bookmark size={18} /> Portfólio</li><li><Settings size={18} /> Configurações</li>
          </ul>
          <div className="user-footer">
             <div className="user-avatar">ML</div>
             <div><strong>Marcos Lima</strong><p>Investidor Anjo</p></div>
          </div>
        </aside>

        {/* LISTA DE CONVERSAS */}
        <div className="lista-conversas">
          <div className="lista-header">
            <h2>Mensagens</h2>
            <div className="search-conversas">
              <Search size={14} color="#94a3b8" />
              <input type="text" placeholder="Buscar conversas" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="tabs-conversas">
              {['Todos', 'Startups', 'Não lidas'].map(tab => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>
          </div>

          <div className="conversas-list">
            {filteredContacts.map(contact => (
              <div key={contact.id} className={`conversa-item ${activeContactId === contact.id ? 'active' : ''}`} onClick={() => handleSelectContact(contact.id)}>
                <div className={`avatar-box ${contact.color}`}>{contact.initials}</div>
                <div className="conversa-info">
                  <div className="conversa-top"><strong>{contact.name}</strong><span className="time">{contact.time}</span></div>
                  <p className="conversa-preview">
                    {messages[contact.id]?.length > 0 
                      ? (messages[contact.id].slice(-1)[0].text || 'Arquivo') 
                      : 'Nenhuma mensagem'}
                  </p>
                </div>
                {contact.unread > 0 && <span className="unread-badge">{contact.unread}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ÁREA DO CHAT */}
        <main className="chat-area">
          <div className="chat-header">
            <div className={`avatar-box ${activeContact.color} small`}>{activeContact.initials}</div>
            <div className="chat-header-info">
              <h3>{activeContact.name}</h3>
              <p>{activeContact.isStartup ? 'Startup' : 'Investidor'} <span className="online-dot"></span> {isTyping ? 'Digitando...' : 'Online agora'}</p>
            </div>
          </div>

          <div className="chat-messages">
            <div className="date-divider"><span>Hoje</span></div>
            {messages[activeContactId]?.map((msg) => (
              <div key={msg.id} className={`msg-row ${msg.type}`}>
                <div className={`msg-bubble ${msg.type === 'sent' ? 'blue' : 'white'}`}>
                  <p>{msg.text}</p>
                  <span className="msg-time">{msg.time} {msg.type === 'sent' && <CheckCheck size={12}/>}</span>
                </div>
              </div>
            ))}
            
            {/* Indicador de Digitando */}
            {isTyping && (
              <div className="msg-row received">
                <div className="msg-bubble white typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <button type="button" className="btn-icon"><Paperclip size={18}/></button>
            <input type="text" placeholder="Escreva uma mensagem..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
            <button type="submit" className="btn-enviar">Enviar</button>
          </form>
        </main>

        {/* DETALHES DO PERFIL */}
        <aside className="right-panel-msg">
          <div className="profile-details">
            <div className={`avatar-box ${activeContact.color} large`}>{activeContact.initials}</div>
            <h3>{activeContact.name}</h3>
            <p className="profile-role">{activeContact.role}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Mensagens;