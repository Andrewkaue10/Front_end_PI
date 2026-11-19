import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Heart,
  Home,
  Mail,
  Search,
  Settings,
  Star,
  Users,
  WalletCards,
  LogOut,
} from "lucide-react";
import { api, clearSession, token } from "../../lib/api";
import "./Feed.css";

const notificationLabels = {
  CONNECTION_REQUEST: "Nova solicitação de conexão",
  CONNECTION_ACCEPTED: "Conexão aceita",
  MEETING_PROPOSED: "Reunião proposta",
  MEETING_CONFIRMED: "Reunião confirmada",
  MEETING_CANCELLED: "Reunião cancelada",
  MEETING_COMPLETED: "Reunião concluída",
};

function firstName(name) {
  return name?.trim().split(/\s+/)[0] || "Investidor";
}

function initials(name) {
  if (!name) return "—";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Feed() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [mode, setMode] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    if (!token()) {
      navigate("/login");
      return;
    }
    api("/auth/me")
      .then((current) => {
        if (current.role === "STARTUP") {
          navigate("/startup", { replace: true });
          return;
        }
        setMe(current);
      })
      .catch((e) => setError(e.message));
  }, [navigate]);

  useEffect(() => {
    if (!me) return;
    let alive = true;
    const isProfessional = ["INVESTOR", "MENTOR", "BOTH"].includes(me.role);

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        if (me.role === "STARTUP") {
          const data = await api(
            `/investors?page=${page}&limit=12&q=${encodeURIComponent(q)}`,
          );
          if (alive)
            setItems((data.items || []).filter((item) => !item.isDemo));
        } else if (isProfessional) {
          const params = new URLSearchParams({
            q,
            page: String(page),
            limit: "12",
            ...(mode === "favorites" ? { favorites: "true" } : {}),
          });
          const path =
            mode === "recommended" ? "/recommendations" : "/startups";
          const data = await api(`${path}?${params}`);
          const [recData, favData, notifData] = await Promise.all([
            api("/recommendations?page=1&limit=6").catch(() => ({ items: [] })),
            api("/startups?favorites=true&page=1&limit=8"),
            api("/notifications?page=1&limit=5"),
          ]);
          if (alive) {
            setItems((data.items || []).filter((item) => !item.isDemo));
            setRecommendations(
              (recData.items || []).filter((item) => !item.isDemo),
            );
            setFavorites((favData.items || []).filter((item) => !item.isDemo));
            setNotifications(notifData.items || []);
          }
        }
      } catch (e) {
        if (alive) {
          setError(e.message);
          setItems([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [me, mode, q, page]);

  async function favorite(item) {
    if (busyId) return;
    setBusyId(item.id);
    setError("");
    try {
      await api(`/favorites/${item.id}`, {
        method: item.favorited ? "DELETE" : "PUT",
      });
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, favorited: !entry.favorited }
            : entry,
        ),
      );
      setRecommendations((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, favorited: !entry.favorited }
            : entry,
        ),
      );
      if (mode === "favorites") {
        setItems((current) => current.filter((entry) => entry.id !== item.id));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  if (me?.role === "STARTUP") {
    return (
      <main className="nx-fallback">
        <header className="nx-fallback__header">
          <h1>Olá, {firstName(me.name)}</h1>
          <Link to="/painel">Minha área</Link>
        </header>
        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p role="status">Carregando perfis…</p>
        ) : (
          <div className="nx-card-list">
            {items.length === 0 && (
              <p>Nenhum investidor ou mentor encontrado.</p>
            )}
            {items.map((item) => (
              <article className="nx-card" key={item.id}>
                <h2>{item.name}</h2>
                <p>{item.bio || "Descrição não informada"}</p>
                <Link to={`/painel?kind=investors&id=${item.id}`}>
                  Ver perfil e conectar
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    );
  }

  const profile = me?.investor;
  const profileStatus = profile?.status;
  const pendingProfile = profileStatus === "PENDING";
  const rejectedProfile = profileStatus === "REJECTED";
  const qualifications = [
    profile?.type,
    ...(profile?.interests || []),
    ...(profile?.stages || []),
    profile?.ticketRange,
  ].filter(Boolean);

  return (
    <div className="investor-home">
      <header className="investor-header">
        <Link className="investor-brand" to="/feed" aria-label="NexHub início">
          <span>NEX</span>
          <em>hub</em>
          <i aria-hidden="true">✦</i>
        </Link>
        <label className="investor-global-search">
          <Search size={16} />
          <span className="sr-only">Buscar no sistema</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar startups, investidores, mentores..."
          />
        </label>
        <nav className="investor-top-nav" aria-label="Navegação principal">
          <Link className="active" to="/feed">
            Início
          </Link>
          <Link to="/para-investidores">Explorar</Link>
          <Link to="/feed" onClick={() => setMode("recommended")}>
            Rede
          </Link>
          <Link to="/mensagens">Mensagens</Link>
        </nav>
      </header>

      <aside className="investor-sidebar">
        <nav aria-label="Área do investidor">
          <button
            className={mode === "all" ? "active" : ""}
            onClick={() => setMode("all")}
          >
            <Home size={16} />
            <span>Início</span>
          </button>
          <button
            className={mode === "recommended" ? "active" : ""}
            onClick={() => setMode("recommended")}
          >
            <Users size={16} />
            <span>Matches</span>
          </button>
          <Link to="/alia">
            <Star size={16} />
            <span>A.L.I.A</span>
          </Link>
          <Link to="/notificacoes">
            <Bell size={16} />
            <span>Notificações</span>
            {notifications.length > 0 && (
              <b>{notifications.filter((n) => !n.read).length}</b>
            )}
          </Link>
          <Link to="/investidor/favoritos">
            <Heart size={16} />
            <span>Favoritos</span>
          </Link>
          <Link to="/mensagens">
            <Mail size={16} />
            <span>Mensagens</span>
          </Link>
          <Link to="/investidor/portfolio">
            <WalletCards size={16} />
            <span>Portfólio</span>
          </Link>
          <Link to="/investidor/qualificacoes">
            <BriefcaseBusiness size={16} />
            <span>Minhas qualificações</span>
          </Link>
          <Link to="/configuracoes">
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
        </nav>
        <div className="investor-account">
          <span>{initials(me?.name)}</span>
          <div>
            <strong>{me?.name || "Usuário"}</strong>
            <small>{profile?.type || "Investidor"}</small>
          </div>
          <button onClick={logout} aria-label="Sair">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="investor-main">
        <section className="investor-greeting">
          <div>
            <h1>
              Olá, {firstName(me?.name)} <span aria-hidden="true">👋</span>
            </h1>
            <p>Veja o que aconteceu desde sua última visita.</p>
          </div>
          <label className="investor-context-search">
            <Search size={14} />
            <span className="sr-only">Buscar startups</span>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Pesquisar startups..."
            />
          </label>
        </section>

        {(pendingProfile || rejectedProfile) && (
          <div className="investor-status" role="status">
            {pendingProfile
              ? "Seu perfil está aguardando análise. Algumas recomendações podem ficar disponíveis após a aprovação."
              : "Seu perfil foi reprovado. Confira os dados em Minha área antes de solicitar uma nova análise."}
            <Link to="/painel#perfil">Editar perfil</Link>
          </div>
        )}

        <section className="investor-suggestions">
          <div className="investor-section-heading">
            <div>
              <h2>
                {mode === "favorites"
                  ? "Favoritos"
                  : mode === "recommended"
                    ? "Matches recomendados"
                    : "Sugestões para você"}
              </h2>
              <p>Oportunidades calculadas a partir do seu perfil.</p>
            </div>
            {mode === "all" && (
              <button onClick={() => setMode("recommended")}>Ver mais →</button>
            )}
          </div>

          {loading ? (
            <p className="investor-state" role="status">
              Carregando startups…
            </p>
          ) : error ? (
            <p className="investor-state" role="alert">
              {error}
            </p>
          ) : items.length === 0 ? (
            <p className="investor-state">
              Nenhuma startup real disponível no momento.
            </p>
          ) : (
            <div className="investor-card-grid">
              {items.slice(0, 6).map((item) => (
                <article className="startup-card" key={item.id}>
                  <div className="startup-card__top">
                    <span
                      className="startup-avatar"
                      style={{ background: item.color || "#2451b7" }}
                    >
                      {item.initials || initials(item.name)}
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>
                        {item.category ||
                          (item.sectors || []).join(", ") ||
                          "Setor não informado"}
                      </p>
                    </div>
                    <button
                      className={`startup-favorite ${item.favorited ? "is-favorite" : ""}`}
                      onClick={() => favorite(item)}
                      disabled={busyId === item.id}
                      aria-label={
                        item.favorited
                          ? `Remover ${item.name} dos favoritos`
                          : `Favoritar ${item.name}`
                      }
                    >
                      <Heart
                        size={16}
                        fill={item.favorited ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <p className="startup-description">
                    {item.description || "Descrição não informada"}
                  </p>
                  <div className="startup-tags">
                    {item.stage && <span>{item.stage}</span>}
                    {(item.tags || item.sectors || [])
                      .slice(0, 3)
                      .map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                  </div>
                  <div className="startup-metrics">
                    {item.ask && (
                      <div>
                        <strong>{item.ask}</strong>
                        <small>Captação</small>
                      </div>
                    )}
                    {item.growth && (
                      <div>
                        <strong>{item.growth}</strong>
                        <small>Crescimento</small>
                      </div>
                    )}
                    {item.valuation && (
                      <div>
                        <strong>{item.valuation}</strong>
                        <small>Valuation</small>
                      </div>
                    )}
                  </div>
                  <div className="startup-card__footer">
                    {item.match != null && (
                      <strong className="match-score">
                        {item.match}% match
                      </strong>
                    )}
                    <Link to={`/painel?kind=startups&id=${item.id}`}>
                      Ver perfil →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="investor-recommended">
          <div className="investor-section-heading">
            <div>
              <h2>Startups recomendadas</h2>
              <p>Baseado nas regras de recomendação disponíveis.</p>
            </div>
          </div>
          {recommendations.length === 0 ? (
            <p className="investor-state">Nenhuma recomendação disponível.</p>
          ) : (
            <div className="recommended-list">
              {recommendations.slice(0, 5).map((item, index) => (
                <Link
                  to={`/painel?kind=startups&id=${item.id}`}
                  className="recommended-row"
                  key={item.id}
                >
                  <b>{index + 1}</b>
                  <span
                    className="startup-avatar small"
                    style={{ background: item.color || "#2451b7" }}
                  >
                    {item.initials || initials(item.name)}
                  </span>
                  <span className="recommended-name">
                    <strong>{item.name}</strong>
                    <small>
                      {item.category ||
                        (item.sectors || []).join(", ") ||
                        "Setor não informado"}{" "}
                      · {item.stage || "Estágio não informado"}
                    </small>
                  </span>
                  {item.match != null && <em>{item.match}% match</em>}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <aside className="investor-context">
        <section>
          <div className="context-heading">
            <h2>Notificações</h2>
            <Link to="/painel#avisos">Ver todas</Link>
          </div>
          {notifications.length === 0 ? (
            <p className="context-empty">Nenhuma notificação.</p>
          ) : (
            <div className="notification-list">
              {notifications.slice(0, 5).map((notification) => (
                <div className="notification-row" key={notification.id}>
                  <span>
                    <Bell size={13} />
                  </span>
                  <p>
                    <strong>
                      {notificationLabels[notification.type] ||
                        "Nova atualização"}
                    </strong>
                    <small>
                      {new Date(notification.createdAt).toLocaleDateString(
                        "pt-BR",
                      )}
                    </small>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="context-heading">
            <h2>Minhas qualificações</h2>
            <Link to="/painel#perfil">Editar</Link>
          </div>
          {qualifications.length === 0 ? (
            <p className="context-empty">Nenhuma qualificação informada.</p>
          ) : (
            <dl className="qualifications">
              {profile?.type && (
                <div>
                  <dt>Tipo</dt>
                  <dd>{profile.type}</dd>
                </div>
              )}
              {profile?.interests?.length > 0 && (
                <div>
                  <dt>Interesses</dt>
                  <dd>{profile.interests.join(", ")}</dd>
                </div>
              )}
              {profile?.stages?.length > 0 && (
                <div>
                  <dt>Estágios</dt>
                  <dd>{profile.stages.join(", ")}</dd>
                </div>
              )}
              {profile?.ticketRange && (
                <div>
                  <dt>Ticket</dt>
                  <dd>{profile.ticketRange}</dd>
                </div>
              )}
              {profile?.specialties?.length > 0 && (
                <div>
                  <dt>Especialidades</dt>
                  <dd>{profile.specialties.join(", ")}</dd>
                </div>
              )}
              {profile?.availability != null && (
                <div>
                  <dt>Disponibilidade</dt>
                  <dd>{profile.availability} h/mês</dd>
                </div>
              )}
            </dl>
          )}
        </section>

        <section>
          <div className="context-heading">
            <h2>Favoritos</h2>
            <button onClick={() => setMode("favorites")}>Ver todos</button>
          </div>
          {favorites.length === 0 ? (
            <p className="context-empty">Nenhum favorito.</p>
          ) : (
            <div className="favorite-list">
              {favorites.slice(0, 5).map((item) => (
                <Link
                  to={`/painel?kind=startups&id=${item.id}`}
                  className="favorite-row"
                  key={item.id}
                >
                  <span
                    className="startup-avatar small"
                    style={{ background: item.color || "#2451b7" }}
                  >
                    {item.initials || initials(item.name)}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.category ||
                        (item.sectors || []).join(", ") ||
                        "Setor não informado"}
                    </small>
                  </span>
                  <Heart size={14} fill="currentColor" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
