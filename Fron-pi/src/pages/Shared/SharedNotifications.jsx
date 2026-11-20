import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bell,
  ArrowUpRight,
  CheckCheck,
  ChevronDown,
  CalendarDays,
  Users,
  MessageSquare,
} from "lucide-react";
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
  PROFILE_REJECTED: "Perfil precisa de revisão",
};
export default function SharedNotifications() {
  const [params, setParams] = useSearchParams();
  const selected = params.get("notification") || "";
  const [items, setItems] = useState([]),
    [page, setPage] = useState(1),
    [filter, setFilter] = useState("TODAS");
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busyId, setBusyId] = useState("");
  const [detail, setDetail] = useState(null),
    [detailLoading, setDetailLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    api(`/notifications?page=${page}&limit=20`)
      .then((d) => alive && setItems(d.items || []))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [page]);
  useEffect(() => {
    let alive = true;
    setDetail(null);
    setError("");
    if (!selected) return;
    setDetailLoading(true);
    api(`/notifications/${encodeURIComponent(selected)}`)
      .then(async (d) => {
        if (!alive) return;
        setDetail(d);
        if (!d.read) {
          await api(`/notifications/${d.id}`, { method: "PATCH" });
          if (alive)
            setItems((current) =>
              current.map((n) => (n.id === d.id ? { ...n, read: true } : n)),
            );
        }
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setDetailLoading(false));
    return () => {
      alive = false;
    };
  }, [selected]);
  async function markRead(id) {
    if (busyId) return;
    setBusyId(id);
    setError("");
    try {
      await api(
        id === "all" ? "/notifications/read-all" : `/notifications/${id}`,
        { method: "PATCH" },
      );
      setItems((current) =>
        current.map((n) =>
          id === "all" || n.id === id ? { ...n, read: true } : n,
        ),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }
  async function respond(action) {
    if (busyId || !detail?.connection) return;
    setBusyId("respond");
    setError("");
    try {
      await api(`/connections/${detail.connection.id}`, {
        method: "PATCH",
        body: { action },
      });
      setDetail(await api(`/notifications/${detail.id}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }
  const visible = items.filter(
    (n) => filter === "TODAS" || (filter === "NAO_LIDAS" ? !n.read : n.read),
  );
  return (
    <AreaShell>
      <div className="area-page shared-notifications">
        <p className="page-eyebrow">FIQUE POR DENTRO</p>
        <h1>Suas notificações</h1>
        <p className="area-page__lead">
          Convites, conversas e próximos encontros, em um só lugar.
        </p>
        {error && (
          <p className="area-alert" role="alert">
            {error}
          </p>
        )}
        <div className="shared-notifications__toolbar">
          <div className="notification-filters">
            {[
              ["TODAS", "Todas"],
              ["NAO_LIDAS", "Não lidas"],
              ["LIDAS", "Lidas"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={filter === value}
                className={`area-button ${filter === value ? "" : "secondary"}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="area-button secondary"
            disabled={!!busyId || !items.some((n) => !n.read)}
            onClick={() => markRead("all")}
          >
            <CheckCheck size={16} /> Marcar todas como lidas
          </button>
        </div>
        {selected && (
          <section
            className="notification-detail area-card"
            aria-label="Detalhes da notificação"
            aria-live="polite"
          >
            <div className="notification-detail__heading">
              <h2>{labels[detail?.type] || "Detalhes da notificação"}</h2>
              <button
                className="area-button secondary"
                onClick={() => setParams({})}
              >
                Fechar
              </button>
            </div>
            {detailLoading ? (
              <p>Carregando detalhes…</p>
            ) : detail ? (
              <>
                {detail.partner && <h3>{detail.partner.name}</h3>}
                {detail.connection && (
                  <>
                    <p className="profile-bio">
                      {detail.connection.introduction ||
                        "Atualização da sua conexão."}
                    </p>
                    <span className="profile-badge">
                      {
                        {
                          PENDING: "Aguardando resposta",
                          ACCEPTED: "Conexão aceita",
                          DECLINED: "Recusada",
                          CANCELLED: "Cancelada",
                          CLOSED: "Encerrada",
                        }[detail.connection.status]
                      }
                    </span>
                    <div className="notification-detail__actions">
                      {detail.connection.canRespond && (
                        <>
                          <button
                            className="area-button"
                            disabled={!!busyId}
                            onClick={() => respond("accept")}
                          >
                            Aceitar convite
                          </button>
                          <button
                            className="area-button secondary"
                            disabled={!!busyId}
                            onClick={() => respond("decline")}
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      {detail.connection.status === "ACCEPTED" && (
                        <Link
                          className="area-button"
                          to={`/mensagens?connection=${detail.connection.id}`}
                        >
                          Abrir conversa <ArrowUpRight size={16} />
                        </Link>
                      )}
                    </div>
                  </>
                )}
                {detail.meeting && (
                  <>
                    <h3>{detail.meeting.title}</h3>
                    <p>
                      {new Date(detail.meeting.startsAt).toLocaleString(
                        "pt-BR",
                      )}
                    </p>
                    <Link
                      className="area-button"
                      to={`/mensagens?connection=${detail.meeting.connectionId}`}
                    >
                      Ver reunião na conversa <ArrowUpRight size={16} />
                    </Link>
                  </>
                )}
                {detail.type.startsWith("PROFILE_") && (
                  <>
                    <p>
                      O status do seu perfil foi atualizado. Consulte seus dados
                      e os próximos passos.
                    </p>
                    <Link className="area-button" to="/perfil">
                      Ver meu perfil
                    </Link>
                  </>
                )}
                {!detail.connection &&
                  !detail.meeting &&
                  !detail.type.startsWith("PROFILE_") && (
                    <p>O registro relacionado não está mais disponível.</p>
                  )}
              </>
            ) : (
              <p>Não foi possível abrir esta notificação.</p>
            )}
          </section>
        )}
        {loading ? (
          <p className="area-state" role="status">
            Carregando notificações…
          </p>
        ) : visible.length === 0 ? (
          <div className="notification-empty area-card">
            <Bell size={32} />
            <h2>Tudo em dia por aqui</h2>
            <p>Nenhuma notificação nesta seleção.</p>
          </div>
        ) : (
          <div className="shared-notifications__list">
            {visible.map((item) => {
              const Icon = item.type.startsWith("MEETING")
                ? CalendarDays
                : item.type === "MESSAGE"
                  ? MessageSquare
                  : Users;
              return (
                <article
                  className={`area-card shared-notification ${item.read ? "" : "unread"}`}
                  key={item.id}
                >
                  <button
                    className="notification-open"
                    aria-expanded={selected === item.id}
                    onClick={() =>
                      setParams(
                        selected === item.id ? {} : { notification: item.id },
                      )
                    }
                  >
                    <span className="notification-icon">
                      <Icon size={20} />
                    </span>
                    <span className="shared-notification__meta">
                      <strong>{labels[item.type] || "Nova atualização"}</strong>
                      <small>
                        {new Date(item.createdAt).toLocaleString("pt-BR")} ·{" "}
                        {item.read ? "Lida" : "Não lida"}
                      </small>
                      <span className="notification-open__hint">
                        Ver detalhes <ChevronDown size={14} />
                      </span>
                    </span>
                  </button>
                  {!item.read && (
                    <button
                      className="area-button secondary"
                      disabled={!!busyId}
                      onClick={() => markRead(item.id)}
                    >
                      Marcar como lida
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
        <nav className="startup-pagination" aria-label="Paginação">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span>Página {page}</span>
          <button
            disabled={items.length < 20}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </button>
        </nav>
      </div>
    </AreaShell>
  );
}
