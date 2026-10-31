/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Só cores do tema do cliente.
const daySummaryVariants = tv({
  slots: {
    container: "gap-3",
    title: "text-xl font-bold text-text",
    row: "flex-row gap-3",
  },
});

const daySummaryCardVariants = tv({
  slots: {
    container: "flex-1 gap-2 rounded-brand border border-muted/40 bg-surface p-3",
    value: "text-[28px] font-bold text-text",
    label: "text-sm text-muted",
  },
});

/**
 * EXPORTS
 */
export { daySummaryCardVariants, daySummaryVariants };
