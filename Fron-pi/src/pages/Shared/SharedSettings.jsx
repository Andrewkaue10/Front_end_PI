import { useState } from "react";
import { Link } from "react-router-dom";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";
import "./SharedPages.css";

export default function SharedSettings() {
  return <AreaShell>{(me) => <SettingsForm key={me.id} me={me} />}</AreaShell>;
}

function SettingsForm({ me }) {
  const startup = me.role === "STARTUP";
  const profile = startup ? me.startup : me.investor;
  const [form, setForm] = useState(
    startup
      ? {
          description: profile?.description || "",
          city: profile?.city || "",
          state: profile?.state || "",
          needs: profile?.needs || [],
          website: profile?.website || "",
          pitchUrl: profile?.pitchUrl || "",
          materialsPublic: Boolean(profile?.materialsPublic),
        }
      : {
          bio: profile?.bio || "",
          city: profile?.city || "",
          state: profile?.state || "",
          stages: profile?.stages || [],
        },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const body = startup
        ? {
            description: form.description,
            city: form.city,
            state: form.state,
            needs: form.needs,
            website: form.website,
            pitchUrl: form.pitchUrl,
            materialsPublic: form.materialsPublic,
          }
        : {
            bio: form.bio,
            city: form.city,
            state: form.state,
            stages: form.stages,
          };
      await api("/profile", { method: "PATCH", body });
      setNotice(
        "Alterações enviadas para análise. O perfil volta ao estado PENDING.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="area-page shared-settings">
      <h1>Configurações</h1>
      <p className="area-page__lead">
        Dados da conta e campos persistentes do perfil público.
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
      <div className="shared-settings__grid">
        <form className="shared-settings__card area-form" onSubmit={save}>
          <h2>{startup ? "Perfil da startup" : "Perfil profissional"}</h2>
          <p className="shared-settings__status">
            Salvar alterações pode reabrir o perfil para análise.
          </p>
          <label>
            Nome
            <input value={me.name} disabled />
          </label>
          <label>
            E-mail
            <input value={me.email} disabled />
          </label>
          {startup ? (
            <>
              <label>
                Descrição
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  maxLength={2000}
                />
              </label>
              <label>
                Cidade
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  maxLength={120}
                />
              </label>
              <label>
                Estado
                <select
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                >
                  <option value="">Não informado</option>
                  {"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO"
                    .split(" ")
                    .map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
              </label>
              <fieldset>
                <legend>Necessidades</legend>
                {[
                  "INVESTMENT",
                  "Estratégia",
                  "Tecnologia",
                  "Marketing",
                  "Finanças",
                  "Captação",
                  "Operações",
                ].map((need) => (
                  <label key={need}>
                    <input
                      type="checkbox"
                      checked={form.needs.includes(need)}
                      onChange={(e) =>
                        update(
                          "needs",
                          e.target.checked
                            ? [...form.needs, need]
                            : form.needs.filter((value) => value !== need),
                        )
                      }
                    />{" "}
                    {need}
                  </label>
                ))}
              </fieldset>
              <label>
                Site
                <input
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://"
                />
              </label>
              <label>
                Apresentação (URL)
                <input
                  value={form.pitchUrl}
                  onChange={(e) => update("pitchUrl", e.target.value)}
                  placeholder="https://"
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.materialsPublic}
                  onChange={(e) => update("materialsPublic", e.target.checked)}
                />{" "}
                Apresentação pública
              </label>
            </>
          ) : (
            <>
              <label>
                Apresentação
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  maxLength={2000}
                />
              </label>
              <label>
                Cidade
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  maxLength={120}
                />
              </label>
              <label>
                Estado
                <select
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                >
                  <option value="">Não informado</option>
                  {"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO"
                    .split(" ")
                    .map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
              </label>
            </>
          )}
          <button className="area-button" disabled={saving} type="submit">
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </form>

        <aside className="shared-settings__aside shared-settings__card">
          <h2>Conta</h2>
          <dl>
            <div>
              <dt>Papel</dt>
              <dd>{me.role}</dd>
            </div>
            <div>
              <dt>Status do perfil</dt>
              <dd>{profile?.status || "Não informado"}</dd>
            </div>
          </dl>
          <Link
            className="area-button secondary shared-settings__password"
            to="/esqueci-senha"
          >
            Alterar senha por e-mail
          </Link>
          <p className="shared-settings__status">
            Alteração de nome, e-mail e telefone não está disponível nesta
            versão.
          </p>
        </aside>
      </div>
    </div>
  );
}
