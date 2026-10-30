/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Só cores do tema do cliente (tailwind.config.js), nunca cores fixas.
// A cor da borda fica só no `state` para não haver duas classes de borda brigando.
const inputVariants = tv({
  slots: {
    container: "w-full gap-1",
    wrapper: "flex-row items-center gap-3 border-b pb-2",
    input: "flex-1 bg-transparent py-1 text-base text-text",
    label: "text-xs font-semibold text-muted",
    error: "text-sm text-danger",
  },
  variants: {
    state: {
      default: { wrapper: "border-muted/40" },
      focused: { wrapper: "border-primary" },
      error: { wrapper: "border-danger", label: "text-danger" },
    },
    isDisabled: {
      true: { container: "opacity-50" },
    },
  },
  defaultVariants: {
    state: "default",
    isDisabled: false,
  },
});

/**
 * EXPORTS
 */
export { inputVariants };
