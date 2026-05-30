export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString();
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

export function truncate(str, length) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}