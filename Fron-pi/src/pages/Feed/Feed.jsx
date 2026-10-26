import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, TrendingUp } from "lucide-react";
import { api, token, clearSession } from "../../lib/api";
import "./Feed.css";

export default function Feed() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null),
    [items, setItems] = useState([]),
    [mode, setMode] = useState("all"),
    [q, setQ] = useState(""),
    [category, setCategory] = useState("Todos"),
    [page, setPage] = useState(1),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!token()) {
      navigate("/login");
      return;
    }
    api("/auth/me")
      .then(setMe)
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [navigate]);
  useEffect(() => {
    if (!me) return;
    let alive = true;
    const query = new URLSearchParams({
      q,
      category,
      page,
      limit: 12,
      ...(mode === "favorites" ? { favorites: "true" } : {}),
    });
    const path =
      mode === "recommended"
        ? "/recommendations"
        : me.role === "STARTUP"
          ? "/investors"
          : "/startups";
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      api(path + "?" + query)
        .then((d) => {
          if (alive) setItems(d.items);
        })
        .catch((e) => {
          if (alive) {
            setError(e.message);
            setItems([]);
          }
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [me, mode, q, category, page, revision]);
  async function favorite(s) {
    setBusy(true);
    try {
      await api("/favorites/" + s.id, {
        method: s.favorited ? "DELETE" : "PUT",
      });
      setRevision((n) => n + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
      clearSession();
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  }
  const choose = (m) => {
    setMode(m);
    setPage(1);
  };
  const professional = me && ["INVESTOR", "MENTOR", "BOTH"].includes(me.role);
  return (
    <div className="nexhub theme-blue">
      <aside className="nx-sidebar">
        <nav className="nx-sidebar-nav">
          <button className="nx-sidebar-item" onClick={() => choose("all")}>
            Explorar
          </button>
          <button
            className="nx-sidebar-item"
            onClick={() => choose("recommended")}
          >
            Recomendações
          </button>
          {professional && (
            <button
              className="nx-sidebar-item"
              onClick={() => choose("favorites")}
            >
              Favoritos
            </button>
          )}
          <Link className="nx-sidebar-item" to="/painel">
            Meu perfil, conversas e agenda
          </Link>
          <button className="nx-sidebar-item" onClick={logout}>
            Sair
          </button>
        </nav>
      </aside>
      <div className="nx-main">
        <header className="nx-header">
          <span>Olá, {me?.name || "carregando…"}</span>
          <Link to="/painel">Minha área</Link>
        </header>
        <main className="nx-content">
          <div className="nx-content-header">
            <h1>
              {mode === "recommended"
                ? "Recomendações para você"
                : mode === "favorites"
                  ? "Seus favoritos"
                  : me?.role === "STARTUP"
                    ? "Investidores e mentores"
                    : "Seu feed de startups"}
            </h1>
          </div>
          <p>
            Compatibilidade por regras: setor, estágio, investimento ou
            mentoria. Perfis marcados como demonstração são fictícios.
          </p>
          {mode !== "recommended" && me?.role !== "STARTUP" && (
            <div className="nx-pills">
              <label className="nx-search">
                <Search size={16} />
                <input
                  aria-label="Buscar startup"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar startups"
                />
              </label>
              <select
                aria-label="Filtrar setor"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                {[
                  "Todos",
                  "Fintech",
                  "Healthtech",
                  "Edtech",
                  "SaaS",
                  "IA",
                  "Mobilidade",
                  "E-commerce",
                  "Outros",
                  "Estágio MVP+",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {error && <p role="alert">{error}</p>}
          {loading ? (
            <p role="status">Carregando perfis…</p>
          ) : (
            <div className="nx-card-list">
              {!items.length && !error && (
                <p className="nx-empty">
                  Nenhum perfil encontrado. Complete seu perfil e confira a
                  aprovação em Minha área.
                </p>
              )}
              {items.map((s) => (
                <article className="nx-card" key={s.id}>
                  <div
                    className="nx-card-avatar"
                    style={{ backgroundColor: s.color || "#2451B7" }}
                  >
                    {s.initials || s.name.slice(0, 2)}
                  </div>
                  <div className="nx-card-body">
                    <div className="nx-card-title-row">
                      <h2>{s.name}</h2>
                      {s.isDemo && (
                        <span className="nx-card-tag">Demonstração</span>
                      )}
                      {s.match !== null && (
                        <span className="nx-match-badge">
                          <TrendingUp size={12} />
                          {s.match}% compatível
                        </span>
                      )}
                    </div>
                    <p className="nx-card-desc">{s.description || s.bio}</p>
                    <p>
                      {s.stage || s.role} ·{" "}
                      {(s.sectors || s.interests || []).join(", ")}
                    </p>
                    {s.matchDetails && (
                      <ul>
                        {s.matchDetails.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    )}
                    <div className="nx-card-bottom">
                      <div className="nx-metrics">
                        {s.ask && (
                          <div>
                            <p className="nx-metric-value">{s.ask}</p>
                            <p>Captação informada</p>
                          </div>
                        )}
                        {s.growth && (
                          <div>
                            <p className="nx-metric-value">{s.growth}</p>
                            <p>Crescimento</p>
                          </div>
                        )}
                        {s.valuation && (
                          <div>
                            <p className="nx-metric-value">{s.valuation}</p>
                            <p>Valuation</p>
                          </div>
                        )}
                        {s.ticketRange && <p>Ticket: {s.ticketRange}</p>}
                        {s.specialties?.length > 0 && (
                          <p>Mentoria: {s.specialties.join(", ")}</p>
                        )}
                      </div>
                      <div className="nx-card-actions">
                        {professional && (
                          <button
                            disabled={busy}
                            className="nx-fav-btn"
                            aria-label={
                              s.favorited ? "Remover favorito" : "Favoritar"
                            }
                            onClick={() => favorite(s)}
                          >
                            <Heart fill={s.favorited ? "#f43f5e" : "none"} />
                          </button>
                        )}
                        <Link
                          className="nx-connect-btn"
                          to={`/painel?kind=${s.sectors ? "startups" : "investors"}&id=${s.id}`}
                        >
                          Ver perfil e conectar
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="nx-card-actions">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              disabled={items.length < 12 || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
