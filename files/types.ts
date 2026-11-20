export type Edital = {
  id: string;
  titulo: string;
  orgao: string;
  resumo: string;
  publico: string | null;
  regiao: string;
  estados: string[];
  areas: string[];
  valor_max: number | null;
  valor_txt: string | null;
  prazo: string | null; // "AAAA-MM-DD"; null = fluxo contínuo
  dias: number | null;
  url: string;          // link do edital
  link_tipo: "oficial" | "agregador";
  obs: string | null;
  aderencia: number;    // 0 a 1
};

export type Filtros = { uf?: string; areas?: string[]; q?: string };
