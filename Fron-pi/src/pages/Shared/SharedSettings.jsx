import { useEffect, useState } from "react";
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
  const [accountName, setAccountName] = useState(me.name || "");
  const [accountPhone, setAccountPhone] = useState(me.phone || "");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    appEnabled: true,
    emailEnabled: false,
    connectionEnabled: true,
    meetingEnabled: true,
    opportunityEnabled: true,
  });
  const [aiPreferences, setAiPreferences] = useState({
    enabled: false,
    profileAnalysisEnabled: false,
  });
  const [deletionReason, setDeletionReason] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      api("/preferences/notifications").catch(() => null),
      api("/preferences/ai").catch(() => null),
    ]).then(([notifications, ai]) => {
      if (!alive) return;
      if (notifications) setNotificationPreferences(notifications);
      if (ai) setAiPreferences(ai);
    });
    return () => {
      alive = false;
    };
  }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveAccount(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await api("/account", {
        method: "PATCH",
        body: { name: accountName, phone: accountPhone },
      });
      setNotice("Dados da conta atualizados.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await api("/account/password", {
        method: "POST",
        body: passwords,
      });
      setPasswords({ currentPassword: "", newPassword: "" });
      setNotice(data.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function savePreferences() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await Promise.all([
        api("/preferences/notifications", {
          method: "PATCH",
          body: notificationPreferences,
        }),
        api("/preferences/ai", {
          method: "PATCH",
          body: aiPreferences,
        }),
      ]);
      setNotice("Preferências atualizadas.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function requestDeletion() {
    if (!window.confirm("Solicitar exclusão da conta em 30 dias? O pedido poderá ser cancelado antes da execução.")) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await api("/account/deletion", {
        method: "POST",
        body: { reason: deletionReason },
      });
      setNotice("Solicitação registrada. Exclusão agendada para daqui a 30 dias.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function cancelDeletion() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await api("/account/deletion", { method: "DELETE" });
      setNotice("Solicitação de exclusão cancelada.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
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
          <form className="area-form" onSubmit={saveAccount}>
            <label>
              Nome
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                minLength={2}
                maxLength={120}
                required
              />
            </label>
            <label>
              Telefone
              <input
                value={accountPhone}
                onChange={(e) => setAccountPhone(e.target.value)}
                minLength={10}
                maxLength={20}
                required
              />
            </label>
            <label>
              E-mail
              <input value={me.email} disabled />
            </label>
            <button className="area-button" disabled={saving} type="submit">
              Salvar conta
            </button>
          </form>

          <form
            className="area-form shared-settings__password"
            onSubmit={changePassword}
          >
            <h2>Alterar senha</h2>
            <label>
              Senha atual
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((current) => ({
                    ...current,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Nova senha
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((current) => ({
                    ...current,
                    newPassword: e.target.value,
                  }))
                }
                minLength={8}
                maxLength={72}
                required
              />
            </label>
            <button className="area-button" disabled={saving} type="submit">
              Alterar senha
            </button>
          </form>

          <section className="shared-settings__password">
            <h2>Preferências de notificações</h2>
            {[
              ["appEnabled", "Aplicativo"],
              ["emailEnabled", "E-mail"],
              ["connectionEnabled", "Conexões"],
              ["meetingEnabled", "Reuniões"],
              ["opportunityEnabled", "Oportunidades"],
            ].map(([field, label]) => (
              <label key={field}>
                <input
                  type="checkbox"
                  checked={notificationPreferences[field]}
                  onChange={(e) =>
                    setNotificationPreferences((current) => ({
                      ...current,
                      [field]: e.target.checked,
                    }))
                  }
                />{" "}
                {label}
              </label>
            ))}
            <h2>A.L.I.A.</h2>
            <label>
              <input
                type="checkbox"
                checked={aiPreferences.enabled}
                onChange={(e) =>
                  setAiPreferences((current) => ({
                    ...current,
                    enabled: e.target.checked,
                  }))
                }
              />{" "}
              Consentimento para recursos de compatibilidade
            </label>
            <label>
              <input
                type="checkbox"
                checked={aiPreferences.profileAnalysisEnabled}
                onChange={(e) =>
                  setAiPreferences((current) => ({
                    ...current,
                    profileAnalysisEnabled: e.target.checked,
                  }))
                }
              />{" "}
              Análise do perfil
            </label>
            <button
              className="area-button"
              disabled={saving}
              type="button"
              onClick={savePreferences}
            >
              Salvar preferências
            </button>
          </section>

          <section className="shared-settings__password">
            <h2>Exclusão da conta</h2>
            <label>
              Motivo opcional
              <textarea
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                maxLength={500}
              />
            </label>
            <button
              className="area-button secondary"
              disabled={saving}
              type="button"
              onClick={requestDeletion}
            >
              Solicitar exclusão
            </button>
            <button
              className="area-button secondary"
              disabled={saving}
              type="button"
              onClick={cancelDeletion}
            >
              Cancelar solicitação
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
