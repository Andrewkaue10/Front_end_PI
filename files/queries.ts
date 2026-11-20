export type EditalRow = {
  id: string; titulo: string; orgao: string; resumo: string; publico: string | null;
  regiao: string; estados: string[]; areas: string[];
  valor_max: number | null; valor_txt: string | null;
  prazo: string | null;      // "AAAA-MM-DD" ou null (fluxo contínuo)
  dias: number | null;       // dias restantes
  url: string; link_tipo: "oficial" | "agregador"; obs: string | null;
  aderencia: number;         // 0 a 1
};

// $1 = UF (ou null), $2 = áreas do perfil (text[]), $3 = busca (ou null)
export const SQL_LISTAR = `
SELECT e.id, e.titulo, e.orgao, e.resumo, e.publico, e.regiao, e.estados, e.areas,
       e.valor_max::float8 AS valor_max, e.valor_txt,
       to_char(e.prazo, 'YYYY-MM-DD') AS prazo,
       (e.prazo - CURRENT_DATE)::int AS dias,
       e.url, e.link_tipo, e.obs,
       CASE
         WHEN 'Todas as áreas' = ANY(e.areas) THEN 1.0
         WHEN cardinality(e.areas) = 0 THEN 0.0
         ELSE (SELECT COUNT(*) FROM unnest(e.areas) a WHERE a = ANY($2::text[]))::float8
              / cardinality(e.areas)
       END AS aderencia
FROM editais e
WHERE e.status = 'aprovado'
  AND (e.prazo IS NULL OR e.prazo >= CURRENT_DATE)
  AND ($1::text IS NULL OR cardinality(e.estados) = 0 OR $1::text = ANY(e.estados))
  AND ($3::text IS NULL OR e.titulo ILIKE '%' || $3 || '%'
                        OR e.orgao  ILIKE '%' || $3 || '%'
                        OR e.resumo ILIKE '%' || $3 || '%')
ORDER BY aderencia DESC, e.prazo NULLS LAST, e.titulo
LIMIT 100`;

export const SQL_CLIQUE = `INSERT INTO edital_cliques (edital_id, user_id)
SELECT id, $2::uuid FROM editais WHERE id = $1::uuid`;
