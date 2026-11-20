import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  Send,
  History,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";
import "./Alia.css";
const prompts = {
  diagnostico:
    "Minha startup está começando. Como posso validar se o problema do cliente é relevante?",
  pitch:
    "Como organizar um pitch convincente sem inventar resultados que ainda não temos?",
  modelo:
    "Como testar o preço de uma assinatura e descobrir se nossos clientes pagariam?",
  solucao:
    "Como reduzir o escopo do MVP e medir se as pessoas conseguem usar o produto?",
  mercado:
    "Como identificar concorrentes e alternativas sem inventar números de mercado?",
  plano30:
    "Preciso de um plano de 30 dias para validar nosso produto com poucos recursos.",
};
function Content({ me }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [saving, setSaving] = useState(false);
  const [topic, setTopic] = useState("diagnostico"),
    [mode, setMode] = useState("local"),
    [message, setMessage] = useState(""),
    [useProfile, setUseProfile] = useState(false),
    [selected, setSelected] = useState(null);
  async function refresh() {
    const current = await api("/alia/me");
    setData(current);
    return current;
  }
  useEffect(() => {
    let alive = true;
    api("/alia/me")
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);
  async function preference(key, value) {
    setSaving(true);
    setError("");
    try {
      const p = await api("/preferences/ai", {
        method: "PATCH",
        body: { [key]: value },
      });
      setData((d) => ({ ...d, preference: p }));
      if (key === "profileAnalysisEnabled" && !value) setUseProfile(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await api("/alia/analyze", {
        method: "POST",
        body: { message, topic, mode, useProfile },
      });
      setSelected(result);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function clearHistory() {
    if (
      !window.confirm(
        "Apagar suas perguntas e respostas salvas? Os contadores diários serão preservados.",
      )
    )
      return;
    setSaving(true);
    try {
      await api("/alia/history", { method: "DELETE" });
      setSelected(null);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  const result = selected?.result;
  return (
    <div className="alia-page">
      <header className="alia-hero">
        <div>
          <span className="alia-eyebrow">
            <Sparkles size={16} /> A.L.I.A · SEU PRÓXIMO PASSO
          </span>
          <h1>Da ideia ao próximo teste.</h1>
          <p>
            Organize dúvidas, encontre orientações e transforme hipóteses em
            ações que você pode medir.
          </p>
        </div>
        <span className="alia-badge">
          {mode === "local"
            ? "Busca local · sem API externa"
            : "Claude · IA generativa"}
        </span>
      </header>
      {error && (
        <div className="alia-alert" role="alert">
          {error}
        </div>
      )}
      {!data ? (
        <p role="status">
          {error
            ? "Não foi possível carregar a A.L.I.A. Atualize a página para tentar novamente."
            : "Carregando a A.L.I.A…"}
        </p>
      ) : (
        <div className="alia-layout">
          <div>
            <form className="alia-card" onSubmit={submit}>
              <h2>O que vamos trabalhar hoje?</h2>
              <div className="alia-topics">
                {Object.entries(data.topics).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={topic === key}
                    onClick={() => setTopic(key)}
                    disabled={busy}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="alia-field">
                Modo de análise
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  disabled={busy}
                >
                  <option value="local">
                    Local — orientações por similaridade de texto
                  </option>
                  <option value="claude" disabled={!data.claudeConfigured}>
                    Claude —{" "}
                    {data.claudeConfigured
                      ? `${data.remainingToday} análises disponíveis hoje`
                      : "aguardando configuração"}
                  </option>
                </select>
              </label>
              <label className="alia-field">
                Conte o seu desafio
                <textarea
                  rows={5}
                  minLength={15}
                  maxLength={4000}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Qual é seu público, o problema e o que você já tentou?"
                  disabled={busy}
                />
              </label>
              <div className="alia-form-meta">
                <button
                  type="button"
                  className="alia-link"
                  onClick={() => setMessage(prompts[topic])}
                  disabled={busy}
                >
                  Usar exemplo deste tema <ArrowUpRight size={14} />
                </button>
                <small>{message.length}/4000</small>
              </div>
              {me.startup && (
                <label className="alia-check">
                  <input
                    type="checkbox"
                    checked={useProfile}
                    disabled={!data.preference.profileAnalysisEnabled || busy}
                    onChange={(e) => setUseProfile(e.target.checked)}
                  />
                  Incluir nome, descrição, setores, estágio e necessidades da
                  minha startup
                </label>
              )}
              <p className="alia-muted">
                Cada análise é independente. Não envie senhas, dados de clientes
                ou informações confidenciais.{" "}
                {mode === "local"
                  ? "O modo local não envia dados à Anthropic."
                  : "A pergunta e o perfil selecionado serão enviados à Anthropic."}
              </p>
              <button
                className="alia-primary"
                type="submit"
                disabled={
                  busy ||
                  saving ||
                  message.trim().length < 15 ||
                  (mode === "claude" &&
                    (!data.preference.externalProviderConsent ||
                      data.remainingToday === 0))
                }
              >
                {busy ? (
                  "Analisando seu desafio…"
                ) : (
                  <>
                    <Send size={17} /> Analisar desafio
                  </>
                )}
              </button>
            </form>
            {result && (
              <section className="alia-card alia-result" aria-live="polite">
                <div className="alia-result-heading">
                  <h2>Seu roteiro de ação</h2>
                  <span className="alia-badge">
                    {selected.mode === "local"
                      ? "Busca TF-IDF"
                      : "Gerado por Claude"}
                  </span>
                </div>
                <p className="alia-note"><strong>Sua pergunta:</strong> {selected.question}</p>
                <p>{result.answer.summary}</p>
                <div className="alia-actions">
                  {result.answer.actions.map((a, i) => (
                    <article key={i}>
                      <span className="alia-step">{i + 1}</span>
                      <div>
                        <h3>{a.title}</h3>
                        <p>{a.detail}</p>
                        <p className="alia-metric">
                          <CheckCircle2 size={16} />
                          <span>{a.metric}</span>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <h3>Informações para aprofundar</h3>
                <ul>
                  {result.answer.missingInformation.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                <div className="alia-note">{result.answer.limitations}</div>
                <details>
                  <summary>Como esta análise foi produzida</summary>
                  <p>
                    Modelo: {selected.model} · Versão: {selected.promptVersion}{" "}
                    · Tempo: {(selected.durationMs / 1000).toFixed(1)} s
                  </p>
                  <p>
                    Perfil incluído: {result.usedProfile ? "sim" : "não"}. Base
                    editorial: orientações originais da equipe. Não são
                    evidências de mercado nem fontes verificadas sobre sua
                    empresa.
                  </p>
                  {result.sources.map((s) => (
                    <div key={s.id}>
                      <strong>{s.title}</strong>
                      <p>{s.text}</p>
                      <small>
                        Similaridade lexical: {Math.round(s.score * 100)}%. Não
                        representa chance de sucesso.
                      </small>
                    </div>
                  ))}
                </details>
              </section>
            )}
          </div>
          <aside className="alia-side">
            <section className="alia-card">
              <BookOpen size={22} />
              <h2>Você no controle</h2>
              <p>
                O modo local compara seu texto com 12 orientações curadas. O
                Claude pode aprofundar a análise, se estiver configurado.
              </p>
              <label className="alia-check">
                <input
                  type="checkbox"
                  checked={data.preference.externalProviderConsent}
                  disabled={busy || saving}
                  onChange={(e) =>
                    preference("externalProviderConsent", e.target.checked)
                  }
                />
                Autorizo enviar minhas perguntas à Anthropic quando escolher
                Claude.
              </label>
              <label className="alia-check">
                <input
                  type="checkbox"
                  checked={data.preference.profileAnalysisEnabled}
                  disabled={busy || saving}
                  onChange={(e) =>
                    preference("profileAnalysisEnabled", e.target.checked)
                  }
                />
                Permito incluir os campos do meu perfil nas análises.
              </label>
              <p className="alia-muted">
                Perguntas e respostas ficam no seu histórico privado. Você pode
                apagá-las abaixo. Recomendações precisam de validação humana.
              </p>
            </section>
            <section className="alia-card">
              <h2>
                <History size={19} /> Análises recentes
              </h2>
              {!data.history.length ? (
                <p className="alia-muted">
                  Sua primeira análise aparecerá aqui.
                </p>
              ) : (
                <div className="alia-history">
                  {data.history.map((a) => (
                    <button
                      key={a.id}
                      aria-pressed={selected?.id === a.id}
                      onClick={() => setSelected(a)}
                      disabled={busy}
                    >
                      <strong>{data.topics[a.topic]}</strong>
                      <span>{a.question}</span>
                      <small>
                        {new Date(a.createdAt).toLocaleString("pt-BR")} ·{" "}
                        {a.mode === "local" ? "Local" : "Claude"}
                      </small>
                    </button>
                  ))}
                </div>
              )}
              <button
                className="alia-link"
                type="button"
                onClick={clearHistory}
                disabled={busy || saving || !data.history.length}
              >
                Apagar histórico
              </button>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
export default function Alia() {
  return <AreaShell>{(me) => <Content me={me} />}</AreaShell>;
}
