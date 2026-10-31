/**
 * IMPORTS
 */

// Iniciais para avatar: primeira letra do primeiro e do último nome ("Carlos Motta" → "CM").
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
};

/**
 * EXPORTS
 */
export { getInitials };
