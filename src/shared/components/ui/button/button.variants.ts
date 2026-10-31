/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Só cores do tema do cliente (tailwind.config.js), nunca cores fixas.
const buttonVariants = tv({
  slots: {
    container: "h-button w-full flex-row items-center justify-center gap-2 rounded-brand px-5",
    label: "text-base font-semibold",
  },
  variants: {
    variant: {
      solid: { container: "bg-primary", label: "text-primary-text" },
      ghost: { container: "bg-transparent", label: "text-primary" },
    },
    isDisabled: {
      true: { container: "opacity-50" },
    },
  },
  defaultVariants: {
    variant: "solid",
    isDisabled: false,
  },
});

/**
 * EXPORTS
 */
export { buttonVariants };
