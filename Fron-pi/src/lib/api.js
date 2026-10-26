const base = (
  import.meta.env.VITE_API_URL || "http://localhost:3333/api"
).replace(/\/$/, "");
export const token = () =>
  sessionStorage.getItem("nexhub.token") ||
  localStorage.getItem("nexhub.token");
export function clearSession() {
  sessionStorage.removeItem("nexhub.token");
  localStorage.removeItem("nexhub.token");
}
export function saveSession(value, remember = false) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem("nexhub.token", value);
}
export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(base + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
        ...options.headers,
      },
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
    });
  } catch {
    throw new Error(
      "Não foi possível acessar a API. Confira se o backend está iniciado.",
    );
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (
      response.status === 401 &&
      (!path.startsWith("/auth/") || path === "/auth/me")
    ) {
      clearSession();
      window.location.assign("/login");
    }
    throw new Error(
      data?.fields
        ?.map((f) => `${f.field || "Cadastro"}: ${f.message}`)
        .join(" · ") ||
        data?.error ||
        "Não foi possível concluir a operação.",
    );
  }
  return data;
}
