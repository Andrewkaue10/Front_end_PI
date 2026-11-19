import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  Home,
  Mail,
  Search,
  Settings,
  Sparkles,
  Users,
  LogOut,
} from "lucide-react";
import { api, clearSession, token } from "../../lib/api";
import "./StartupHome.css";

const notificationLabels = {
  CONNECTION_REQUEST: "Nova solicitação de conexão",
  CONNECTION_ACCEPTED: "Conexão aceita",
  MEETING_PROPOSED: "Reunião proposta",
  MEETING_CONFIRMED: "Reunião confirmada",
  MEETING_CANCELLED: "Reunião cancelada",
  MEETING_COMPLETED: "Reunião concluída",
};

function initials(name) {
  if (!name) return "—";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpper();
}

function visibleList(values) {
  return Array.isArray(values) && values.length > 0
    ? values.join(", ")
    : "Não informado";
}

export default function StartupHome() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    if (!token()) {
      navigate("/login", { replace: true });
      return;
    }
    api("/auth/me")
      .then((current) => {
        if (current.role !== "STARTUP") {
          navigate(
            ["INVESTOR", "MENTOR", "BOTH"].includes(current.role)
              ? "/feed"
              : "/painel",
            { replace: true },
          );
          return;
        }
        setMe(current);
      })
      .catch((e) => setError(e.message));
  }, [navigate]);

  useEffect(() => {
    if (!me?.startup) return;
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const [investorData, recommendationData, notificationData] =
          await Promise.all([
            api("/investors?page=1&limit=50"),
            api("/recommendations?page=1&limit=50").catch((e) => {
              if (e.message.includes("aprovado")) {
                throw new Error(
                  "Seu perfil precisa ser aprovado para receber recomendações.",
                );
              }
              throw e;
            }),
            api("/notifications?page=1&limit=5"),
          ]);
        if (!alive) return;
        const search = q.trim().toLowerCase();
        const filter = (item) =>
          !item.isDemo &&
          (!search ||
            [item.name, item.company, item.bio, ...(item.interests || [])]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(search));
        setInvestors((investorData.items || []).filter(filter));
        setRecommendations((recommendationData.items || []).filter(filter));
        setNotifications(notificationData.items || []);
      } catch (e) {
        if (alive) {
          setError(e.message);
          setInvestors([]);
          setRecommendations([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [me, q]);

  async function connect(investor, purpose) {
    if (!me?.startup || busyId) return;
    setBusyId(investor.id);
    setError("");
    setNotice("");
    try {
      await api("/connections", {
        method: "POST",
        body: {
          startupId: me.startup.id,
          investorId: investor.id,
          purpose,
          introduction:
            purpose === "MENTORSHIP"
              ? "Gostaria de solicitar mentoria para apoiar o desenvolvimento da nossa startup."
              : "Gostaria de conhecer oportunidades de investimento com o seu perfil.",
        },
      });
      setNotice("Solicitação de conexão enviada.");
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

  const startup = me?.startup;
  const profileStatus = startup?.status;
  const mentors = recommendations.filter((item) =>
    ["MENTOR", "BOTH"].includes(item.role),
  );
  const matchedProfiles = recommendations.filter((item) =>
    ["INVESTOR", "BOTH"].includes(item.role),
  );

  if (!me) {
    return (
      <main className="startup-home startup-loading" role="status">
        Carregando sua área…
      </main>
    );
  }

  return (
    <div className="startup-home">
      <header className="startup-header">
        <Link
          className="startup-brand"
          to="/startup"
          aria-label="NexHub início"
        >
          <span>NEX</span>
          <em>hub</em>
          <i aria-hidden="true">✦</i>
        </Link>
        <label className="startup-global-search">
          <Search size={15} />
          <span className="sr-only">Buscar investidores e mentores</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar startups, investidores, mentores..."
          />
        </label>
        <nav className="startup-top-nav" aria-label="Navegação principal">
          <Link className="active" to="/startup">
            Início
          </Link>
          <Link to="/painel">Perfil</Link>
          <Link to="/painel#conexoes">Rede</Link>
          <Link to="/painel#avisos">Mensagens</Link>
        </nav>
      </header>

      <aside className="startup-sidebar">
        <nav aria-label="Área da startup">
          <Link className="active" to="/startup">
            <Home size={16} />
            <span>Início</span>
          </Link>
          <Link to="/painel#perfil">
            <BriefcaseBusiness size={16} />
            <span>Publicações</span>
            <small>Perfil</small>
          </Link>
          <Link to="/painel#avisos">
            <Bell size={16} />
            <span>Notificações</span>
            {notifications.filter((item) => !item.read).length > 0 && (
              <b>{notifications.filter((item) => !item.read).length}</b>
            )}
          </Link>
          <Link to="/painel">
            <CalendarDays size={16} />
            <span>Editais</span>
            <small>Indisponível</small>
          </Link>
          <Link to="#mentores">
            <Sparkles size={16} />
            <span>Mentores</span>
          </Link>
          <Link to="#investidores">
            <Users size={16} />
            <span>Investidores</span>
          </Link>
          <Link to="/painel#conexoes">
            <Mail size={16} />
            <span>Mensagens</span>
          </Link>
          <Link to="/painel#perfil">
            <Heart size={16} />
            <span>Perfil da startup</span>
          </Link>
          <Link to="/painel#perfil">
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
        </nav>
        <div className="startup-account">
          <span>{initials(startup?.name || me.name)}</span>
          <div>
            <strong>{startup?.name || me.name}</strong>
            <small>Startup</small>
          </div>
          <button onClick={logout} aria-label="Sair">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="startup-main">
        <section className="startup-greeting">
          <div>
            <h1>
              Olá, {startup?.name || me.name} <span aria-hidden="true">👋</span>
            </h1>
            <p>Acompanhe oportunidades alinhadas ao seu perfil.</p>
          </div>
        </section>

        {profileStatus === "PENDING" && (
          <div className="startup-status" role="status">
            Seu perfil está aguardando análise. As recomendações ficam
            disponíveis após a aprovação.
            <Link to="/painel#perfil">Editar perfil</Link>
          </div>
        )}
        {profileStatus === "REJECTED" && (
          <div className="startup-status" role="status">
            Seu perfil foi reprovado. Revise os dados antes de solicitar uma
            nova análise.
            <Link to="/painel#perfil">Editar perfil</Link>
          </div>
        )}
        {error && (
          <p className="startup-alert" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="startup-notice" role="status">
            {notice}
          </p>
        )}

        {startup?.pitchUrl && startup?.materialsPublic && (
          <section className="startup-pitch">
            <div className="startup-section-heading">
              <div>
                <h2>Minha apresentação</h2>
                <p>Material público do perfil</p>
              </div>
            </div>
            <a href={startup.pitchUrl} target="_blank" rel="noreferrer">
              Abrir apresentação
            </a>
          </section>
        )}

        <section id="investidores" className="startup-matches">
          <div className="startup-section-heading">
            <div>
              <h2>Investidores com match</h2>
              <p>Recomendações calculadas pelo perfil aprovado.</p>
            </div>
            <Link to="/painel#conexoes">Ver mais →</Link>
          </div>
          {loading ? (
            <p className="startup-state" role="status">
              Carregando recomendações…
            </p>
          ) : matchedProfiles.length === 0 ? (
            <p className="startup-state">
              Nenhuma recomendação real disponível no momento.
            </p>
          ) : (
            <div className="startup-card-grid">
              {matchedProfiles.slice(0, 6).map((item) => (
                <article className="professional-card" key={item.id}>
                  <div className="professional-card__top">
                    <span className="professional-avatar">
                      {initials(item.name)}
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.company || item.type || "Tipo não informado"}</p>
                    </div>
                    {item.match != null && <strong>{item.match}% match</strong>}
                  </div>
                  <p className="professional-bio">
                    {item.bio || "Descrição não informada"}
                  </p>
                  <dl className="professional-details">
                    <div>
                      <dt>Interesses</dt>
                      <dd>{visibleList(item.interests)}</dd>
                    </div>
                    <div>
                      <dt>Estágios</dt>
                      <dd>{visibleList(item.stages)}</dd>
                    </div>
                    <div>
                      <dt>Ticket</dt>
                      <dd>{item.ticketRange || "Não informado"}</dd>
                    </div>
                  </dl>
                  {item.matchDetails?.reasons?.length > 0 && (
                    <p className="match-reasons">
                      {item.matchDetails.reasons.join(" · ")}
                    </p>
                  )}
                  <div className="professional-actions">
                    <Link to={`/painel?kind=investors&id=${item.id}`}>
                      Ver perfil
                    </Link>
                    <button
                      disabled={busyId === item.id}
                      onClick={() => connect(item, "INVESTMENT")}
                    >
                      {busyId === item.id ? "Enviando…" : "Conectar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="mentores" className="startup-mentors">
          <div className="startup-section-heading">
            <div>
              <h2>Fale com mentores</h2>
              <p>Perfis reais recomendados para mentoria.</p>
            </div>
            <Link to="/painel#conexoes">Ver mais →</Link>
          </div>
          {mentors.length === 0 ? (
            <p className="startup-state">
              Nenhum mentor disponível com recomendação ativa.
            </p>
          ) : (
            <div className="mentor-grid">
              {mentors.slice(0, 6).map((item) => (
                <article className="mentor-card" key={item.id}>
                  <span className="professional-avatar">
                    {initials(item.name)}
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.bio || "Descrição não informada"}</p>
                  <dl className="professional-details">
                    <div>
                      <dt>Especialidades</dt>
                      <dd>{visibleList(item.specialties)}</dd>
                    </div>
                    <div>
                      <dt>Disponibilidade</dt>
                      <dd>
                        {item.availability != null
                          ? `${item.availability} h/mês`
                          : "Não informada"}
                      </dd>
                    </div>
                  </dl>
                  <div className="professional-actions">
                    <Link to={`/painel?kind=investors&id=${item.id}`}>
                      Ver perfil
                    </Link>
                    <button
                      disabled={busyId === item.id}
                      onClick={() => connect(item, "MENTORSHIP")}
                    >
                      {busyId === item.id ? "Enviando…" : "Pedir mentoria"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <aside className="startup-context">
        <section>
          <div className="startup-context-heading">
            <h2>Notificações</h2>
            <Link to="/painel#avisos">Ver todas</Link>
          </div>
          {notifications.length === 0 ? (
            <p className="startup-context-empty">Nenhuma notificação.</p>
          ) : (
            <div className="startup-notification-list">
              {notifications.slice(0, 5).map((notification) => (
                <div className="startup-notification" key={notification.id}>
                  <span>
                    <Bell size={12} />
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
          <div className="startup-context-heading">
            <h2>Perfil da startup</h2>
            <Link to="/painel#perfil">Editar</Link>
          </div>
          <dl className="startup-profile-details">
            <div>
              <dt>Nome</dt>
              <dd>{startup?.name || "Não informado"}</dd>
            </div>
            <div>
              <dt>Setores</dt>
              <dd>{visibleList(startup?.sectors)}</dd>
            </div>
            <div>
              <dt>Estágio</dt>
              <dd>{startup?.stage || "Não informado"}</dd>
            </div>
            {startup?.fundingRange && (
              <div>
                <dt>Faixa de captação</dt>
                <dd>{startup.fundingRange}</dd>
              </div>
            )}
            {startup?.pitchUrl && !startup?.materialsPublic && (
              <div>
                <dt>Apresentação</dt>
                <dd>Privada até aprovação da conexão</dd>
              </div>
            )}
          </dl>
        </section>

        <section>
          <div className="startup-context-heading">
            <h2>Investidores</h2>
            <Link to="#investidores">Ver todos</Link>
          </div>
          {investors.length === 0 ? (
            <p className="startup-context-empty">
              Nenhum investidor disponível.
            </p>
          ) : (
            <div className="startup-investor-list">
              {investors.slice(0, 5).map((item) => (
                <Link to={`/painel?kind=investors&id=${item.id}`} key={item.id}>
                  <span className="professional-avatar small">
                    {initials(item.name)}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.company || item.type || "Perfil profissional"}
                    </small>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
