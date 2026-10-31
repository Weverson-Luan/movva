/**
 * IMPORTS
 */

const pad = (value: number) => String(value).padStart(2, "0");

// "10/09/2026"
const formatDate = (date: Date) => `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

// "09:40"
const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

// "21/10/2026 09:30"
const formatDateTime = (date: Date) => `${formatDate(date)} ${formatTime(date)}`;

// "21/10/2026 09:30 às 21/10/2026 11:00" — data completa dos dois lados, sempre.
const formatPeriod = (startedAt: Date, endedAt: Date) => `${formatDateTime(startedAt)} às ${formatDateTime(endedAt)}`;

// 30 → "30min"; 122 → "2h 02min"; 120 → "2h 00min"
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${pad(rest)}min` : `${rest}min`;
};

/**
 * EXPORTS
 */
export { formatDuration, formatPeriod };
