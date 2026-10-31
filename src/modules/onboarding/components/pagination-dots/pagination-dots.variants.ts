/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

const paginationDotsVariants = tv({
  slots: {
    container: "flex-row items-center justify-center gap-2",
    dot: "h-2 w-full rounded-full bg-primary",
  },
});

/**
 * EXPORTS
 */
export { paginationDotsVariants };
