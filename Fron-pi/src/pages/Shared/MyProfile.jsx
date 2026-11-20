import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight, UserRound, CheckCircle2 } from "lucide-react";
import AreaShell from "../../components/AreaShell/AreaShell";
import { roleLabel, profileStatus } from "../../lib/profile";
import "./SharedPages.css";
export default function MyProfile() {
  return (
    <AreaShell>
      {(me) => {
        const p = me.startup || me.investor || {};
        return (
          <div className="area-page my-profile">
            <p className="page-eyebrow">SUA PRESENÇA NO NEXHUB</p>
            <h1>Meu perfil</h1>
            <p className="area-page__lead">
              Quem você é e as conexões que deseja construir.
            </p>
            <section className="profile-hero">
              <div className="profile-hero__cover" />
              <div className="profile-hero__body">
                <span className="profile-hero__avatar">
                  <UserRound size={32} />
                </span>
                <div>
                  <span className="profile-badge">{roleLabel(me.role)}</span>
                  <h2>{p.name || me.name}</h2>
                  <p>
                    <MapPin size={15} />{" "}
                    {[p.city, p.state].filter(Boolean).join(" · ") ||
                      "Localização não informada"}
                  </p>
                </div>
                <Link className="area-button" to="/configuracoes?tab=profile">
                  Editar perfil <ArrowUpRight size={16} />
                </Link>
              </div>
            </section>
            <div className="profile-summary-grid">
              <section className="area-card">
                <h2>Apresentação</h2>
                <p className="profile-bio">
                  {p.description ||
                    p.bio ||
                    "Conte sua trajetória, seus interesses e como você quer colaborar com a comunidade."}
                </p>
                <h3>Áreas de interesse</h3>
                <div className="profile-tags">
                  {(p.sectors || p.interests || []).map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
              </section>
              <section className="area-card">
                <h2>Sobre o perfil</h2>
                <p>
                  <CheckCircle2 size={16} /> {profileStatus(p.status)}
                </p>
                <p>{p.company || "Organização não informada"}</p>
                {p.ticketRange && <p>Investimento: {p.ticketRange}</p>}
                <p>{(p.specialties || []).join(" · ")}</p>
                <Link
                  to={
                    me.role === "STARTUP"
                      ? "/startup/perfil"
                      : "/investidor/qualificacoes"
                  }
                >
                  Ver detalhes e qualificações →
                </Link>
              </section>
            </div>
          </div>
        );
      }}
    </AreaShell>
  );
}
