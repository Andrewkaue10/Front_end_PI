import { roleLabel } from "../../lib/profile";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Heart,
  Home,
  Mail,
  Settings,
  Sparkles,
  Users,
  WalletCards,
  LogOut,
} from "lucide-react";
import { api, clearSession, token } from "../../lib/api";
import "./AreaShell.css";

export default function AreaShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token()) {
      navigate("/login", { replace: true });
      return;
    }
    let alive = true;
    api("/auth/me")
      .then((current) => {
        if (!alive) return;
        if (!["STARTUP", "INVESTOR", "MENTOR", "BOTH"].includes(current.role)) {
          navigate("/painel", { replace: true });
          return;
        }
        setMe(current);
      })
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [navigate]);

  useEffect(() => {
    const update = (event) =>
      setMe((current) =>
        current ? { ...current, avatarData: event.detail } : current,
      );
    window.addEventListener("nexhub:avatar", update);
    return () => window.removeEventListener("nexhub:avatar", update);
  }, []);
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  if (!me)
    return (
      <main className="area-shell__loading" role="status">
        {error || "Carregando sua área…"}
      </main>
    );

  const startup = me.role === "STARTUP";
  const base = startup ? "/startup" : "/feed";
  const initials = (me.startup?.name || me.investor?.name || me.name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const active = (path) => location.pathname === path;

  return (
    <div
      className={`area-shell ${startup ? "startup-theme" : "investor-theme"}`}
    >
      <header className="area-shell__header">
        <Link
          className="area-shell__brand"
          to={base}
          aria-label="NexHub início"
        >
          <span>NEX</span>
          <em>hub</em>
          <i aria-hidden="true">✦</i>
        </Link>
        <nav className="area-shell__top" aria-label="Navegação principal">
          <Link to={base}>Início</Link>
          <Link to="/mensagens">Mensagens</Link>
          <Link to="/alia">A.L.I.A</Link>
          <Link to="/notificacoes">Notificações</Link>
          <Link to="/configuracoes">Configurações</Link>
        </nav>
      </header>
      <aside className="area-shell__sidebar">
        <nav aria-label="Navegação da área">
          <Link className={active(base) ? "active" : ""} to={base}>
            <Home size={16} />
            <span>Início</span>
          </Link>
          {startup ? (
            <>
              <Link to="/startup/editais">
                <BriefcaseBusiness size={16} />
                <span>Editais</span>
              </Link>
              <Link to="/startup/mentores">
                <Sparkles size={16} />
                <span>Mentores</span>
              </Link>
              <Link to="/startup/investidores">
                <Users size={16} />
                <span>Investidores</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                className={active("/investidor/matches") ? "active" : ""}
                to="/investidor/matches"
              >
                <Users size={16} />
                <span>Matches</span>
              </Link>
              <Link
                className={active("/investidor/favoritos") ? "active" : ""}
                to="/investidor/favoritos"
              >
                <Heart size={16} />
                <span>Favoritos</span>
              </Link>
              <Link
                className={active("/investidor/portfolio") ? "active" : ""}
                to="/investidor/portfolio"
              >
                <WalletCards size={16} />
                <span>Portfólio</span>
              </Link>
              <Link
                className={active("/investidor/qualificacoes") ? "active" : ""}
                to="/investidor/qualificacoes"
              >
                <BriefcaseBusiness size={16} />
                <span>Minhas qualificações</span>
              </Link>
            </>
          )}
          <Link className={active("/alia") ? "active" : ""} to="/alia">
            <Sparkles size={16} />
            <span>A.L.I.A</span>
          </Link>
          <Link
            className={active("/mensagens") ? "active" : ""}
            to="/mensagens"
          >
            <Mail size={16} />
            <span>Mensagens</span>
          </Link>
          <Link
            className={active("/notificacoes") ? "active" : ""}
            to="/notificacoes"
          >
            <Bell size={16} />
            <span>Notificações</span>
          </Link>
          <Link
            className={active("/configuracoes") ? "active" : ""}
            to="/configuracoes"
          >
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
        </nav>
        <div className="area-shell__account">
          <Link
            className="account-avatar"
            aria-label="Abrir meu perfil"
            to="/perfil"
          >
            {me.avatarData ? (
              <img src={me.avatarData} alt="" />
            ) : (
              initials || "—"
            )}
          </Link>
          <div>
            <Link className="account-name" to="/perfil">
              <strong>
                {me.startup?.name || me.investor?.name || me.name}
              </strong>
            </Link>
            <small>{roleLabel(me.role)}</small>
          </div>
          <button onClick={logout} aria-label="Sair">
            <LogOut size={15} />
          </button>
        </div>
      </aside>
      <main className="area-shell__page">
        {typeof children === "function" ? children(me) : children}
      </main>
    </div>
  );
}
