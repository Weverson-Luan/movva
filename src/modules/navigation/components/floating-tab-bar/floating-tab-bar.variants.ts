/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Pílula flutuante sobre o fundo da tela; só cores do tema.
const floatingTabBarVariants = tv({
  slots: {
    container: "bg-background px-5 pt-2",
    bar: "flex-row items-center justify-between rounded-3xl bg-surface px-3 py-2 shadow-lg",
  },
});

const floatingTabBarItemVariants = tv({
  slots: {
    button: "flex-1 items-center gap-1 py-1",
    iconWrapper: "h-9 w-14 items-center justify-center rounded-full",
    label: "text-sm font-semibold",
  },
  variants: {
    state: {
      default: { label: "text-text" },
      focused: { iconWrapper: "bg-primary/10", label: "text-primary" },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

/**
 * EXPORTS
 */
export { floatingTabBarItemVariants, floatingTabBarVariants };
