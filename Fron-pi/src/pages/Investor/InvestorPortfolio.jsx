import AreaShell from "../../components/AreaShell/AreaShell";

export default function InvestorPortfolio() {
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
            <section className="area-card">
              <h2>Portfólio indisponível</h2>
              <p className="area-state">
                O backend atual não possui modelo para investimentos, aportes,
                participação societária, documentos ou relatórios. Favoritos e
                conexões não são apresentados como investimentos.
              </p>
            </section>
          </div>
        )
      }
    </AreaShell>
  );
}
