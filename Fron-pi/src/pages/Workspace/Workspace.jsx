import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, token } from "../../lib/api";
import "./Workspace.css";
const states = {
  PENDING: "Aguardando análise/resposta",
  APPROVED: "Aprovado",
  REJECTED: "Reprovado",
  ACCEPTED: "Conectados",
  DECLINED: "Recusado",
  CANCELLED: "Cancelado",
  CLOSED: "Encerrado",
  PROPOSED: "Proposta",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
};
const blocks = {
  clientes: "Segmentos de clientes",
  valor: "Proposta de valor",
  canais: "Canais",
  relacionamento: "Relacionamento",
  receitas: "Fontes de receita",
  recursos: "Recursos principais",
  atividades: "Atividades principais",
  parcerias: "Parcerias",
  custos: "Estrutura de custos",
};
export default function Workspace() {
  const navigate = useNavigate(),
    [params] = useSearchParams(),
    kind = params.get("kind"),
    id = params.get("id");
  const [me, setMe] = useState(null),
    [detail, setDetail] = useState(null),
    [connections, setConnections] = useState([]),
    [meetings, setMeetings] = useState([]),
    [notifications, setNotifications] = useState([]),
    [pending, setPending] = useState(null),
    [metrics, setMetrics] = useState(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null),
    [messages, setMessages] = useState([]),
    [page, setPage] = useState(1),
    [messagePage, setMessagePage] = useState(1);
  const load = useCallback(async () => {
    const u = await api("/auth/me");
    setMe(u);
    const [c, m, n] = await Promise.all([
      api(`/connections?page=${page}`),
      api(`/meetings?page=${page}`),
      api(`/notifications?page=${page}`),
    ]);
    setConnections(c.items);
    setMeetings(m.items);
    setNotifications(n.items);
    if (u.role === "ADMIN") {
      const [p, k] = await Promise.all([
        api(`/admin/profiles?page=${page}`),
        api("/admin/metrics"),
      ]);
      setPending(p);
      setMetrics(k);
    }
  }, [page]);
  useEffect(() => {
    if (!token()) {
      navigate("/login");
      return;
    }
    // load awaits the API before updating state; this effect synchronizes remote data.
    // oxlint-disable-next-line react/set-state-in-effect
    load().catch((e) => setError(e.message));
  }, [load, navigate]);
  useEffect(() => {
    if (id && ["startups", "investors"].includes(kind))
      api(`/${kind}/${id}`)
        .then(setDetail)
        .catch((e) => setError(e.message));
  }, [kind, id]);
  async function chat(cid, p = 1) {
    const d = await api(`/connections/${cid}/messages?page=${p}`);
    setSelected(cid);
    setMessagePage(p);
    setMessages([...d.items].reverse());
  }
  async function act(fn) {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await fn();
      await load();
      setNotice("Operação concluída.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function profile(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      startup = !!me.startup;
    const body = {
      city: f.get("city"),
      ...(f.get("state") ? { state: f.get("state").toUpperCase() } : {}),
      [startup ? "description" : "bio"]: f.get("description"),
    };
    if (startup) {
      body.needs = f.getAll("needs");
      body.pitchUrl = f.get("pitchUrl");
      body.website = f.get("website");
      body.materialsPublic = f.get("materialsPublic") === "on";
      body.canvas = Object.fromEntries(
        Object.keys(blocks).map((k) => [k, f.get(k)]),
      );
    }
    await act(() => api("/profile", { method: "PATCH", body }));
  }
  async function invite(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await act(() =>
      api("/connections", {
        method: "POST",
        body: {
          startupId: kind === "startups" ? detail.id : me.startup.id,
          ...(kind === "investors" ? { investorId: detail.id } : {}),
          purpose: f.get("purpose"),
          introduction: f.get("introduction"),
        },
      }),
    );
  }
  const own = me?.startup || me?.investor;
  return (
    <main className="nx-workspace">
      <header>
        <Link to="/feed">← Explorar perfis</Link>
        <h1>Minha área Nexhub</h1>
        <p>{me?.name}</p>
        <nav>
          <a href="#perfil">Perfil</a>
          <a href="#conexoes">Conexões e mensagens</a>
          <a href="#agenda">Agenda</a>
          <a href="#avisos">Notificações</a>
          {pending && <a href="#admin">Administração</a>}
        </nav>
      </header>
      {error && (
        <p role="alert" className="nx-alert">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {!me && <p>Carregando…</p>}
      {detail && detail.id === id && (
        <section>
          <h2>{detail.name}</h2>
          {detail.isDemo && <p>Perfil fictício de demonstração.</p>}
          <p>{detail.description || detail.bio}</p>
          <p>
            {(detail.sectors || detail.interests || []).join(", ")} ·{" "}
            {detail.stage || detail.role}
          </p>
          <p>
            {detail.city} / {detail.state}
          </p>
          {detail.website && (
            <a href={detail.website} target="_blank" rel="noreferrer">
              Site
            </a>
          )}
          {detail.materials?.restricted ? (
            <p>
              Pitch e Canvas disponíveis após conexão aceita, quando não
              públicos.
            </p>
          ) : (
            detail.materials && (
              <div>
                <h3>Pitch e Canvas</h3>
                {detail.materials.pitchUrl && (
                  <a
                    href={detail.materials.pitchUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir apresentação
                  </a>
                )}
                {Object.entries(detail.materials.canvas || {}).map(([k, v]) => (
                  <p key={k}>
                    <strong>{blocks[k] || k}: </strong>
                    {v}
                  </p>
                ))}
              </div>
            )
          )}
          {me &&
            ((kind === "startups" && me.investor) ||
              (kind === "investors" && me.startup)) && (
              <form onSubmit={invite}>
                <h3>Solicitar conexão</h3>
                <label>
                  Finalidade
                  <select name="purpose">
                    <option value="INVESTMENT">Investimento</option>
                    <option value="MENTORSHIP">Mentoria</option>
                  </select>
                </label>
                <label>
                  Apresentação
                  <textarea
                    name="introduction"
                    minLength={10}
                    maxLength={500}
                    required
                  />
                </label>
                <button disabled={busy}>Enviar convite</button>
                <p>A conexão só fica ativa após a outra pessoa aceitar.</p>
              </form>
            )}
        </section>
      )}
      {own && (
        <section id="perfil">
          <h2>Meu perfil</h2>
          <p>Status: {states[own.status]}</p>
          {own.moderationReason && (
            <p>Última análise: {own.moderationReason}</p>
          )}
          <p>
            Ao salvar, o perfil volta para análise. A apresentação deve ter pelo
            menos 50 caracteres.
          </p>
          <form key={own.updatedAt} onSubmit={profile}>
            <label>
              Apresentação
              <textarea
                name="description"
                defaultValue={own.description || own.bio}
                minLength={50}
                maxLength={2000}
                required
              />
            </label>
            <div className="nx-form-row">
              <label>
                Cidade
                <input name="city" defaultValue={own.city} maxLength={120} />
              </label>
              <label>
                UF
                <input
                  name="state"
                  defaultValue={own.state}
                  maxLength={2}
                  pattern="[A-Za-z]{2}"
                />
              </label>
            </div>
            {me.startup && (
              <>
                <fieldset>
                  <legend>O que a startup precisa?</legend>
                  {[
                    "INVESTMENT",
                    "Estratégia",
                    "Tecnologia",
                    "Marketing",
                    "Finanças",
                    "Captação",
                    "Operações",
                  ].map((n) => (
                    <label key={n}>
                      <input
                        type="checkbox"
                        name="needs"
                        value={n}
                        defaultChecked={own.needs.includes(n)}
                      />
                      {n === "INVESTMENT" ? "Investimento" : n}
                    </label>
                  ))}
                </fieldset>
                <label>
                  Site HTTPS
                  <input
                    type="url"
                    name="website"
                    defaultValue={own.website || ""}
                  />
                </label>
                <label>
                  Link HTTPS do Pitch
                  <input
                    type="url"
                    name="pitchUrl"
                    defaultValue={own.pitchUrl || ""}
                  />
                </label>
                <label>
                  <input
                    name="materialsPublic"
                    type="checkbox"
                    defaultChecked={own.materialsPublic}
                  />
                  Tornar Pitch e Canvas visíveis a todos os usuários
                  autenticados
                </label>
                <h3>Business Model Canvas</h3>
                <div className="nx-canvas">
                  {Object.entries(blocks).map(([k, label]) => (
                    <label key={k}>
                      {label}
                      <textarea
                        name={k}
                        maxLength={3000}
                        defaultValue={own.canvas?.[k] || ""}
                      />
                    </label>
                  ))}
                </div>
              </>
            )}
            <button disabled={busy}>Salvar e enviar para análise</button>
          </form>
        </section>
      )}
      <section id="conexoes">
        <h2>Conexões e mensagens</h2>
        <button disabled={busy} onClick={() => act(load)}>
          Atualizar
        </button>
        {!connections.length && <p>Nenhuma conexão nesta página.</p>}
        {connections.map((c) => (
          <article key={c.id}>
            <h3>
              {c.startup.name} ↔ {c.investor.name}
            </h3>
            <p>
              {states[c.status]} ·{" "}
              {c.purpose === "INVESTMENT" ? "Investimento" : "Mentoria"}
            </p>
            <p>{c.introduction}</p>
            {c.status === "PENDING" &&
              (c.requestedBy === me?.id ? (
                <button
                  disabled={busy}
                  onClick={() =>
                    act(() =>
                      api("/connections/" + c.id, {
                        method: "PATCH",
                        body: { action: "cancel" },
                      }),
                    )
                  }
                >
                  Cancelar convite
                </button>
              ) : (
                <>
                  <button
                    disabled={busy}
                    onClick={() =>
                      act(() =>
                        api("/connections/" + c.id, {
                          method: "PATCH",
                          body: { action: "accept" },
                        }),
                      )
                    }
                  >
                    Aceitar
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      act(() =>
                        api("/connections/" + c.id, {
                          method: "PATCH",
                          body: { action: "decline" },
                        }),
                      )
                    }
                  >
                    Recusar
                  </button>
                </>
              ))}
            {c.status === "ACCEPTED" && (
              <button
                disabled={busy}
                onClick={() =>
                  act(() =>
                    api("/connections/" + c.id, {
                      method: "PATCH",
                      body: { action: "close" },
                    }),
                  )
                }
              >
                Encerrar conexão
              </button>
            )}
            <button disabled={busy} onClick={() => act(() => chat(c.id))}>
              Abrir conversa
            </button>
          </article>
        ))}
        {selected && (
          <div className="nx-conversation">
            <h3>Conversa selecionada</h3>
            <button
              disabled={busy}
              onClick={() => act(() => chat(selected, messagePage))}
            >
              Atualizar mensagens
            </button>
            <ol>
              {messages.map((m) => (
                <li key={m.id}>
                  <strong>
                    {m.senderId === me?.id ? "Você" : "Outra pessoa"}:
                  </strong>{" "}
                  {m.text}
                  <small>
                    {" "}
                    {new Date(m.createdAt).toLocaleString("pt-BR")}
                  </small>
                </li>
              ))}
            </ol>
            <button
              disabled={busy || messagePage === 1}
              onClick={() => act(() => chat(selected, messagePage - 1))}
            >
              Mais recentes
            </button>
            <button
              disabled={busy || messages.length < 20}
              onClick={() => act(() => chat(selected, messagePage + 1))}
            >
              Mais antigas
            </button>
            {connections.find((c) => c.id === selected)?.status ===
              "ACCEPTED" && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const text = new FormData(form).get("text");
                    act(async () => {
                      await api(`/connections/${selected}/messages`, {
                        method: "POST",
                        body: { text, clientId: crypto.randomUUID() },
                      });
                      form.reset();
                      await chat(selected);
                    });
                  }}
                >
                  <label>
                    Mensagem
                    <textarea name="text" required maxLength={2000} />
                  </label>
                  <button disabled={busy}>Enviar</button>
                </form>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    act(() =>
                      api(`/connections/${selected}/meetings`, {
                        method: "POST",
                        body: {
                          title: f.get("title"),
                          startsAt: new Date(f.get("startsAt")).toISOString(),
                          duration: Number(f.get("duration")),
                          timezone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                          location: f.get("location"),
                        },
                      }),
                    );
                  }}
                >
                  <h3>Propor reunião</h3>
                  <label>
                    Título
                    <input
                      name="title"
                      minLength={3}
                      maxLength={120}
                      required
                    />
                  </label>
                  <label>
                    Data e hora (
                    {Intl.DateTimeFormat().resolvedOptions().timeZone})
                    <input type="datetime-local" name="startsAt" required />
                  </label>
                  <label>
                    Duração
                    <select name="duration">
                      {[15, 30, 45, 60, 90].map((n) => (
                        <option key={n} value={n}>
                          {n} minutos
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Local ou link
                    <input
                      name="location"
                      minLength={5}
                      maxLength={2048}
                      required
                    />
                  </label>
                  <button disabled={busy}>Enviar proposta</button>
                </form>
              </>
            )}
          </div>
        )}
      </section>
      <section id="agenda">
        <h2>Agenda</h2>
        {!meetings.length && <p>Nenhuma reunião nesta página.</p>}
        {meetings.map((m) => (
          <article key={m.id}>
            <h3>{m.title}</h3>
            <p>
              {new Date(m.startsAt).toLocaleString("pt-BR")} —{" "}
              {states[m.status]}
            </p>
            <p>{m.location}</p>
            {m.status === "PROPOSED" && m.organizerId !== me?.id && (
              <button
                disabled={busy}
                onClick={() =>
                  act(() =>
                    api("/meetings/" + m.id, {
                      method: "PATCH",
                      body: { action: "confirm" },
                    }),
                  )
                }
              >
                Confirmar
              </button>
            )}
            {m.status === "CONFIRMED" &&
              m.organizerId === me?.id &&
              new Date(m.endsAt) < new Date() && (
                <button
                  disabled={busy}
                  onClick={() =>
                    act(() =>
                      api("/meetings/" + m.id, {
                        method: "PATCH",
                        body: { action: "complete" },
                      }),
                    )
                  }
                >
                  Marcar concluída
                </button>
              )}
            {["PROPOSED", "CONFIRMED"].includes(m.status) && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const reason = new FormData(e.currentTarget).get("reason");
                  act(() =>
                    api("/meetings/" + m.id, {
                      method: "PATCH",
                      body: { action: "cancel", reason },
                    }),
                  );
                }}
              >
                <label>
                  Motivo do cancelamento
                  <input name="reason" minLength={10} required />
                </label>
                <button disabled={busy}>Cancelar reunião</button>
              </form>
            )}
          </article>
        ))}
      </section>
      <section id="avisos">
        <h2>Notificações</h2>
        {notifications.map((n) => (
          <p key={n.id}>
            {{
              CONNECTION_REQUEST: "Novo convite de conexão",
              CONNECTION_ACCEPTED: "Conexão aceita",
              MESSAGE: "Nova mensagem",
              MEETING_PROPOSED: "Nova proposta de reunião",
              MEETING_CONFIRMED: "Reunião confirmada",
              PROFILE_APPROVED: "Perfil aprovado",
              PROFILE_REJECTED: "Perfil reprovado",
            }[n.type] || "Atualização em conexão, perfil ou agenda"}{" "}
            · {new Date(n.createdAt).toLocaleString("pt-BR")}{" "}
            {!n.read && (
              <button
                disabled={busy}
                onClick={() =>
                  act(() => api("/notifications/" + n.id, { method: "PATCH" }))
                }
              >
                Marcar como lida
              </button>
            )}
          </p>
        ))}
      </section>
      {pending && (
        <section id="admin">
          <h2>Administração</h2>
          {metrics && (
            <p>
              Matches: {metrics.matches} · Conversas: {metrics.conversations} ·
              Reuniões confirmadas/concluídas: {metrics.meetings}
            </p>
          )}
          {[
            ["startup", pending.startups],
            ["investor", pending.investors],
          ].flatMap(([k, rows]) =>
            rows.map((p) => (
              <article key={p.id}>
                <h3>{p.name}</h3>
                <p>
                  {p.description ||
                    p.bio ||
                    "Apresentação ainda não preenchida."}
                </p>
                <Link
                  to={`/painel?kind=${k === "startup" ? "startups" : "investors"}&id=${p.id}`}
                >
                  Inspecionar perfil
                </Link>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    act(() =>
                      api(`/admin/profiles/${k}/${p.id}`, {
                        method: "PATCH",
                        body: {
                          status: f.get("status"),
                          reason: f.get("reason"),
                        },
                      }),
                    );
                  }}
                >
                  <label>
                    Decisão
                    <select name="status">
                      <option value="APPROVED">Aprovar</option>
                      <option value="REJECTED">Reprovar</option>
                    </select>
                  </label>
                  <label>
                    Justificativa
                    <input
                      name="reason"
                      minLength={10}
                      maxLength={1000}
                      required
                    />
                  </label>
                  <button disabled={busy}>Registrar análise</button>
                </form>
              </article>
            )),
          )}
        </section>
      )}
      <footer>
        <p>Página {page} das listas de conexões, agenda, avisos e moderação.</p>
        <button
          disabled={page === 1 || busy}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </button>
        <button
          disabled={
            busy ||
            (connections.length < 20 &&
              meetings.length < 20 &&
              notifications.length < 20 &&
              (!pending ||
                (pending.startups.length < 20 &&
                  pending.investors.length < 20)))
          }
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </button>
      </footer>
    </main>
  );
}
