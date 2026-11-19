import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Heart,
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
          <Link to="/painel">Perfil</Link>
          <Link to="/painel#conexoes">Rede</Link>
        </nav>
      </header>
      <aside className="startup-shell__sidebar">
        <nav aria-label="Área da startup">
          <Link className={active("/startup") ? "active" : ""} to="/startup">
            <Home size={16} />
            <span>Início</span>
          </Link>
          <Link to="/painel#perfil">
            <BriefcaseBusiness size={16} />
            <span>Publicações</span>
          </Link>
          <Link to="/painel#avisos">
            <Bell size={16} />
            <span>Notificações</span>
          </Link>
          <Link
            className={active("/startup/editais") ? "active" : ""}
            to="/startup/editais"
          >
            <CalendarDays size={16} />
            <span>Editais</span>
          </Link>
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
          <Link to="/painel#conexoes">
            <Mail size={16} />
            <span>Mensagens</span>
          </Link>
          <Link to="/painel#perfil">
            <Heart size={16} />
            <span>Perfil da startup</span>
          </Link>
          <Link to="/painel#perfil">
            <Settings size={16} />
            <span>Configurações</span>
          </Link>
        </nav>
        <div className="startup-shell__account">
          <span>{initials || "—"}</span>
          <div>
            <strong>{me.startup?.name || me.name}</strong>
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
