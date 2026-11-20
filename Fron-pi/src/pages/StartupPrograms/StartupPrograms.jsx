import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../lib/api";
import "./StartupPrograms.css";

export default function StartupPrograms() {
  const { me } = useOutletContext();
  const [items, setItems] = useState([]);
  const [saved, setSaved] = useState([]);
  const [applications, setApplications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [sort, setSort] = useState("deadline");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const limit = 12;

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
          status,
          q,
          category,
          stage,
          region,
        });
        const [catalog, own] = await Promise.all([
          api(`/programs?${params}`),
          api("/my/programs"),
        ]);
        if (!alive) return;
        setItems(catalog.items || []);
        setTotal(catalog.total || 0);
        setSaved(own.saved || []);
        setApplications(own.applications || []);
        setAlerts(own.alerts || []);
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
  }, [me, q, category, stage, region, status, sort, page]);

  async function toggle(program, kind) {
    if (busyId) return;
    setBusyId(program.id);
    setError("");
    setNotice("");
    try {
      if (kind === "save") {
        const exists = saved.includes(program.id);
        await api(`/programs/${program.id}/save`, {
          method: exists ? "DELETE" : "PUT",
        });
        setSaved((current) =>
          exists
            ? current.filter((id) => id !== program.id)
            : [...current, program.id],
        );
        setNotice(exists ? "Programa removido dos salvos." : "Programa salvo.");
      } else if (kind === "alert") {
        const exists = alerts.includes(program.id);
        await api(`/programs/${program.id}/alert`, {
          method: exists ? "DELETE" : "PUT",
        });
        setAlerts((current) =>
          exists
            ? current.filter((id) => id !== program.id)
            : [...current, program.id],
        );
        setNotice(exists ? "Alerta desativado." : "Alerta ativado.");
      } else {
        await api(`/programs/${program.id}/applications`, { method: "POST" });
        setApplications((current) => [
          ...current,
          { id: program.id, status: "SUBMITTED" },
        ]);
        setNotice("Inscrição registrada.");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  const applicationFor = (id) => applications.find((item) => item.id === id);

  return (
    <main className="startup-page startup-programs">
      <h1>Editais e programas</h1>
      <p className="startup-page__lead">
        Catálogo real de oportunidades, prazos e inscrições persistidas.
      </p>
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
      <div className="startup-toolbar startup-programs__toolbar">
        <div className="startup-toolbar__filters">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Buscar oportunidades"
          />
          <input
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            placeholder="Categoria"
          />
          <input
            value={stage}
            onChange={(e) => {
              setPage(1);
              setStage(e.target.value);
            }}
            placeholder="Estágio"
          />
          <input
            value={region}
            onChange={(e) => {
              setPage(1);
              setRegion(e.target.value);
            }}
            placeholder="Região"
          />
          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="deadline">Prazo mais próximo</option>
            <option value="newest">Mais recentes</option>
          </select>
        </div>
        <div
          className="startup-toolbar__filters"
          aria-label="Status da inscrição"
        >
          {["TODOS", "ABERTO", "EM_BREVE", "ENCERRADO"].map((value) => (
            <button
              key={value}
              className={`startup-filter-button ${status === value ? "active" : ""}`}
              onClick={() => {
                setPage(1);
                setStatus(value);
              }}
            >
              {value === "EM_BREVE"
                ? "Em breve"
                : value[0] + value.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="startup-state" role="status">
          Carregando oportunidades…
        </p>
      ) : items.length === 0 ? (
        <section className="startup-programs__empty">
          <h2>Nenhum edital publicado</h2>
          <p>
            Quando uma organização cadastrar uma oportunidade ativa, ela
            aparecerá aqui. Nenhum dado ilustrativo foi utilizado.
          </p>
        </section>
      ) : (
        <div className="startup-programs__grid">
          {items.map((program) => {
            const application = applicationFor(program.id);
            return (
              <article className="startup-program-card" key={program.id}>
                <div className="startup-program-card__top">
                  <div>
                    <span className="startup-program-card__kind">
                      {program.modality || "Modalidade não informada"}
                    </span>
                    {program.category && <span>{program.category}</span>}
                  </div>
                  <span
                    className={`startup-program-card__status ${program.status === "ABERTO" ? "open" : ""}`}
                  >
                    {program.status === "EM_BREVE"
                      ? "Em breve"
                      : program.status[0] +
                        program.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <h2>{program.title}</h2>
                <p className="startup-program-card__organization">
                  {program.organization}
                </p>
                {program.description && (
                  <p className="startup-profile-card__bio">
                    {program.description}
                  </p>
                )}
                <dl>
                  <div>
                    <dt>Abertura</dt>
                    <dd>
                      {new Date(program.applicationsOpenAt).toLocaleString(
                        "pt-BR",
                        { timeZone: program.timezone },
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Encerramento</dt>
                    <dd>
                      {new Date(program.applicationsCloseAt).toLocaleString(
                        "pt-BR",
                        { timeZone: program.timezone },
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Benefício</dt>
                    <dd>{program.benefit || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Duração</dt>
                    <dd>{program.duration || "Não informada"}</dd>
                  </div>
                  <div>
                    <dt>Estágio</dt>
                    <dd>{program.stage || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Região</dt>
                    <dd>{program.region || "Não informada"}</dd>
                  </div>
                </dl>
                {Array.isArray(program.requirements) &&
                  program.requirements.length > 0 && (
                    <div className="startup-program-card__requirements">
                      <strong>Requisitos</strong>
                      <ul>
                        {program.requirements.map((requirement) => (
                          <li key={requirement}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="startup-profile-card__actions">
                  {program.sourceUrl &&
                    /^https:\/\//i.test(program.sourceUrl) && (
                      <a
                        className="secondary"
                        href={program.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir página do edital ↗
                      </a>
                    )}
                  <button
                    className="secondary"
                    disabled={busyId === program.id}
                    onClick={() => toggle(program, "save")}
                  >
                    {saved.includes(program.id)
                      ? "Remover dos salvos"
                      : "Salvar"}
                  </button>
                  <button
                    className="secondary"
                    disabled={busyId === program.id}
                    onClick={() => toggle(program, "alert")}
                  >
                    {alerts.includes(program.id)
                      ? "Desativar alerta"
                      : "Ativar alerta"}
                  </button>
                  <button
                    disabled={
                      busyId === program.id ||
                      Boolean(application) ||
                      program.status !== "ABERTO"
                    }
                    onClick={() => toggle(program, "apply")}
                  >
                    {application
                      ? `Inscrito: ${application.status}`
                      : program.status === "ABERTO"
                        ? "Inscrever"
                        : "Inscrição indisponível"}
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
    </main>
  );
}
