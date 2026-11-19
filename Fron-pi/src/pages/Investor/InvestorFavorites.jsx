import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";
import "../Shared/SharedPages.css";

function initials(name) {
  return (name || "—")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function InvestorFavorites() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const limit = 12;

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          favorites: "true",
          page: String(page),
          limit: String(limit),
          q,
        });
        const data = await api(`/startups?${params}`);
        if (!alive) return;
        setItems((data.items || []).filter((item) => !item.isDemo));
        setTotal(data.total || 0);
      } catch (e) {
        if (alive) {
          setError(e.message);
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q, page]);

  async function remove(id) {
    if (busyId) return;
    setBusyId(id);
    setError("");
    try {
      await api(`/favorites/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
      setTotal((current) => Math.max(0, current - 1));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <AreaShell>
      {(me) => {
        if (me.role === "STARTUP")
          return (
            <div className="area-page">
              <p className="area-alert">
                Esta tela é exclusiva para perfis profissionais.
              </p>
            </div>
          );
        return (
          <div className="area-page investor-list-page">
            <h1>Favoritos</h1>
            <p className="area-page__lead">
              Startups aprovadas que você marcou como favoritas.
            </p>
            {error && (
              <p className="area-alert" role="alert">
                {error}
              </p>
            )}
            <div className="startup-toolbar">
              <div className="startup-toolbar__filters">
                <input
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  placeholder="Buscar favoritos"
                />
              </div>
            </div>
            {loading ? (
              <p className="area-state" role="status">
                Carregando favoritos…
              </p>
            ) : items.length === 0 ? (
              <p className="area-state">Nenhuma startup favorita encontrada.</p>
            ) : (
              <div className="investor-list-page__grid">
                {items.map((item) => (
                  <article
                    className="area-card investor-list-page__card"
                    key={item.id}
                  >
                    <div className="investor-list-page__head">
                      <span className="startup-avatar">
                        {item.initials || initials(item.name)}
                      </span>
                      <div>
                        <h2>{item.name}</h2>
                        <p>
                          {item.category ||
                            item.sectors?.join(", ") ||
                            "Setor não informado"}
                        </p>
                      </div>
                    </div>
                    <p>{item.description || "Descrição não informada"}</p>
                    <dl>
                      <div>
                        <dt>Estágio</dt>
                        <dd>{item.stage || "Não informado"}</dd>
                      </div>
                      <div>
                        <dt>Setores</dt>
                        <dd>{item.sectors?.join(", ") || "Não informado"}</dd>
                      </div>
                      <div>
                        <dt>Localização</dt>
                        <dd>
                          {[item.city, item.state]
                            .filter(Boolean)
                            .join(" / ") || "Não informada"}
                        </dd>
                      </div>
                    </dl>
                    <div className="investor-list-page__actions">
                      <Link
                        className="area-button secondary"
                        to={`/painel?kind=startups&id=${item.id}`}
                      >
                        Ver perfil
                      </Link>
                      <button
                        className="area-button"
                        disabled={busyId === item.id}
                        onClick={() => remove(item.id)}
                      >
                        {busyId === item.id ? "Removendo…" : "Remover"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <nav className="startup-pagination" aria-label="Paginação">
              <button
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Anterior
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage((value) => value + 1)}
              >
                Próxima
              </button>
            </nav>
          </div>
        );
      }}
    </AreaShell>
  );
}
