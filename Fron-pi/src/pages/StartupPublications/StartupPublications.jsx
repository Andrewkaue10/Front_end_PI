import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../lib/api";
import "../MissingScreens.css";

export default function StartupPublications() {
  const { me } = useOutletContext();
  const [tab, setTab] = useState("feed");
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [metricId, setMetricId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "20",
          q,
          ...(tag ? { tag } : {}),
          view: tab,
        });
        const [postData, metricData] = await Promise.all([
          api(`/posts?${params}`),
          api("/startup-metrics").catch(() => ({ items: [] })),
        ]);
        if (!alive) return;
        setPosts((postData.items || []).filter((item) => !item.isDemo));
        setMetrics(metricData.items || []);
      } catch (e) {
        if (alive) {
          setPosts([]);
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
  }, [tab, q, tag]);

  async function save(status) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(editingId ? `/posts/${editingId}` : "/posts", {
        method: editingId ? "PATCH" : "POST",
        body: {
          text: text.trim(),
          tags: tags
            .split(/[,\s]+/)
            .map((item) => item.replace(/^#/, "").trim())
            .filter(Boolean),
          metricId: metricId || undefined,
          status,
        },
      });
      setText("");
      setTags("");
      setMetricId("");
      setEditingId("");
      setNotice(status === "DRAFT" ? "Rascunho salvo." : "Publicação criada.");
      setTab(status === "DRAFT" ? "drafts" : "mine");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removePost(id) {
    if (busy) return;
    setBusy(true);
    try {
      await api(`/posts/${id}`, { method: "DELETE" });
      setPosts((current) => current.filter((post) => post.id !== id));
      setNotice("Registro removido.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function react(id, type) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api(`/posts/${id}/${type}`, { method: "POST" });
      setNotice(type === "like" ? "Curtida registrada." : "Repost registrado.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function resumeDraft(post) {
    setEditingId(post.id);
    setText(post.text || "");
    setTags((post.tags || []).join(" "));
    setMetricId(post.metric?.id || "");
    setTab("mine");
    setNotice("Rascunho carregado no compositor.");
  }

  const lastPost = posts.find((post) => post.authorId === me.startup?.id);
  const tagsFromPosts = [...new Set(posts.flatMap((post) => post.tags || []))];

  return (
    <main className="startup-page missing-page">
      <header className="missing-page__title">
        <div>
          <h1>Publicações</h1>
          <p className="startup-page__lead">
            Compartilhe informações reais sobre a startup.
          </p>
        </div>
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

      <div className="missing-layout publications-layout">
        <section className="missing-main">
          <div className="missing-tabs" aria-label="Abas de publicações">
            {[
              ["feed", "Feed da comunidade"],
              ["mine", "Minhas publicações"],
              ["drafts", "Rascunhos"],
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

          {tab !== "drafts" && (
            <form
              className="post-composer"
              onSubmit={(event) => {
                event.preventDefault();
                save("PUBLISHED");
              }}
            >
              <label>
                <span>Nova publicação</span>
                <textarea
                  value={text}
                  maxLength={5000}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva sobre a startup"
                />
              </label>
              <div className="post-composer__fields">
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags separadas por espaço"
                  aria-label="Tags"
                />
                <select
                  value={metricId}
                  onChange={(e) => setMetricId(e.target.value)}
                  aria-label="Anexar métrica informada pela startup"
                >
                  <option value="">Métrica informada (opcional)</option>
                  {metrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name}: {metric.value} {metric.unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="post-composer__actions">
                <button
                  type="button"
                  className="startup-filter-button"
                  disabled={busy || !text.trim()}
                  onClick={() => save("DRAFT")}
                >
                  Salvar rascunho
                </button>
                <button
                  type="submit"
                  className="missing-primary"
                  disabled={busy || !text.trim()}
                >
                  {busy ? "Enviando…" : "Publicar"}
                </button>
              </div>
            </form>
          )}

          <div className="post-tools">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar texto ou hashtag"
            />
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">Todos os assuntos</option>
              {tagsFromPosts.map((value) => (
                <option key={value} value={value}>
                  #{value}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="startup-state" role="status">
              Carregando publicações…
            </p>
          ) : posts.length === 0 ? (
            <p className="startup-state">
              Nenhuma publicação encontrada para esta seleção.
            </p>
          ) : (
            <div className="post-feed">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <header>
                    <strong>
                      {post.authorName || me.startup?.name || "Startup"}
                    </strong>
                    {post.createdAt && (
                      <time>
                        {new Date(post.createdAt).toLocaleString("pt-BR")}
                      </time>
                    )}
                  </header>
                  <p>{post.text}</p>
                  {post.tags?.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((value) => (
                        <span key={value}>#{value}</span>
                      ))}
                    </div>
                  )}
                  {post.metric && (
                    <div className="post-metric">
                      <small>Métrica informada pela startup</small>
                      <strong>
                        {post.metric.name}: {post.metric.value}{" "}
                        {post.metric.unit}
                      </strong>
                    </div>
                  )}
                  <footer>
                    {typeof post.likesCount === "number" && (
                      <button
                        onClick={() => react(post.id, "like")}
                        disabled={busy}
                      >
                        Curtidas {post.likesCount}
                      </button>
                    )}
                    {typeof post.commentsCount === "number" && (
                      <span>Comentários {post.commentsCount}</span>
                    )}
                    {typeof post.repostsCount === "number" && (
                      <button
                        onClick={() => react(post.id, "repost")}
                        disabled={busy}
                      >
                        Reposts {post.repostsCount}
                      </button>
                    )}
                    {post.owner && post.status === "DRAFT" && (
                      <button onClick={() => resumeDraft(post)} disabled={busy}>
                        Retomar
                      </button>
                    )}
                    {post.owner && (
                      <button
                        className="post-delete"
                        onClick={() => removePost(post.id)}
                        disabled={busy}
                      >
                        Excluir
                      </button>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="missing-aside">
          <section className="missing-card">
            <h2>Sua última publicação</h2>
            {lastPost ? (
              <>
                <p>{lastPost.text}</p>
                <small>
                  {new Date(lastPost.createdAt).toLocaleString("pt-BR")}
                </small>
              </>
            ) : (
              <p>Nenhuma publicação cadastrada.</p>
            )}
          </section>
          <section className="missing-card">
            <h2>Explore assuntos</h2>
            {tagsFromPosts.length ? (
              tagsFromPosts.map((value) => (
                <button
                  key={value}
                  className="right-tag"
                  onClick={() => setTag(value)}
                >
                  #{value}
                </button>
              ))
            ) : (
              <p>Nenhum assunto publicado.</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
