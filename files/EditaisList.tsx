import { useState } from "react";
import { registrarClique, urlSegura } from "./api";
import { useEditais } from "./useEditais";
import type { Edital } from "./types";

type Props = { uf?: string; areas?: string[] }; // vêm do perfil da startup logada

const dataBR = (iso: string) => iso.split("-").reverse().join("/");

function Prazo({ e }: { e: Edital }) {
  if (e.dias === null) return <span>Fluxo contínuo</span>;
  if (e.dias === 0) return <strong>Encerra hoje</strong>;
  return <span>Faltam {e.dias} dias (até {dataBR(e.prazo!)})</span>;
}

function CardEdital({ e }: { e: Edital }) {
  return (
    <article className="edital-card">
      <h3>{e.titulo}</h3>
      <p className="edital-orgao">{e.orgao} · {e.regiao}</p>
      <p>{e.resumo}</p>
      <p><Prazo e={e} /> · {e.valor_txt ?? "Valor não informado"}</p>
      <p>{Math.round(e.aderencia * 100)}% de aderência</p>
      {e.obs && <p className="edital-obs">Atenção: {e.obs}</p>}

      {urlSegura(e.url) ? (
        // O <a> leva direto ao edital. O clique é só registrado em segundo plano.
        <a
          className="edital-botao"
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => registrarClique(e.id)}
        >
          Abrir edital
        </a>
      ) : (
        <button className="edital-botao" disabled>Link indisponível</button>
      )}
      <small>{e.link_tipo === "oficial" ? "Página oficial" : "Página agregadora (traz o link oficial)"}</small>
    </article>
  );
}

export function EditaisList({ uf, areas }: Props) {
  const [q, setQ] = useState("");
  const { editais, carregando, erro } = useEditais({ uf, areas, q: q || undefined });

  return (
    <section>
      <input
        type="search"
        value={q}
        onChange={(ev) => setQ(ev.target.value)}
        placeholder="Buscar por nome, órgão ou área"
        aria-label="Buscar editais"
      />
      {carregando && <p>Buscando editais...</p>}
      {erro && <p role="alert">{erro}</p>}
      {!carregando && !erro && editais.length === 0 && <p>Nenhum edital encontrado.</p>}
      {editais.map((e) => <CardEdital key={e.id} e={e} />)}
    </section>
  );
}
// Uso:  <EditaisList uf={startup.estado} areas={startup.areas} />
