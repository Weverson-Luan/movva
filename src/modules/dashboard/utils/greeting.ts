/**
 * IMPORTS
 */

// "Bom dia" até 11h59, "Boa tarde" até 17h59, depois "Boa noite".
const getGreeting = (date: Date) => {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

// "sexta-feira, 30 de outubro" (a caixa alta fica com a view).
const formatDayLabel = (date: Date) => {
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
};

// Primeiro nome com inicial maiúscula ("carlos motta" → "Carlos").
const getFirstName = (name: string) => {
  const [first = ""] = name.trim().split(/\s+/);
  return first.charAt(0).toUpperCase() + first.slice(1);
};

/**
 * EXPORTS
 */
export { formatDayLabel, getFirstName, getGreeting };
