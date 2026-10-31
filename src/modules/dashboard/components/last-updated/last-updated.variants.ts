/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

const lastUpdatedVariants = tv({
  slots: {
    container: "mt-2 flex-row items-center justify-center gap-1.5",
    label: "text-xs text-muted",
  },
});

/**
 * EXPORTS
 */
export { lastUpdatedVariants };
