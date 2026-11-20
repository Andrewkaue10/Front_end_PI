import { useEffect, useState } from "react";
import { listarEditais } from "./api";
import type { Edital, Filtros } from "./types";

export function useEditais(filtros: Filtros) {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const chave = JSON.stringify(filtros);

  useEffect(() => {
    const ctrl = new AbortController();
    setCarregando(true);
    const t = setTimeout(() => {           // pequeno debounce para a busca por texto
      listarEditais(JSON.parse(chave), ctrl.signal)
        .then((d) => { setEditais(d); setErro(null); })
        .catch((e) => { if (e.name !== "AbortError") setErro(e.message); })
        .finally(() => setCarregando(false));
    }, 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [chave]);

  return { editais, carregando, erro };
}
