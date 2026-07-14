export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function remainingDays(date: Date) {
  const diff = date.getTime() - Date.now();

  return Math.max(
    Math.ceil(diff / 86400000),
    0
  );
}

export function randomId(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[
      Math.floor(Math.random() * chars.length)
    ];
  }

  return result;
}
