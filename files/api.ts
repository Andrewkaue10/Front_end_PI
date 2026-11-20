import type { Edital, Filtros } from "./types";

export async function listarEditais(f: Filtros, signal?: AbortSignal): Promise<Edital[]> {
  const p = new URLSearchParams();
  if (f.uf) p.set("uf", f.uf);
  if (f.areas?.length) p.set("areas", f.areas.join(","));
  if (f.q) p.set("q", f.q);
  const r = await fetch(`/api/editais?${p}`, { signal, credentials: "include" });
  if (!r.ok) throw new Error(`Erro ${r.status} ao buscar editais`);
  return r.json();
}

/** Registra o clique sem atrasar a abertura do edital. Se usar token Bearer, adicione o header aqui. */
export function registrarClique(id: string) {
  fetch(`/api/editais/${id}/clique`, { method: "POST", keepalive: true, credentials: "include" }).catch(() => {});
}

/** Só aceita http(s): evita esquemas perigosos como javascript: se algum link vier errado do coletor. */
export function urlSegura(url: string): boolean {
  try {
    const p = new URL(url).protocol;
    return p === "https:" || p === "http:";
  } catch {
    return false;
  }
}
