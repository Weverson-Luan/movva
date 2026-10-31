/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Só cores do tema do cliente. O fundo `surface` se estende por trás da status bar.
const appHeaderVariants = tv({
  slots: {
    container: "bg-surface",
    content: "flex-row items-center gap-4 px-5 py-4",
    menuButton: "h-11 w-11 items-center justify-center rounded-brand border border-muted/20 bg-surface",
    brand: "ml-2 flex-1",
    actions: "flex-row items-center gap-4",
    bellButton: "h-10 w-10 items-center justify-center",
    bellDot: "absolute right-2 top-1.5 h-2 w-2 rounded-full bg-primary",
    avatar: "h-11 w-11 items-center justify-center rounded-full bg-text",
    avatarText: "text-sm font-bold text-surface",
  },
});

/**
 * EXPORTS
 */
export { appHeaderVariants };
