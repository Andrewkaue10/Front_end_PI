import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";
import "../MissingScreens.css";

function initials(name) {
  return (name || "—")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function InvestorMatches() {
  return (
    <AreaShell>
      {(me) => {
        if (!["INVESTOR", "BOTH"].includes(me.role)) {
          return (
            <div className="area-page">
              <p className="area-alert">
                Esta tela é exclusiva para perfis de investidor.
              </p>
            </div>
          );
        }
        return <InvestorMatchesContent me={me} />;
      }}
    </AreaShell>
  );
}

function InvestorMatchesContent({ me }) {
  const [tab, setTab] = useState("for-you");
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [ticket, setTicket] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [catalog, setCatalog] = useState({
    sectors: [],
    stages: [],
    ticketRanges: [],
  });

  useEffect(() => {
    let alive = true;
    api("/catalog")
      .then(
        (data) =>
          alive &&
          setCatalog({
            sectors: data.sectors || [],
            stages: data.stages || [],
            ticketRanges: data.ticketRanges || [],
          }),
      )
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        let data;
        if (tab === "for-you") {
          const params = new URLSearchParams({
            page: "1",
            limit: "50",
            q,
            ...(sector ? { sector } : {}),
            ...(stage ? { stage } : {}),
            ...(ticket ? { ticket } : {}),
          });
          data = await api(`/recommendations?${params}`);
        } else if (tab === "dismissed") {
          data = await api(`/match-dismissals?page=1&limit=50`).catch(() => ({
            items: [],
          }));
        } else {
          data = await api("/connections?page=1&limit=100");
          const status = tab === "pending" ? "PENDING" : "ACCEPTED";
          data = {
            items: (data.items || [])
              .filter((connection) => connection.status === status)
              .map((connection) => ({
                id: connection.startup?.id,
                connection,
                name: connection.startup?.name,
              })),
          };
        }
        if (!alive) return;
        setItems((data.items || []).filter((item) => !item.isDemo));
      } catch (e) {
        if (alive) {
          setItems([]);
          setError(e.message);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [tab, q, sector, stage, ticket]);

  async function connect(startup) {
    if (busyId) return;
    setBusyId(startup.id);
    setError("");
    setNotice("");
    try {
      await api("/connections", {
        method: "POST",
        body: {
          startupId: startup.id,
          purpose: "INVESTMENT",
          introduction:
            "Gostaria de conhecer esta startup e avaliar uma possível conexão de investimento.",
        },
      });
      setNotice("Solicitação de conexão enviada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function connectionAction(connection, action) {
    if (!connection?.id || busyId) return;
    setBusyId(connection.id);
    setError("");
    try {
      await api(`/connections/${connection.id}`, {
        method: "PATCH",
        body: { action },
      });
      setItems((current) =>
        current.filter((item) => item.connection?.id !== connection.id),
      );
      setNotice(
        action === "accept" ? "Conexão aceita." : "Solicitação atualizada.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function dismiss(startup) {
    if (busyId) return;
    setBusyId(startup.id);
    setError("");
    try {
      await api("/match-dismissals", {
        method: "POST",
        body: { startupId: startup.id },
      });
      setItems((current) => current.filter((item) => item.id !== startup.id));
      setNotice("Recomendação dispensada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function restore(startup) {
    if (busyId) return;
    setBusyId(startup.id);
    setError("");
    try {
      await api(`/match-dismissals/${startup.id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== startup.id));
      setNotice("Recomendação restaurada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  const investor = me.investor || {};
  const isPending = tab === "pending";
  const isConnected = tab === "connected";
  const isDismissed = tab === "dismissed";

  return (
    <main className="area-page missing-page">
      <header className="missing-page__title">
        <div>
          <h1>Matches</h1>
          <p className="area-page__lead">
            Startups compatíveis com seu perfil profissional.
          </p>
        </div>
      </header>

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

      <div className="investor-layout">
        <section>
          <div className="profile-tabs">
            {[
              ["for-you", "Para você"],
              ["pending", "Pendentes"],
              ["connected", "Conectadas"],
              ["dismissed", "Dispensadas"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "for-you" && (
            <div className="match-toolbar">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar startup"
              />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              >
                <option value="">Todos os setores</option>
                {catalog.sectors.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">Todos os estágios</option>
                {catalog.stages.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <select
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
              >
                <option value="">Toda faixa de ticket</option>
                {catalog.ticketRanges.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <p className="area-state" role="status">
              Carregando matches…
            </p>
          ) : items.length === 0 ? (
            <p className="area-state">
              Nenhum registro encontrado nesta seleção.
            </p>
          ) : (
            items.map((startup) => (
              <article
                className={`match-card ${tab === "for-you" ? "highlight" : ""}`}
                key={startup.id}
              >
                <div className="match-card__head">
                  <div className="match-card__name">
                    <span className="match-avatar">
                      {startup.initials || initials(startup.name)}
                    </span>
                    <div>
                      <h2>{startup.name}</h2>
                      <p>
                        {startup.category ||
                          startup.sectors?.join(", ") ||
                          "Setor não informado"}
                      </p>
                    </div>
                  </div>
                  {typeof startup.match === "number" && (
                    <div className="match-score">
                      <strong>{startup.match}%</strong>
                      <small>regras rules-v1</small>
                    </div>
                  )}
                </div>
                {startup.description && <p>{startup.description}</p>}
                {startup.matchDetails?.reasons?.length > 0 && (
                  <div className="match-reasons">
                    {startup.matchDetails.reasons.map((reason) => (
                      <span key={reason}>{reason}</span>
                    ))}
                  </div>
                )}
                <dl>
                  <div>
                    <dt>Estágio</dt>
                    <dd>{startup.stage || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Captação</dt>
                    <dd>
                      {startup.ask || startup.fundingRange || "Não informada"}
                    </dd>
                  </div>
                  <div>
                    <dt>Setores</dt>
                    <dd>{startup.sectors?.join(", ") || "Não informado"}</dd>
                  </div>
                </dl>
                <div className="match-card__actions">
                  {startup.id && (
                    <Link
                      className="area-button secondary"
                      to={`/painel?kind=startups&id=${startup.id}`}
                    >
                      Ver perfil completo
                    </Link>
                  )}
                  {isPending && startup.connection && (
                    <>
                      {startup.connection.requestedBy !== me.id && (
                        <button
                          onClick={() =>
                            connectionAction(startup.connection, "accept")
                          }
                          disabled={busyId === startup.connection.id}
                        >
                          Aceitar
                        </button>
                      )}
                      {startup.connection.requestedBy === me.id ? (
                        <button
                          onClick={() =>
                            connectionAction(startup.connection, "cancel")
                          }
                          disabled={busyId === startup.connection.id}
                        >
                          Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            connectionAction(startup.connection, "decline")
                          }
                          disabled={busyId === startup.connection.id}
                        >
                          Recusar
                        </button>
                      )}
                    </>
                  )}
                  {isConnected && startup.connection && (
                    <button
                      onClick={() =>
                        connectionAction(startup.connection, "close")
                      }
                      disabled={busyId === startup.connection.id}
                    >
                      Encerrar conexão
                    </button>
                  )}
                  {isDismissed && (
                    <button
                      onClick={() => restore(startup)}
                      disabled={busyId === startup.id}
                    >
                      Restaurar
                    </button>
                  )}
                  {tab === "for-you" && (
                    <>
                      <button
                        onClick={() => dismiss(startup)}
                        disabled={busyId === startup.id}
                      >
                        Dispensar
                      </button>
                      <button
                        className="primary"
                        onClick={() => connect(startup)}
                        disabled={busyId === startup.id || startup.connection}
                      >
                        {startup.connection
                          ? "Conexão existente"
                          : busyId === startup.id
                            ? "Enviando…"
                            : "Solicitar conexão"}
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="missing-aside">
          <section className="missing-card">
            <h2>Minhas qualificações</h2>
            <dl className="qualification-list">
              <div>
                <dt>Investidor</dt>
                <dd>{investor.name || me.name || "Não informado"}</dd>
              </div>
              {investor.type && (
                <div>
                  <dt>Tipo</dt>
                  <dd>{investor.type}</dd>
                </div>
              )}
              {investor.ticketRange && (
                <div>
                  <dt>Ticket</dt>
                  <dd>{investor.ticketRange}</dd>
                </div>
              )}
              {investor.interests?.length > 0 && (
                <div>
                  <dt>Interesses</dt>
                  <dd>{investor.interests.join(", ")}</dd>
                </div>
              )}
              {investor.stages?.length > 0 && (
                <div>
                  <dt>Estágios</dt>
                  <dd>{investor.stages.join(", ")}</dd>
                </div>
              )}
            </dl>
            <Link className="area-button" to="/investidor/qualificacoes">
              Editar qualificações
            </Link>
          </section>
          <section className="missing-card">
            <h2>Como funciona o match</h2>
            <p>
              O resultado usa regras do sistema <strong>rules-v1</strong>:
              setor, estágio, necessidade de investimento ou mentoria e faixa de
              ticket.
            </p>
          </section>
          <section className="missing-card">
            <h2>Antes de se conectar</h2>
            <p>
              Envie uma introdução objetiva e revise o perfil público antes de
              solicitar a conexão.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
