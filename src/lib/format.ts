export function formatMoney(value: number | string | undefined) {
  const num = Number(value) || 0;
  return "$" + new Intl.NumberFormat("es").format(num);
}

export function formatDate(value: string | Date | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(d);
}

export function formatDateTime(value: string | Date | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(d);
}
