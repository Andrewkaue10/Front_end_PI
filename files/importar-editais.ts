// Uso: npx tsx scripts/importar-editais.ts data/editais-reais.json
import "dotenv/config";
import { readFileSync } from "node:fs";
import { pool } from "../src/db";

type Item = {
  id: string; titulo: string; orgao: string; resumo: string; publico?: string; regiao?: string;
  uf: string[]; areas: string[]; valor: number | null; valor_txt?: string;
  prazo: string | null; link: string; link_tipo: "oficial" | "agregador"; obs?: string;
};

const arquivo = process.argv[2] ?? "data/editais-reais.json";
const { editais } = JSON.parse(readFileSync(arquivo, "utf-8")) as { editais: Item[] };

for (const e of editais) {
  if (!/^https?:\/\//i.test(e.link)) { console.warn("link inválido, ignorado:", e.id); continue; }
  await pool.query(
    `INSERT INTO editais (slug, titulo, orgao, resumo, publico, regiao, estados, areas, valor_max, valor_txt, prazo, url, link_tipo, obs)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (slug) DO UPDATE SET
       titulo=$2, orgao=$3, resumo=$4, publico=$5, regiao=$6, estados=$7, areas=$8,
       valor_max=$9, valor_txt=$10, prazo=$11, url=$12, link_tipo=$13, obs=$14, coletado_em=now()`,
    [e.id, e.titulo, e.orgao, e.resumo, e.publico ?? null, e.regiao ?? "Nacional", e.uf, e.areas,
     e.valor, e.valor_txt ?? null, e.prazo, e.link, e.link_tipo, e.obs ?? null]
  );
  console.log("ok:", e.titulo);
}
await pool.end();
