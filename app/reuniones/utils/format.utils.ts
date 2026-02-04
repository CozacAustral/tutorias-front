
export function fullName(
  user?: { name?: string; lastName?: string; email?: string } | null,
) {
  if (!user) return "-";
  return (
    [user.name, user.lastName].filter(Boolean).join(" ") || user.email || "-"
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatFecha(dateISO: string) {
  try {
    const date = new Date(dateISO);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateISO;
  }
}

export function formatHora(dateISO: string, time?: string) {
  try {
    if (time && /^\d{1,2}:\d{2}/.test(time)) return time;
    const date = new Date(dateISO);
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  } catch {
    return time ?? "";
  }
}
