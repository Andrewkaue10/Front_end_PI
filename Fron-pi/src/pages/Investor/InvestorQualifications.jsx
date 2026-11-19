import { Link } from "react-router-dom";
import AreaShell from "../../components/AreaShell/AreaShell";
import "../Shared/SharedPages.css";

const list = (values) =>
  Array.isArray(values) && values.length ? values.join(", ") : "Não informado";

export default function InvestorQualifications() {
  return (
    <AreaShell>
      {(me) =>
        me.role === "STARTUP" ? (
          <div className="area-page">
            <p className="area-alert">
              Esta tela é exclusiva para perfis profissionais.
            </p>
          </div>
        ) : (
          <div className="area-page">
            <h1>Minhas qualificações</h1>
            <p className="area-page__lead">
              Dados reais informados no perfil profissional.
            </p>
            <div className="investor-list-page__grid">
              <article className="area-card investor-list-page__card">
                <h2>Critérios do perfil</h2>
                <dl>
                  <div>
                    <dt>Papel</dt>
                    <dd>{me.role}</dd>
                  </div>
                  <div>
                    <dt>Tipo</dt>
                    <dd>{me.investor?.type || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Interesses</dt>
                    <dd>{list(me.investor?.interests)}</dd>
                  </div>
                  <div>
                    <dt>Estágios</dt>
                    <dd>{list(me.investor?.stages)}</dd>
                  </div>
                  <div>
                    <dt>Ticket</dt>
                    <dd>{me.investor?.ticketRange || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Especialidades</dt>
                    <dd>{list(me.investor?.specialties)}</dd>
                  </div>
                </dl>
                {me.investor?.availability != null && (
                  <p>
                    Disponibilidade informada: {me.investor.availability} h/mês
                  </p>
                )}
                <p>{me.investor?.bio || "Descrição não informada"}</p>
                <div className="investor-list-page__actions">
                  <Link className="area-button" to="/configuracoes">
                    Editar dados suportados
                  </Link>
                </div>
              </article>
            </div>
          </div>
        )
      }
    </AreaShell>
  );
}
