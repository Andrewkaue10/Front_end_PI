import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { api } from "../../lib/api";

function initials(name) {
  return (name || "—")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
const list = (values) =>
  Array.isArray(values) && values.length ? values.join(", ") : "Não informado";

export default function StartupInvestors() {
  const { me } = useOutletContext();
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const limit = 12;

  useEffect(() => {
    if (!id) return;
    let alive = true;
    api(`/investors/${id}`)
      .then((profile) => alive && setDetail(profile))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          role: "INVESTOR",
          q,
        });
        const [discover, rec, conns] = await Promise.all([
          api(`/investors?${params}`),
          api("/recommendations?page=1&limit=100").catch((e) => {
            if (me.startup?.status !== "APPROVED") return { items: [] };
            throw e;
          }),
          api("/connections?page=1&limit=100"),
        ]);
        if (!alive) return;
        setItems(discover.items || []);
        setTotal(discover.total || 0);
        setRecommendations(
          (rec.items || []).filter((item) =>
            ["INVESTOR", "BOTH"].includes(item.role),
          ),
        );
        setConnections(conns.items || []);
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
  }, [me, q, page]);

  async function connect(profile) {
    if (busyId) return;
    setBusyId(profile.id);
    setError("");
    setNotice("");
    try {
      await api("/connections", {
        method: "POST",
        body: {
          startupId: me.startup.id,
          investorId: profile.id,
          purpose: "INVESTMENT",
          introduction:
            "Gostaria de conhecer oportunidades de investimento compatíveis com a nossa startup.",
        },
      });
      setNotice("Solicitação de conexão enviada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  const connectionFor = (id) =>
    connections.find((item) => item.investor?.id === id);
  const recommendedIds = new Set(recommendations.map((item) => item.id));
  const displayItems = items.filter((item) => !item.isDemo);

  return (
    <main className="startup-page">
      <h1>Investidores</h1>
      <p className="startup-page__lead">
        Perfis profissionais aprovados e compatíveis com a startup.
      </p>
      {id &&
        (loading ? (
          <p className="startup-state" role="status">
            Carregando perfil…
          </p>
        ) : detail ? (
          <article className="startup-profile-card">
            <div className="startup-profile-card__head">
              <span className="startup-avatar">{initials(detail.name)}</span>
              <div>
                <h2>{detail.name}</h2>
                <p className="startup-profile-card__meta">
                  {detail.company || detail.type || "Perfil profissional"}
                </p>
              </div>
            </div>
            <p className="startup-profile-card__bio">
              {detail.bio || "Descrição não informada"}
            </p>
            <dl>
              <div>
                <dt>Interesses</dt>
                <dd>{list(detail.interests)}</dd>
              </div>
              <div>
                <dt>Estágios</dt>
                <dd>{list(detail.stages)}</dd>
              </div>
              <div>
                <dt>Ticket</dt>
                <dd>{detail.ticketRange || "Não informado"}</dd>
              </div>
            </dl>
            <div className="startup-profile-card__actions">
              <Link to="/startup/investidores">Voltar à lista</Link>
            </div>
          </article>
        ) : null)}
      {me.startup?.status !== "APPROVED" && (
        <p className="startup-alert" role="status">
          Seu perfil está{" "}
          {me.startup?.status === "REJECTED"
            ? "reprovado"
            : "aguardando análise"}
          . Recomendações exigem aprovação; revise os dados em{" "}
          <Link to="/painel#perfil">Perfil da startup</Link>.
        </p>
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
      {!id && (
        <div className="startup-toolbar">
          <div className="startup-toolbar__filters">
            <label>
              <span className="sr-only">Buscar investidores</span>
              <input
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Buscar investidores"
              />
            </label>
          </div>
        </div>
      )}
      {!id &&
        (loading ? (
          <p className="startup-state" role="status">
            Carregando perfis…
          </p>
        ) : displayItems.length === 0 ? (
          <p className="startup-state">
            Nenhum investidor aprovado está disponível no momento.
          </p>
        ) : (
          <div className="startup-grid">
            {displayItems.map((profile) => {
              const recommendation = recommendations.find(
                (item) => item.id === profile.id,
              );
              const connection = connectionFor(profile.id);
              const incompatible = !me.startup?.needs?.includes("INVESTMENT");
              return (
                <article className="startup-profile-card" key={profile.id}>
                  <div className="startup-profile-card__head">
                    <span className="startup-avatar">
                      {initials(profile.name)}
                    </span>
                    <div>
                      <h2>{profile.name}</h2>
                      <p className="startup-profile-card__meta">
                        {profile.company ||
                          profile.type ||
                          "Perfil profissional"}
                      </p>
                    </div>
                    {recommendedIds.has(profile.id) &&
                      recommendation?.match != null && (
                        <strong className="startup-match">
                          {recommendation.match}% de match
                        </strong>
                      )}
                  </div>
                  <p className="startup-profile-card__bio">
                    {profile.bio || "Descrição não informada"}
                  </p>
                  <dl>
                    <div>
                      <dt>Interesses</dt>
                      <dd>{list(profile.interests)}</dd>
                    </div>
                    <div>
                      <dt>Estágios</dt>
                      <dd>{list(profile.stages)}</dd>
                    </div>
                    <div>
                      <dt>Ticket</dt>
                      <dd>{profile.ticketRange || "Não informado"}</dd>
                    </div>
                  </dl>
                  {recommendation?.matchDetails?.reasons?.length > 0 && (
                    <p className="startup-profile-card__bio">
                      {recommendation.matchDetails.reasons.join(" · ")}
                    </p>
                  )}
                  <div className="startup-profile-card__actions">
                    <Link to={`/startup/investidores/${profile.id}`}>
                      Ver perfil
                    </Link>
                    <button
                      disabled={
                        busyId === profile.id ||
                        Boolean(connection) ||
                        incompatible
                      }
                      onClick={() => connect(profile)}
                    >
                      {connection
                        ? "Conexão existente"
                        : incompatible
                          ? "Indisponível"
                          : busyId === profile.id
                            ? "Enviando…"
                            : "Conectar"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      {!id && (
        <nav className="startup-pagination" aria-label="Paginação">
          <button disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>
            Anterior
          </button>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage((v) => v + 1)}
          >
            Próxima
          </button>
        </nav>
      )}
    </main>
  );
}
