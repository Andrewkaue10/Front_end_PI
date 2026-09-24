import React, { useState, useMemo } from "react";
import {
  Home,
  Search,
  Briefcase,
  MessageCircle,
  Heart,
  Pencil,
  TrendingUp,
} from "lucide-react";
import "./Feed.css";
import PillGroup from '../../components/PillGroup/PillGroup'

const STARTUPS = [
  {
    id: "colheita-digital",
    name: "Colheita Digital",
    initials: "CD",
    color: "#E4572E",
    category: "Fintech",
    tags: ["Agritech", "Trade"],
    match: 94,
    description:
      "Marketplace B2B que conecta pequenos produtores rurais diretamente à rede de mercados, eliminando intermediários e automatizando a margem de lucro.",
    ask: "R$18k",
    growth: "+22%",
    valuation: "R$1,2M",
    stage: "Crescimento",
  },
  {
    id: "vortice-capital",
    name: "Vórtice Capital",
    initials: "VC",
    color: "#2451B7",
    category: "Fintech",
    tags: ["Fintech", "Saas"],
    match: 84,
    description:
      "Plataforma de crédito consignado para autônomos usando dados alternativos de faturamento via Pix para análise de risco em tempo real.",
    ask: "R$8k",
    growth: "+41%",
    valuation: "R$800k",
    stage: "Crescimento",
  },
  {
    id: "nuvia-health",
    name: "Nuvia Health",
    initials: "NH",
    color: "#14162B",
    category: "Healthtech",
    tags: ["Healthtech", "B2B"],
    match: 91,
    description:
      "App de telemedicina especializado em saúde mental corporativa, com módulo B2B para empresas reduzirem absenteísmo por burnout.",
    ask: "Pré-receita",
    growth: "+15 clientes-piloto",
    valuation: "R$500k",
    stage: "MVP",
  },
  {
    id: "edla",
    name: "Edla",
    initials: "ED",
    color: "#1F8A5A",
    category: "IA",
    tags: ["Edtech", "Trade"],
    match: 77,
    description:
      "Plataforma de microlearning corporativo com trilhas geradas por IA, já usada por 40 empresas para treinamento de vendas.",
    ask: "R$32k",
    growth: "+18%",
    valuation: "R$2M",
    stage: "Crescimento",
  },
];

const CATEGORIES = ["Todos", "Fintech", "Healthtech", "SaaS", "IA", "Estágio MVP+"];

function MatchBadge({ value }) {
  return (
    <span className="nx-match-badge">
      <TrendingUp size={12} strokeWidth={2.5} />
      {value}% match
    </span>
  );
}

function StartupCard({ startup, connected, favorited, onToggleConnect, onToggleFavorite }) {
  return (
    <div className="nx-card">
      <div className="nx-card-avatar" style={{ backgroundColor: startup.color }}>
        {startup.initials}
      </div>

      <div className="nx-card-body">
        <div className="nx-card-top">
          <div>
            <div className="nx-card-title-row">
              <h3>{startup.name}</h3>
              {startup.tags.map((t) => (
                <span key={t} className="nx-card-tag">
                  {t}
                </span>
              ))}
              <MatchBadge value={startup.match} />
            </div>
            <p className="nx-card-desc">{startup.description}</p>
          </div>

          <button
            onClick={() => onToggleFavorite(startup.id)}
            aria-label="Favoritar"
            className="nx-fav-btn"
          >
            <Heart
              size={20}
              fill={favorited ? "#f43f5e" : "none"}
              stroke={favorited ? "#f43f5e" : "currentColor"}
            />
          </button>
        </div>

        <div className="nx-card-bottom">
          <div className="nx-metrics">
            <div>
              <p className="nx-metric-value">{startup.ask}</p>
              <p className="nx-metric-label">Ask</p>
            </div>
            <div>
              <p className="nx-metric-value">{startup.growth}</p>
              <p className="nx-metric-label">Crescimento</p>
            </div>
            <div>
              <p className="nx-metric-value">{startup.valuation}</p>
              <p className="nx-metric-label">Valuation</p>
            </div>
          </div>

          <div className="nx-card-actions">
            <button className="nx-link-btn">
              Ver perfil completo
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onToggleConnect(startup.id)}
              className={`nx-connect-btn${connected ? " connected" : ""}`}
            >
              {connected ? "Conectado" : "Conectar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <button className={`nx-sidebar-item${active ? " active" : ""}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function NexHubFeed() {
  const [topQuery, setTopQuery] = useState("");
  const [feedQuery, setFeedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [connectedIds, setConnectedIds] = useState(new Set());
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const toggleConnect = (id) =>
    setConnectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleFavorite = (id) =>
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const categoryCounts = useMemo(() => {
    const counts = { Todos: STARTUPS.length };
    for (const cat of CATEGORIES.slice(1)) {
      counts[cat] =
        cat === "Estágio MVP+"
          ? STARTUPS.filter((s) => s.stage === "MVP" || s.stage === "Crescimento").length
          : STARTUPS.filter((s) => s.category === cat).length;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = (topQuery || feedQuery).trim().toLowerCase();
    return STARTUPS.filter((s) => {
      const matchesCategory =
        activeCategory === "Todos" ||
        s.category === activeCategory ||
        (activeCategory === "Estágio MVP+" &&
          (s.stage === "MVP" || s.stage === "Crescimento"));

      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, topQuery, feedQuery]);

  return (
    <div className="nexhub theme-blue">
      {/* Sidebar */}
      <aside className="nx-sidebar">
        <nav className="nx-sidebar-nav">
          <SidebarItem icon={<Home size={18} />} label="Início" active />
          <SidebarItem icon={<Search size={18} />} label="Startups" />
          <SidebarItem icon={<Briefcase size={18} />} label="Mensagens" />
          <SidebarItem icon={<Heart size={18} />} label="Favoritos" />
        </nav>
      </aside>

      {/* Main */}
      <div className="nx-main">
        {/* Top bar */}
        <header className="nx-header">
          <div className="nx-search">
            <Search size={16} />
            <input
              value={topQuery}
              onChange={(e) => setTopQuery(e.target.value)}
              placeholder="Pesquisar no NexHub..."
            />
          </div>

          <div className="nx-header-icons">
            <MessageCircle size={18} />
            <Briefcase size={18} />
            <div className="nx-avatar" />
          </div>
        </header>

        {/* Content */}
        <main className="nx-content">
          <div className="nx-content-header">
            <h1>Seu feed de startups</h1>
            <div className="nx-feed-search">
              <Search size={14} />
              <input
                value={feedQuery}
                onChange={(e) => setFeedQuery(e.target.value)}
                placeholder="Buscar startups..."
              />
            </div>
          </div>

          <div className="nx-pills">
            <PillGroup
              options={CATEGORIES}
              value={activeCategory}
              onChange={setActiveCategory}
              counts={categoryCounts}
            />
          </div>

          <div className="nx-card-list">
            {filtered.length === 0 ? (
              <div className="nx-empty">
                Nenhuma startup encontrada para esse filtro/busca.
              </div>
            ) : (
              filtered.map((s) => (
                <StartupCard
                  key={s.id}
                  startup={s}
                  connected={connectedIds.has(s.id)}
                  favorited={favoriteIds.has(s.id)}
                  onToggleConnect={toggleConnect}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}