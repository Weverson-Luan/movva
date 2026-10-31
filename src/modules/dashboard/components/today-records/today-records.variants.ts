/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

const todayRecordsVariants = tv({
  slots: {
    container: "gap-3",
    header: "flex-row items-center justify-between",
    title: "text-xl font-bold text-text",
    historyLink: "text-base font-semibold text-primary",
    card: "rounded-brand bg-surface px-4 pt-5 pb-1",
  },
});

// Linha da timeline (só registros encerrados). `isLast` some com a linha que liga ao próximo.
const todayRecordRowVariants = tv({
  slots: {
    container: "flex-row gap-3",
    rail: "items-center",
    iconCircle: "h-9 w-9 items-center justify-center rounded-full bg-muted/10",
    connector: "my-1 w-px flex-1 bg-muted/30",
    body: "flex-1 gap-1 pb-5",
    topLine: "flex-row items-start justify-between gap-3",
    title: "flex-1 text-base font-semibold text-text",
    duration: "text-base font-bold text-muted",
    meta: "gap-0.5",
    period: "text-sm text-muted",
  },
  variants: {
    isLast: {
      true: { connector: "hidden" },
    },
  },
  defaultVariants: {
    isLast: false,
  },
});

// Selo de envio: fundo claro + texto na cor do estado (success / warning do tema).
const syncStatusBadgeVariants = tv({
  slots: {
    container: "mt-1 flex-row items-center gap-1 self-start rounded-full px-2 py-0.5",
    label: "text-xs font-semibold",
  },
  variants: {
    status: {
      synced: { container: "bg-success/15", label: "text-success" },
      pending: { container: "bg-warning/15", label: "text-warning" },
    },
  },
});

/**
 * EXPORTS
 */
export { syncStatusBadgeVariants, todayRecordRowVariants, todayRecordsVariants };
