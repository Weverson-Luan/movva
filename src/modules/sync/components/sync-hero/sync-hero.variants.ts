/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

const syncHeroVariants = tv({
  slots: {
    container: "h-64 w-64 items-center justify-center",
    layer: "absolute inset-0 items-center justify-center",
    ring: "h-28 w-28 rounded-full border-2 border-primary",
    badge: "h-28 w-28 items-center justify-center rounded-full bg-primary",
  },
});

/**
 * EXPORTS
 */
export { syncHeroVariants };
