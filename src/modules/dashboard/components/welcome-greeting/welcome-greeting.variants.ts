/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// `tone` muda só a mensagem: cinza no normal, `warning` do tema quando pede atenção.
const welcomeGreetingVariants = tv({
  slots: {
    container: "gap-1",
    date: "text-sm uppercase tracking-wide text-muted",
    title: "text-[32px] font-bold leading-10 text-text",
    message: "text-base",
  },
  variants: {
    tone: {
      default: { message: "text-muted" },
      warning: { message: "text-warning" },
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

/**
 * EXPORTS
 */
export { welcomeGreetingVariants };
