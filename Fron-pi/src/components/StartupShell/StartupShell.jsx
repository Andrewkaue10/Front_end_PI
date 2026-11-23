import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Home,
  Mail,
  Settings,
  Sparkles,
  Users,
  LogOut,
} from "lucide-react";
import { api, clearSession, token } from "../../lib/api";
import "./StartupShell.css";

export default function StartupShell() {
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
        if (current.role !== "STARTUP") {
          navigate(
            ["INVESTOR", "MENTOR", "BOTH"].includes(current.role)
              ? "/feed"
              : "/painel",
            { replace: true },
          );
          return;
        }
        setMe(current);
      })
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [navigate]);

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  const active = (path) => location.pathname === path;
  const initials = (me?.startup?.name || me?.name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (!me)
    return (
      <main className="startup-page-loading" role="status">
        {error || "Carregando sua área…"}
      </main>
    );

  return (
    <div className="startup-shell">
      <header className="startup-shell__header">
        <Link
          className="startup-shell__brand"
          to="/startup"
          aria-label="NexHub início"
        >
          <span>NEX</span>
          <em>hub</em>
          <i aria-hidden="true">✦</i>
        </Link>
        <nav className="startup-shell__top" aria-label="Navegação principal">
          <Link to="/startup">Início</Link>
          <Link to="/startup/perfil">Perfil</Link>
          <Link to="/painel#conexoes">Rede</Link>
          <Link to="/mensagens">Mensagens</Link>
        </nav>
      </header>
      <aside className="startup-shell__sidebar">
        <nav aria-label="Área da startup">
          <Link className={active("/startup") ? "active" : ""} to="/startup">
            <Home size={16} />
            <span>Início</span>
          </Link>
          <Link
            className={active("/startup/perfil") ? "active" : ""}
            to="/startup/perfil"
          >
            <BriefcaseBusiness size={16} />
            <span>Perfil da startup</span>
          </Link>
          <Link
            className={active("/startup/publicacoes") ? "active" : ""}
            to="/startup/publicacoes"
          >
            <Mail size={16} />
            <span>Publicações</span>
          </Link>
          <Link to="/alia">
            <Sparkles size={16} />
            <span>A.L.I.A</span>
          </Link>
          <Link to="/notificacoes">
            <Bell size={16} />
            <span>Notificações</span>
          </Link>
          <div className="sidebar-disabled" aria-disabled="true">
            <CalendarDays size={16} />
            <span>Editais</span>
          </div>
          <Link
            className={active("/startup/mentores") ? "active" : ""}
            to="/startup/mentores"
          >
            <Sparkles size={16} />
            <span>Mentores</span>
          </Link>
          <Link
            className={active("/startup/investidores") ? "active" : ""}
            to="/startup/investidores"
          >
            <Users size={16} />
            <span>Investidores</span>
          </Link>
          <Link to="/mensagens">
            <Mail size={16} />
            <span>Mensagens</span>
          </Link>
          <Link to="/configuracoes">
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
        </nav>
        <div className="startup-shell__account">
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
              <strong>{me.startup?.name || me.name}</strong>
            </Link>
            <small>Startup</small>
          </div>
          <button onClick={logout} aria-label="Sair">
            <LogOut size={15} />
          </button>
        </div>
      </aside>
      <Outlet context={{ me }} />
    </div>
  );
}
