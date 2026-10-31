/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Card invertido: fundo na cor de texto do cliente, textos na cor de superfície.
const journeyTodayCardVariants = tv({
  slots: {
    container: "gap-5 rounded-brand bg-text p-6",
    header: "flex-row items-center justify-between gap-3",
    title: "flex-1 text-lg font-semibold text-surface",
    hero: "flex-row items-center justify-between gap-3",
    heroTexts: "flex-1 gap-1",
    worked: "text-[44px] font-bold leading-[52px] text-surface",
    workedCaption: "text-base text-surface/70",
    meta: "flex-row flex-wrap items-center gap-x-6 gap-y-2",
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

const journeyMetaItemVariants = tv({
  slots: {
    container: "flex-row items-center gap-2 opacity-70",
    label: "text-base text-surface",
  },
});

/**
 * EXPORTS
 */
export { journeyMetaItemVariants, journeyStatusBadgeVariants, journeyTodayCardVariants };
