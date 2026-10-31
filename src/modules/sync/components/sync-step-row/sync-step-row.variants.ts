/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Uma propriedade visual por estado da etapa.
const syncStepRowVariants = tv({
  slots: {
    container: "flex-row items-center gap-3",
    iconBox: "h-6 w-6 items-center justify-center",
    label: "flex-1 text-base",
  },
  variants: {
    status: {
      pending: { label: "text-muted" },
      running: { label: "font-semibold text-text" },
      done: { label: "text-text" },
    },
  },
});

/**
 * EXPORTS
 */
export { syncStepRowVariants };
