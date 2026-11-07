/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Card invertido: fundo na cor de texto do cliente, textos na cor de superfície.
const journeyTodayCardVariants = tv({
  slots: {
    container: "gap-4 rounded-brand bg-text p-6",
    header: "flex-row items-center justify-between gap-3",
    title: "flex-1 text-base text-surface/70",
    worked: "text-[64px] font-bold leading-[72px] text-surface",
    details: "gap-3",
    activityTitle: "text-lg font-semibold text-surface",
  },
});

// Ponto do selo: uma cor por estado da jornada.
const journeyStatusBadgeVariants = tv({
  slots: {
    container: "flex-row items-center gap-2 rounded-full bg-surface/10 px-3 py-1.5",
    dot: "h-2 w-2 rounded-full",
    label: "text-sm font-semibold text-surface",
  },
  variants: {
    status: {
      working: { dot: "bg-success" },
      paused: { dot: "bg-warning" },
      resting: { dot: "bg-surface/50" },
    },
  },
});

const periodElapsedVariants = tv({
  slots: {
    container: "flex-row items-center gap-2",
    label: "flex-1 text-base text-surface/70",
  },
});

/**
 * EXPORTS
 */
export { journeyStatusBadgeVariants, journeyTodayCardVariants, periodElapsedVariants };
