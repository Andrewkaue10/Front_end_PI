import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, RefreshCw } from "lucide-react";
import { api } from "../lib/api";
import "./SocialFeed.css";
export default function SocialFeed({
  authorId,
  title = "Publicações da comunidade",
}) {
  const [page, setPage] = useState(1),
    [data, setData] = useState({ items: [], total: 0 }),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const load = useCallback(async () => {
    const result = await api(
      `/posts?view=feed&page=${page}&limit=10${authorId ? `&authorId=${encodeURIComponent(authorId)}` : ""}`,
    );
    setData({
      ...result,
      items: (result.items || []).filter(
        (p) => !authorId || p.authorId === authorId,
      ),
    });
  }, [authorId, page]);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    api(
      `/posts?view=feed&page=${page}&limit=10${authorId ? `&authorId=${encodeURIComponent(authorId)}` : ""}`,
    )
      .then((result) => {
        if (alive)
          setData({
            ...result,
            items: (result.items || []).filter(
              (p) => !authorId || p.authorId === authorId,
            ),
          });
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [authorId, page]);
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="social-feed" aria-label={title}>
      <header className="social-feed-heading">
        <div>
          <h2>{title}</h2>
          <p>Novidades, conquistas e conversas com startups.</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          aria-label="Atualizar publicações"
        >
          <RefreshCw size={16} />
        </button>
      </header>
      {error && (
        <p className="social-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Carregando publicações…</p>
      ) : data.items.length === 0 ? (
        <p className="social-empty">Nenhuma publicação disponível ainda.</p>
      ) : (
        data.items.map((post) => (
          <PostCard key={post.id} post={post} reload={load} />
        ))
      )}
      <div className="social-pagination">
        <button
          disabled={loading || page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          disabled={loading || page * 10 >= data.total}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
function PostCard({ post, reload }) {
  const [open, setOpen] = useState(false),
    [comments, setComments] = useState([]),
    [total, setTotal] = useState(0),
    [page, setPage] = useState(1),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reading, setReading] = useState(false);
  async function readComments(next = 1) {
    setReading(true);
    try {
      const d = await api(`/posts/${post.id}/comments?page=${next}&limit=10`);
      setComments(d.items);
      setTotal(d.total);
      setPage(next);
    } catch (e) {
      setError(e.message);
    } finally {
      setReading(false);
    }
  }
  async function toggle() {
    setOpen(!open);
    if (!open) {
      setError("");
      await readComments();
    }
  }
  async function react(type, active) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api(`/posts/${post.id}/${type}`, {
        method: active ? "DELETE" : "POST",
      });
      await reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(e) {
    e.preventDefault();
    if (busy || !text.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api(`/posts/${post.id}/comments`, {
        method: "POST",
        body: { text: text.trim() },
      });
      setText("");
      await readComments(Math.ceil((total + 1) / 10));
      await reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="social-post">
      <header>
        <Link
          className="social-author"
          to={`/painel?kind=startups&id=${post.authorId}`}
        >
          <span className="social-avatar">
            {post.authorName?.slice(0, 2).toUpperCase()}
          </span>
          <strong>{post.authorName}</strong>
        </Link>
        <time dateTime={post.createdAt}>
          {new Date(post.createdAt).toLocaleString("pt-BR")}
        </time>
      </header>
      <p className="social-post-text">{post.text}</p>
      {post.metric && (
        <div className="social-metric">
          <strong>{post.metric.name}</strong>
          <span>
            {post.metric.value} {post.metric.unit}
          </span>
          <small>{post.metric.period}</small>
        </div>
      )}
      <div className="social-tags">
        {post.tags?.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <div className="social-actions">
        <button
          aria-pressed={post.liked}
          disabled={busy}
          onClick={() => react("like", post.liked)}
        >
          <Heart size={18} />
          {post.likesCount} curtidas
        </button>
        <button aria-expanded={open} onClick={toggle}>
          <MessageCircle size={18} />
          {post.commentsCount} comentários
        </button>
        <button
          aria-pressed={post.reposted}
          disabled={busy}
          onClick={() => react("repost", post.reposted)}
        >
          <Repeat2 size={18} />
          {post.repostsCount} reposts
        </button>
      </div>
      {error && (
        <p role="alert" className="social-error">
          {error}
        </p>
      )}
      {open && (
        <div className="social-comments">
          {reading ? (
            <p role="status">Carregando comentários…</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="social-comment">
                <strong>{c.user?.name || "Usuário"}</strong>
                <p>{c.text}</p>
                <small>{new Date(c.createdAt).toLocaleString("pt-BR")}</small>
              </div>
            ))
          )}
          {!reading && !comments.length && (
            <p>Seja a primeira pessoa a comentar.</p>
          )}
          {total > 10 && (
            <div className="social-pagination">
              <button
                disabled={reading || page === 1}
                onClick={() => readComments(page - 1)}
              >
                Comentários anteriores
              </button>
              <button
                disabled={reading || page * 10 >= total}
                onClick={() => readComments(page + 1)}
              >
                Mais comentários
              </button>
            </div>
          )}
          <form onSubmit={submit}>
            <label>
              Seu comentário
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2000}
                required
                placeholder="Participe da conversa…"
              />
            </label>
            <button disabled={busy || !text.trim()}>
              {busy ? "Enviando…" : "Comentar"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
