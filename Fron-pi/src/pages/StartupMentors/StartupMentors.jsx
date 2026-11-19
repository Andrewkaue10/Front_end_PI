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

export default function StartupMentors() {
  const { me } = useOutletContext();
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const limit = 12;
  const canMentor = me.startup?.needs?.some((need) => need !== "INVESTMENT");

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
          role: "MENTOR",
          q,
          ...(specialty ? { specialty } : {}),
        });
        const [discover, both, rec, conns, meetingsData] = await Promise.all([
          api(`/investors?${params}`),
          api(
            `/investors?${new URLSearchParams({ page: "1", limit: "100", role: "BOTH", q, ...(specialty ? { specialty } : {}) })}`,
          ),
          api("/recommendations?page=1&limit=100").catch(() => ({ items: [] })),
          api("/connections?page=1&limit=100"),
          api("/meetings?page=1&limit=100"),
        ]);
        if (!alive) return;
        const merged = [
          ...(discover.items || []),
          ...(both.items || []),
        ].filter(
          (item, index, all) =>
            all.findIndex((x) => x.id === item.id) === index,
        );
        setItems(merged);
        setTotal((discover.total || 0) + (both.total || 0));
        setRecommendations(
          (rec.items || []).filter((item) =>
            ["MENTOR", "BOTH"].includes(item.role),
          ),
        );
        setConnections(conns.items || []);
        setMeetings(meetingsData.items || []);
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
  }, [me, q, specialty, page]);

  async function requestMentorship(profile) {
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
          purpose: "MENTORSHIP",
          introduction:
            "Gostaria de solicitar mentoria para apoiar o desenvolvimento da nossa startup.",
        },
      });
      setNotice("Solicitação de mentoria enviada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  const connectionFor = (id) =>
    connections.find((item) => item.investor?.id === id);
  const mentorConnections = connections.filter(
    (item) => item.purpose === "MENTORSHIP",
  );

  return (
    <main className="startup-page">
      <h1>Mentores</h1>
      <p className="startup-page__lead">
        Encontre profissionais aprovados por especialidade e acompanhe sessões
        reais.
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
                  {detail.company || "Perfil profissional"}
                </p>
              </div>
            </div>
            <p className="startup-profile-card__bio">
              {detail.bio || "Descrição não informada"}
            </p>
            <dl>
              <div>
                <dt>Especialidades</dt>
                <dd>{list(detail.specialties)}</dd>
              </div>
              <div>
                <dt>Disponibilidade</dt>
                <dd>
                  {detail.availability != null
                    ? `${detail.availability} h/mês`
                    : "Não informada"}
                </dd>
              </div>
              <div>
                <dt>Cidade/estado</dt>
                <dd>
                  {[detail.city, detail.state].filter(Boolean).join(" / ") ||
                    "Não informado"}
                </dd>
              </div>
            </dl>
            <div className="startup-profile-card__actions">
              <Link to="/startup/mentores">Voltar à lista</Link>
            </div>
          </article>
        ) : null)}
      {me.startup?.status !== "APPROVED" && (
        <p className="startup-alert" role="status">
          Seu perfil precisa ser aprovado para receber recomendações.
        </p>
      )}
      {!canMentor && (
        <p className="startup-alert" role="status">
          A startup não possui uma necessidade de mentoria cadastrada.{" "}
          <Link to="/painel#perfil">Revisar perfil</Link>.
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
      <div className="startup-toolbar">
        <div className="startup-toolbar__filters">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Buscar mentores"
          />
          <input
            value={specialty}
            onChange={(e) => {
              setPage(1);
              setSpecialty(e.target.value);
            }}
            placeholder="Especialidade"
          />
        </div>
      </div>
      {loading ? (
        <p className="startup-state" role="status">
          Carregando mentores…
        </p>
      ) : items.length === 0 ? (
        <p className="startup-state">
          Nenhum mentor aprovado está disponível no momento.
        </p>
      ) : (
        <div className="startup-grid">
          {items
            .filter((item) => !item.isDemo)
            .map((profile) => {
              const connection = connectionFor(profile.id);
              const recommendation = recommendations.find(
                (item) => item.id === profile.id,
              );
              return (
                <article className="startup-profile-card" key={profile.id}>
                  <div className="startup-profile-card__head">
                    <span className="startup-avatar">
                      {initials(profile.name)}
                    </span>
                    <div>
                      <h2>{profile.name}</h2>
                      <p className="startup-profile-card__meta">
                        {profile.company || "Perfil profissional"}
                      </p>
                    </div>
                    {recommendation?.match != null && (
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
                      <dt>Especialidades</dt>
                      <dd>{list(profile.specialties)}</dd>
                    </div>
                    <div>
                      <dt>Disponibilidade</dt>
                      <dd>
                        {profile.availability != null
                          ? `${profile.availability} h/mês`
                          : "Não informada"}
                      </dd>
                    </div>
                    <div>
                      <dt>Cidade/estado</dt>
                      <dd>
                        {[profile.city, profile.state]
                          .filter(Boolean)
                          .join(" / ") || "Não informado"}
                      </dd>
                    </div>
                  </dl>
                  <div className="startup-profile-card__actions">
                    <Link to={`/startup/mentores/${profile.id}`}>
                      Ver perfil
                    </Link>
                    <button
                      disabled={
                        busyId === profile.id ||
                        Boolean(connection) ||
                        !canMentor
                      }
                      onClick={() => requestMentorship(profile)}
                    >
                      {connection
                        ? "Conexão existente"
                        : !canMentor
                          ? "Indisponível"
                          : busyId === profile.id
                            ? "Enviando…"
                            : "Pedir mentoria"}
                    </button>
                  </div>
                </article>
              );
            })}
        </div>
      )}
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

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 12 }}>Minhas mentorias e sessões</h2>
        {mentorConnections.length === 0 && meetings.length === 0 ? (
          <p className="startup-state">
            Nenhuma mentoria ou sessão real encontrada.
          </p>
        ) : (
          <div className="startup-grid">
            {mentorConnections.map((connection) => (
              <article className="startup-profile-card" key={connection.id}>
                <h2>{connection.investor?.name || "Mentor"}</h2>
                <p className="startup-profile-card__meta">
                  Conexão: {connection.status}
                </p>
              </article>
            ))}
            {meetings.map((meeting) => (
              <article className="startup-profile-card" key={meeting.id}>
                <h2>{meeting.title}</h2>
                <p className="startup-profile-card__meta">
                  {new Date(meeting.startsAt).toLocaleString("pt-BR")} ·{" "}
                  {meeting.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
