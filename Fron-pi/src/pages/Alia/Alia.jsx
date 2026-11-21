import { useEffect, useRef, useState } from "react";
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
  diagnostico: [
    "Minha startup está começando. Como posso validar se o problema do cliente é relevante?",
    "Recebemos elogios sobre a ideia, mas ninguém comprou. Que evidências devemos buscar antes de investir mais?",
    "Temos muitos cadastros e poucos usuários que voltam. Como investigar a causa e escolher uma métrica útil?",
    "Quero entrevistar possíveis clientes sem induzir respostas positivas. Que perguntas devo fazer?",
    "Nossa equipe discorda sobre o público prioritário. Como testar qual segmento tem a necessidade mais urgente?",
    "Quais hipóteses do nosso negócio deveríamos validar primeiro com pouco tempo e orçamento?",
  ],
  pitch: [
    "Como organizar um pitch convincente sem inventar resultados que ainda não temos?",
    "Tenho dois minutos para apresentar minha startup. Como priorizar problema, solução e pedido?",
    "Ainda não temos clientes pagantes. Como apresentar nossas evidências com transparência em um pitch?",
    "Como adaptar o pitch para um mentor, em vez de um investidor?",
    "Meu pitch descreve muitas funcionalidades. Como explicar melhor o benefício para o cliente?",
    "Como preparar respostas honestas para perguntas sobre concorrência, receita e riscos da startup?",
  ],
  modelo: [
    "Como testar o preço de uma assinatura e descobrir se nossos clientes pagariam?",
    "Estamos entre cobrar por assinatura ou por uso. Que experimento ajudaria a comparar essas opções?",
    "Como identificar os principais custos por cliente antes de definir nosso preço?",
    "Temos usuários gratuitos interessados. Como testar uma oferta paga sem confundir interesse com intenção real de compra?",
    "Como comparar canais de aquisição com orçamento pequeno e medir o custo por cliente?",
    "Nossa receita ainda é irregular. Quais dados precisamos coletar para avaliar se o modelo pode se sustentar?",
  ],
  solucao: [
    "Como reduzir o escopo do MVP e medir se as pessoas conseguem usar o produto?",
    "Os usuários precisam de ajuda para concluir a tarefa principal. Como organizar um teste de usabilidade?",
    "Recebemos pedidos de muitas funcionalidades. Como decidir o que construir primeiro?",
    "Como testar o valor da solução com um protótipo antes de desenvolver o produto completo?",
    "Quero tornar nosso produto mais acessível para pessoas com pouca familiaridade digital. Como validar as melhorias?",
    "Os usuários abandonam o cadastro. Como investigar o problema sem assumir que a solução é mudar o design?",
  ],
  mercado: [
    "Como identificar concorrentes e alternativas sem inventar números de mercado?",
    "Nossos clientes usam planilhas e processos manuais. Como comparar essas alternativas com nossa proposta?",
    "Como escolher um nicho inicial sem tentar atender todos os públicos ao mesmo tempo?",
    "Que fontes e premissas devo registrar para estimar o tamanho do mercado com transparência?",
    "Como investigar se o diferencial que anunciamos realmente importa para os clientes?",
    "Queremos atuar em outra região. Que hipóteses de mercado precisamos validar antes de expandir?",
  ],
  plano30: [
    "Preciso de um plano de 30 dias para validar nosso produto com poucos recursos.",
    "Somos duas pessoas com cinco horas semanais cada. Como planejar um mês de entrevistas e testes de protótipo?",
    "Quero testar uma oferta paga nos próximos 30 dias. Como dividir as etapas e definir critérios de decisão?",
    "Nosso MVP já existe, mas a retenção é baixa. Como organizar quatro semanas de investigação e experimentos?",
    "Temos várias ideias e nenhum foco. Como montar um plano mensal com responsáveis, prioridades e entregas?",
    "Como planejar 30 dias para preparar um pitch baseado em evidências, incluindo o tempo necessário para coletá-las?",
  ],
};
function Content({ me }) {
  const examplePositions = useRef({});
  function useExample() {
    const choices = prompts[topic];
    if (!choices?.length) return;
    const index =
      examplePositions.current[topic] ??
      Math.floor(Math.random() * choices.length);
    setMessage(choices[index]);
    examplePositions.current[topic] = (index + 1) % choices.length;
  }
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [saving, setSaving] = useState(false);
  const [topic, setTopic] = useState("diagnostico"),
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
        body: { message, topic, mode: "gemini", useProfile },
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
        <span className="alia-badge">Gemini · IA generativa</span>
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
              {!data.geminiConfigured && (
                <p role="status" className="alia-note">
                  A geração com Gemini aguarda ativação.
                </p>
              )}
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
              <p className="alia-muted">
                Gemini · {data.remainingToday} análises disponíveis hoje
              </p>
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
                  onClick={useExample}
                  disabled={busy}
                >
                  Outro exemplo do tema · sem gastar análise{" "}
                  <ArrowUpRight size={14} />
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
                ou informações confidenciais. A pergunta e o perfil selecionado
                serão enviados ao Google.
              </p>
              <button
                className="alia-primary"
                type="submit"
                disabled={
                  busy ||
                  saving ||
                  message.trim().length < 15 ||
                  !data.geminiConfigured ||
                  !data.preference.geminiConsent ||
                  data.remainingToday === 0
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
                      : selected.mode === "claude"
                        ? "Claude (histórico)"
                        : "Gerado por Gemini"}
                  </span>
                </div>
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
                O Gemini gera uma análise a partir do seu desafio e das
                informações que você autorizar.
              </p>
              <label className="alia-check">
                <input
                  type="checkbox"
                  checked={data.preference.geminiConsent}
                  disabled={busy || saving}
                  onChange={(e) =>
                    preference("geminiConsent", e.target.checked)
                  }
                />
                Autorizo enviar minhas perguntas ao Google quando escolher
                Gemini.
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
                        {a.mode === "local"
                          ? "Local"
                          : a.mode === "claude"
                            ? "Claude (histórico)"
                            : "Gemini"}
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
