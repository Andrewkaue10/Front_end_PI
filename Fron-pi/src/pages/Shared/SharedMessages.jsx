import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";
import "./SharedPages.css";

function initials(name) {
  return (name || "—")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function SharedMessages() {
  const [connections, setConnections] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [detail, setDetail] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [meeting, setMeeting] = useState({
    title: "",
    startsAt: "",
    duration: "30",
    timezone: "America/Fortaleza",
    location: "",
  });

  useEffect(() => {
    let alive = true;
    api("/connections?page=1&limit=100")
      .then((data) => {
        if (!alive) return;
        setConnections(data.items || []);
        if (data.items?.length)
          setSelectedId((current) => current || data.items[0].id);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    api("/meetings?page=1&limit=100")
      .then((data) => alive && setMeetings(data.items || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let alive = true;
    setLoading(true);
    setError("");
    Promise.all([
      api(`/connections/${selectedId}/messages?page=1&limit=100`).catch((e) => {
        throw e;
      }),
      api("/connections?page=1&limit=100"),
    ])
      .then(([messageData, connectionData]) => {
        if (!alive) return;
        setMessages(messageData.items || []);
        api(`/connections/${selectedId}/read`, { method: "POST" }).catch(
          () => {},
        );
        const selected = (connectionData.items || []).find(
          (item) => item.id === selectedId,
        );
        if (selected) loadDetail(selected);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [selectedId]);

  async function loadDetail(connection) {
    try {
      if (connection.startup?.id && connection.investor?.id) {
        const me = await api("/auth/me");
        const isStartup = me.role === "STARTUP";
        setDetail(
          isStartup
            ? await api(`/investors/${connection.investor.id}`)
            : await api(`/startups/${connection.startup.id}`),
        );
      }
    } catch (e) {
      setDetail(null);
      setError(e.message);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!selectedId || !text.trim()) return;
    setSending(true);
    setError("");
    setNotice("");
    try {
      await api(`/connections/${selectedId}/messages`, {
        method: "POST",
        body: { text: text.trim(), clientId: crypto.randomUUID() },
      });
      setText("");
      const data = await api(
        `/connections/${selectedId}/messages?page=1&limit=100`,
      );
      setMessages(data.items || []);
      setNotice("Mensagem enviada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function proposeMeeting(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      await api(`/connections/${selectedId}/meetings`, {
        method: "POST",
        body: {
          title: meeting.title,
          startsAt: new Date(meeting.startsAt).toISOString(),
          duration: Number(meeting.duration),
          timezone: meeting.timezone,
          location: meeting.location,
        },
      });
      setShowMeeting(false);
      setNotice("Reunião proposta.");
      const data = await api("/meetings?page=1&limit=100");
      setMeetings(data.items || []);
    } catch (e) {
      setError(e.message);
    }
  }

  const selected = connections.find((item) => item.id === selectedId);
  const selectedMeetings = meetings.filter(
    (item) => item.connectionId === selectedId,
  );

  return (
    <AreaShell>
      {(me) => (
        <div className="area-page shared-messages">
          <h1>Mensagens</h1>
          <p className="area-page__lead">
            Conversas disponíveis em conexões aceitas.
          </p>
          {error && (
            <p className="area-alert" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="area-notice" role="status">
              {notice}
            </p>
          )}
          {loading && connections.length === 0 ? (
            <p className="area-state" role="status">
              Carregando conversas…
            </p>
          ) : connections.length === 0 ? (
            <p className="area-state">Nenhuma conexão real encontrada.</p>
          ) : (
            <div className="shared-messages__layout">
              <section
                className="shared-messages__conversations area-card"
                aria-label="Conversas"
              >
                <h2>Conversas</h2>
                {connections.map((connection) => {
                  const partner =
                    me.role === "STARTUP"
                      ? connection.investor
                      : connection.startup;
                  return (
                    <button
                      key={connection.id}
                      className={selectedId === connection.id ? "active" : ""}
                      onClick={() => setSelectedId(connection.id)}
                    >
                      <span>{initials(partner?.name)}</span>
                      <div>
                        <strong>{partner?.name || "Contato"}</strong>
                        <small>
                          {connection.status} · {connection.purpose}
                        </small>
                      </div>
                    </button>
                  );
                })}
              </section>

              <section
                className="shared-messages__thread area-card"
                aria-label="Conversa selecionada"
              >
                {selected ? (
                  <>
                    <header>
                      <div>
                        <strong>
                          {me.role === "STARTUP"
                            ? selected.investor?.name
                            : selected.startup?.name}
                        </strong>
                        <small>{selected.status}</small>
                      </div>
                      {selected.status === "ACCEPTED" && (
                        <button
                          className="area-button secondary"
                          onClick={() => setShowMeeting((value) => !value)}
                        >
                          Agendar reunião
                        </button>
                      )}
                    </header>
                    {showMeeting && (
                      <form
                        className="area-form shared-messages__meeting"
                        onSubmit={proposeMeeting}
                      >
                        <label>
                          Título
                          <input
                            value={meeting.title}
                            onChange={(e) =>
                              setMeeting({ ...meeting, title: e.target.value })
                            }
                            minLength={3}
                            maxLength={120}
                            required
                          />
                        </label>
                        <label>
                          Data e hora
                          <input
                            type="datetime-local"
                            value={meeting.startsAt}
                            onChange={(e) =>
                              setMeeting({
                                ...meeting,
                                startsAt: e.target.value,
                              })
                            }
                            required
                          />
                        </label>
                        <label>
                          Duração
                          <select
                            value={meeting.duration}
                            onChange={(e) =>
                              setMeeting({
                                ...meeting,
                                duration: e.target.value,
                              })
                            }
                          >
                            {[15, 30, 45, 60, 90].map((duration) => (
                              <option key={duration} value={duration}>
                                {duration} minutos
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Local ou link
                          <input
                            value={meeting.location}
                            onChange={(e) =>
                              setMeeting({
                                ...meeting,
                                location: e.target.value,
                              })
                            }
                            minLength={5}
                            maxLength={2048}
                            required
                          />
                        </label>
                        <button className="area-button" type="submit">
                          Propor reunião
                        </button>
                      </form>
                    )}
                    {selectedMeetings.length > 0 && (
                      <div className="shared-messages__meetings">
                        {selectedMeetings.map((item) => (
                          <p key={item.id}>
                            <strong>{item.title}</strong> ·{" "}
                            {new Date(item.startsAt).toLocaleString("pt-BR")} ·{" "}
                            {item.status}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="shared-messages__history">
                      {messages.length === 0 ? (
                        <p className="area-state">
                          Nenhuma mensagem nesta conversa.
                        </p>
                      ) : (
                        messages.map((message) => (
                          <article key={message.id}>
                            <p>{message.text}</p>
                            <small>
                              {new Date(message.createdAt).toLocaleString(
                                "pt-BR",
                              )}
                            </small>
                          </article>
                        ))
                      )}
                    </div>
                    {selected.status === "ACCEPTED" ? (
                      <form
                        className="shared-messages__composer"
                        onSubmit={sendMessage}
                      >
                        <label className="sr-only" htmlFor="message-text">
                          Mensagem
                        </label>
                        <input
                          id="message-text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          maxLength={2000}
                          placeholder="Escreva uma mensagem…"
                        />
                        <button
                          className="area-button"
                          disabled={sending || !text.trim()}
                          type="submit"
                        >
                          {sending ? "Enviando…" : "Enviar"}
                        </button>
                      </form>
                    ) : (
                      <p className="area-state">
                        O envio de mensagens exige conexão aceita.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="area-state">Selecione uma conversa.</p>
                )}
              </section>

              <aside className="shared-messages__context area-card">
                <h2>Contexto do contato</h2>
                {detail ? (
                  <>
                    <strong>{detail.name}</strong>
                    {detail.bio && <p>{detail.bio}</p>}
                    {detail.description && <p>{detail.description}</p>}
                    {detail.sectors && (
                      <small>Setores: {detail.sectors.join(", ")}</small>
                    )}
                    {detail.specialties && (
                      <small>
                        Especialidades: {detail.specialties.join(", ")}
                      </small>
                    )}
                    {detail.id && (
                      <Link
                        className="area-button"
                        to={
                          me.role === "STARTUP"
                            ? `/startup/investidores/${detail.id}`
                            : `/feed?startup=${detail.id}`
                        }
                      >
                        Ver perfil
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="area-state">
                    Perfil indisponível ou sem acesso.
                  </p>
                )}
              </aside>
            </div>
          )}
        </div>
      )}
    </AreaShell>
  );
}
