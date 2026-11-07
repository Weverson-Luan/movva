/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Só cores do tema do cliente.
const sideMenuVariants = tv({
  slots: {
    container: "flex-1 px-3 pt-4",
    header: "flex-row items-center justify-between",
    profile: "mt-8 gap-1",
    avatar: "mb-3 h-16 w-16 items-center justify-center rounded-full bg-text",
    avatarText: "text-xl font-bold text-surface",
    name: "text-2xl font-bold text-text",
    subtitle: "text-sm text-muted",
    items: "mt-6 gap-1",
    footer: "mt-auto gap-5 border-t border-muted/20 pt-6",
    support: "flex-row items-center gap-3",
    supportLabel: "text-base font-semibold text-text",
    tagline: "text-xs text-muted",
  },
});

const sideMenuItemVariants = tv({
  slots: {
    row: "flex-row items-center gap-4 rounded-brand px-4 py-4",
    label: "text-base font-semibold",
  },
  variants: {
    state: {
      default: { label: "text-text" },
      active: { row: "bg-primary/10", label: "text-primary" },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

/**
 * EXPORTS
 */
export { sideMenuItemVariants, sideMenuVariants };
