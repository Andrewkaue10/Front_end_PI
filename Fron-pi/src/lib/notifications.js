import { api } from "./api";
// Compatibility with deployments that still expose only the notification list.
export async function notificationDetail(id) {
  try {
    return await api(`/notifications/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error.status !== 404 || error.message !== "Rota não encontrada.")
      throw error;
    let notification;
    for (let page = 1; page <= 100; page++) {
      const result = await api(`/notifications?page=${page}&limit=100`);
      notification = result.items?.find((n) => n.id === id);
      if (notification || (result.items || []).length < 100) break;
    }
    if (!notification) throw new Error("Notificação indisponível.");
    const result = {
      ...notification,
      connection: null,
      partner: null,
      meeting: null,
    };
    if (
      notification.type.startsWith("CONNECTION_") ||
      notification.type === "MESSAGE"
    ) {
      const me = await api("/auth/me");
      for (let page = 1; page <= 100; page++) {
        const data = await api(`/connections?page=${page}&limit=100`);
        const c = data.items?.find((c) => c.id === notification.resourceId);
        if (c) {
          result.connection = {
            ...c,
            canRespond: c.status === "PENDING" && c.requestedBy !== me.id,
          };
          result.partner = me.role === "STARTUP" ? c.investor : c.startup;
          break;
        }
        if ((data.items || []).length < 100) break;
      }
    } else if (notification.type.startsWith("MEETING_")) {
      for (let page = 1; page <= 100; page++) {
        const data = await api(`/meetings?page=${page}&limit=100`);
        result.meeting =
          data.items?.find((m) => m.id === notification.resourceId) || null;
        if (result.meeting || (data.items || []).length < 100) break;
      }
    }
    return result;
  }
}
