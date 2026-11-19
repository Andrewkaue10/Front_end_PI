import { useEffect, useState } from "react";
import AreaShell from "../../components/AreaShell/AreaShell";
import { api } from "../../lib/api";

export default function InvestorPortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api("/portfolio?page=1&limit=100")
      .then((data) => alive && setItems(data.items || []))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

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
            <h1>Portfólio</h1>
            <p className="area-page__lead">
              Investimentos registrados na plataforma.
            </p>
            {error && (
              <p className="area-alert" role="alert">
                {error}
              </p>
            )}
            {loading ? (
              <p className="area-state" role="status">
                Carregando portfólio…
              </p>
            ) : items.length === 0 ? (
              <section className="area-card">
                <h2>Nenhum investimento registrado</h2>
                <p className="area-state">
                  Favoritos e conexões não são apresentados como investimentos.
                </p>
              </section>
            ) : (
              <div className="investor-list-page__grid">
                {items.map((investment) => (
                  <article className="area-card" key={investment.id}>
                    <h2>{investment.startup?.name || "Startup"}</h2>
                    <dl>
                      <div>
                        <dt>Valor</dt>
                        <dd>
                          {Number(investment.amount).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: investment.currency,
                          })}
                        </dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{investment.status}</dd>
                      </div>
                      {investment.equityPercent != null && (
                        <div>
                          <dt>Participação</dt>
                          <dd>{Number(investment.equityPercent)}%</dd>
                        </div>
                      )}
                    </dl>
                    {investment.updates?.length > 0 && (
                      <div>
                        <h3>Atualizações</h3>
                        {investment.updates.map((update) => (
                          <p key={update.id}>
                            <strong>{update.title}</strong> — {update.updateText}
                          </p>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )
      }
    </AreaShell>
  );
}
