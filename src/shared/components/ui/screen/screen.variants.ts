/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

const screenVariants = tv({
  slots: {
    root: "flex-1 bg-background",
    keyboard: "flex-1",
    body: "flex-1",
    scrollContainer: "flex-grow",
    content: "flex-1",
    scrollContent: "flex-grow",
  },
});

/**
 * EXPORTS
 */
export { screenVariants };
