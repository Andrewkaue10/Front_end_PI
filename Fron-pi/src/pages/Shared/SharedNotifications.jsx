import { useEffect, useState } from "react";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";
import "./SharedPages.css";

const labels = {
  CONNECTION_REQUEST: "Solicitação de conexão",
  CONNECTION_ACCEPTED: "Conexão aceita",
  CONNECTION_DECLINED: "Conexão recusada",
  CONNECTION_CANCELLED: "Conexão cancelada",
  CONNECTION_CLOSED: "Conexão encerrada",
  MESSAGE: "Nova mensagem",
  MEETING_PROPOSED: "Reunião proposta",
  MEETING_CONFIRMED: "Reunião confirmada",
  MEETING_CANCELLED: "Reunião cancelada",
  MEETING_COMPLETED: "Reunião concluída",
  PROFILE_APPROVED: "Perfil aprovado",
  PROFILE_REJECTED: "Perfil reprovado",
};

export default function SharedNotifications() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("TODAS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    api(`/notifications?page=${page}&limit=20`)
      .then((data) => alive && setItems(data.items || []))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [page]);

  async function markRead(id) {
    if (busyId) return;
    setBusyId(id);
    setError("");
    try {
      await api(`/notifications/${id}`, { method: "PATCH" });
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  const visible = items.filter(
    (item) =>
      filter === "TODAS" || (filter === "NAO_LIDAS" ? !item.read : item.read),
  );

  return (
    <AreaShell>
      <div className="area-page shared-notifications">
        <h1>Notificações</h1>
        <p className="area-page__lead">
          Atualizações reais da sua conta e das suas conexões.
        </p>
        {error && (
          <p className="area-alert" role="alert">
            {error}
          </p>
        )}
        <div
          className="shared-notifications__toolbar"
          aria-label="Filtro de notificações"
        >
          {["TODAS", "NAO_LIDAS", "LIDAS"].map((value) => (
            <button
              key={value}
              className={`area-button ${filter === value ? "" : "secondary"}`}
              onClick={() => setFilter(value)}
            >
              {value === "NAO_LIDAS"
                ? "Não lidas"
                : value === "LIDAS"
                  ? "Lidas"
                  : "Todas"}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="area-state" role="status">
            Carregando notificações…
          </p>
        ) : visible.length === 0 ? (
          <p className="area-state">Nenhuma notificação nesta seleção.</p>
        ) : (
          <div className="shared-notifications__list">
            {visible.map((item) => (
              <article
                className={`area-card shared-notification ${item.read ? "" : "unread"}`}
                key={item.id}
              >
                <div className="shared-notification__meta">
                  <strong>{labels[item.type] || "Nova atualização"}</strong>
                  <small>
                    {new Date(item.createdAt).toLocaleString("pt-BR")} ·{" "}
                    {item.read ? "Lida" : "Não lida"}
                  </small>
                </div>
                {!item.read && (
                  <button
                    className="area-button secondary"
                    disabled={busyId === item.id}
                    onClick={() => markRead(item.id)}
                  >
                    {busyId === item.id ? "Marcando…" : "Marcar como lida"}
                  </button>
                )}
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
            disabled={items.length < 20}
            onClick={() => setPage((value) => value + 1)}
          >
            Próxima
          </button>
        </nav>
      </div>
    </AreaShell>
  );
}
