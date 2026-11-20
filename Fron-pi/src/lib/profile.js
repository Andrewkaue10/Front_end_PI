export const roleLabel = (role) =>
  ({
    STARTUP: "Startup",
    INVESTOR: "Investidor",
    MENTOR: "Mentor",
    BOTH: "Investidor e mentor",
    ADMIN: "Administrador",
  })[role] || "Profissional";
export const isProfessional = (role) =>
  ["INVESTOR", "MENTOR", "BOTH"].includes(role);
export const profileStatus = (status) =>
  ({
    PENDING: "Em análise",
    APPROVED: "Aprovado",
    REJECTED: "Revisão necessária",
  })[status] || "Não informado";
