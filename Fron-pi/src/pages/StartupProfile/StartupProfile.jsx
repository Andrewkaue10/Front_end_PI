import { profileStatus } from "../../lib/profile";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../lib/api";
import "../MissingScreens.css";

const emptyMetric = { name: "", value: "", unit: "", period: "" };

export default function StartupProfile() {
  const { me } = useOutletContext();
  const startup = me.startup || {};
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState({
    name: startup.name || "",
    description: startup.description || "",
    city: startup.city || "",
    state: startup.state || "",
    website: startup.website || "",
    pitchUrl: startup.pitchUrl || "",
    materialsPublic: startup.materialsPublic || false,
  });
  const [metrics, setMetrics] = useState([]);
  const [metric, setMetric] = useState(emptyMetric);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let alive = true;
    api("/startup-metrics")
      .then((data) => alive && setMetrics(data.items || []))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api("/profile", { method: "PATCH", body: form });
      setNotice("Alterações salvas. O perfil pode ser reaberto para análise.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveMetric(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/startup-metrics", {
        method: "POST",
        body: {
          name: metric.name,
          value: metric.value,
          unit: metric.unit,
          period: metric.period,
        },
      });
      const data = await api("/startup-metrics");
      setMetrics(data.items || []);
      setMetric(emptyMetric);
      setNotice("Métrica informada pela startup cadastrada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeMetric(id) {
    if (busy) return;
    setBusy(true);
    try {
      await api(`/startup-metrics/${id}`, { method: "DELETE" });
      setMetrics((current) => current.filter((item) => item.id !== id));
      setNotice("Métrica removida.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const requiredFields = [
    startup.name,
    startup.description,
    startup.sectors?.length ? startup.sectors.join(",") : null,
    startup.stage,
    startup.fundingRange,
    startup.city,
    startup.state,
  ];
  const completed = requiredFields.filter(Boolean).length;
  const completeness = requiredFields.length
    ? Math.round((completed / requiredFields.length) * 100)
    : 0;
  const missing = [
    !startup.description && "Descrição",
    !startup.sectors?.length && "Setores",
    !startup.stage && "Estágio",
    !startup.fundingRange && "Faixa de captação",
    !startup.city && "Cidade",
    !startup.state && "Estado",
  ].filter(Boolean);

  return (
    <main className="startup-page missing-page">
      <header className="missing-page__title">
        <div>
          <h1>Perfil da startup</h1>
          <p className="startup-page__lead">
            Apresente somente dados cadastrados pela startup.
          </p>
        </div>
        {startup.id && (
          <a
            className="missing-primary"
            href={`/painel?kind=startups&id=${startup.id}`}
          >
            Ver perfil público
          </a>
        )}
      </header>

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

      <div className="profile-layout">
        <section>
          <nav className="profile-tabs" aria-label="Seções do perfil">
            {[
              ["overview", "Visão geral"],
              ["team", "Equipe"],
              ["metrics", "Métricas"],
              ["documents", "Documentos"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "overview" && (
            <form className="profile-section" onSubmit={saveProfile}>
              <h2>Sobre a startup</h2>
              <div className="profile-grid">
                <label>
                  Nome
                  <input
                    value={form.name}
                    maxLength={120}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </label>
                <label>
                  Descrição
                  <textarea
                    value={form.description}
                    maxLength={2000}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </label>
                <label>
                  Cidade
                  <input
                    value={form.city}
                    maxLength={120}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </label>
                <label>
                  Estado
                  <input
                    value={form.state}
                    maxLength={2}
                    onChange={(e) =>
                      update("state", e.target.value.toUpperCase())
                    }
                  />
                </label>
                <label>
                  Site
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    placeholder="https://"
                  />
                </label>
                <label>
                  Materiais públicos
                  <select
                    value={String(form.materialsPublic)}
                    onChange={(e) =>
                      update("materialsPublic", e.target.value === "true")
                    }
                  >
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </label>
              </div>
              <div className="profile-actions">
                <button
                  className="missing-primary"
                  disabled={busy}
                  type="submit"
                >
                  {busy ? "Salvando…" : "Salvar perfil"}
                </button>
              </div>
              <small>Mantenha as informações da sua startup atualizadas.</small>
            </form>
          )}

          {tab === "team" && (
            <section className="profile-section">
              <h2>Equipe</h2>
              <div className="metric-row">
                <div>
                  <strong>{startup.ownerName || me.name}</strong>
                  <small>Responsável pela conta</small>
                </div>
              </div>
              <p>
                Não há membros adicionais cadastrados por um fluxo de equipe
                neste perfil.
              </p>
            </section>
          )}

          {tab === "metrics" && (
            <section className="profile-section">
              <h2>Métricas informadas pela startup</h2>
              {metrics.length === 0 ? (
                <p>Nenhuma métrica cadastrada.</p>
              ) : (
                <div className="metric-list">
                  {metrics.map((item) => (
                    <div className="metric-row" key={item.id}>
                      <div>
                        <strong>
                          {item.name}: {item.value} {item.unit}
                        </strong>
                        <small>
                          {item.period || "Período não informado"} ·
                          autodeclarada
                        </small>
                      </div>
                      <button
                        className="startup-filter-button"
                        onClick={() => removeMetric(item.id)}
                        disabled={busy}
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form
                className="profile-grid"
                onSubmit={saveMetric}
                style={{ marginTop: 12 }}
              >
                <label>
                  Nome
                  <input
                    value={metric.name}
                    maxLength={80}
                    onChange={(e) =>
                      setMetric({ ...metric, name: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Valor
                  <input
                    value={metric.value}
                    onChange={(e) =>
                      setMetric({ ...metric, value: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Unidade
                  <input
                    value={metric.unit}
                    maxLength={30}
                    onChange={(e) =>
                      setMetric({ ...metric, unit: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Período
                  <input
                    value={metric.period}
                    maxLength={50}
                    onChange={(e) =>
                      setMetric({ ...metric, period: e.target.value })
                    }
                  />
                </label>
                <div
                  className="profile-actions"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <button
                    className="missing-primary"
                    disabled={busy}
                    type="submit"
                  >
                    {busy ? "Salvando…" : "Adicionar métrica"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {tab === "documents" && (
            <section className="profile-section">
              <h2>Pitch e documentos</h2>
              {startup.pitchUrl ? (
                <div className="document-row">
                  <strong>Pitch</strong>
                  <a href={startup.pitchUrl} rel="noreferrer" target="_blank">
                    Abrir link
                  </a>
                </div>
              ) : (
                <p>Nenhum link de pitch cadastrado.</p>
              )}
              {startup.canvas && (
                <div className="document-row">
                  <strong>Canvas</strong>
                  <small>Dados persistidos no perfil</small>
                </div>
              )}
              <form
                className="profile-grid"
                onSubmit={saveProfile}
                style={{ marginTop: 12 }}
              >
                <label>
                  Link HTTPS do pitch
                  <input
                    type="url"
                    value={form.pitchUrl}
                    onChange={(e) => update("pitchUrl", e.target.value)}
                    placeholder="https://"
                  />
                </label>
                <div className="profile-actions" style={{ alignSelf: "end" }}>
                  <button
                    className="missing-primary"
                    disabled={busy}
                    type="submit"
                  >
                    Salvar link
                  </button>
                </div>
              </form>
            </section>
          )}
        </section>

        <aside className="missing-aside">
          <section className="missing-card">
            <h2>Perfil completo: {completeness}%</h2>
            <div
              className="completeness"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={completeness}
            >
              <span style={{ width: `${completeness}%` }} />
            </div>
            {missing.length > 0 && (
              <p>Campos ausentes: {missing.join(", ")}.</p>
            )}
          </section>
          <section className="missing-card">
            <h2>Visibilidade</h2>
            <p>Status: {profileStatus(startup.status)}</p>
            <p>Materiais públicos: {startup.materialsPublic ? "Sim" : "Não"}</p>
          </section>
          <section className="missing-card">
            <h2>Como investidores veem</h2>
            <p>{startup.description || "Descrição não informada"}</p>
            {startup.sectors?.length > 0 && <p>{startup.sectors.join(", ")}</p>}
            {startup.materialsPublic && startup.pitchUrl && (
              <a href={startup.pitchUrl} target="_blank" rel="noreferrer">
                Pitch público
              </a>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
