/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// A largura da imagem sai da proporção do wordmark de cada cliente; aqui só a altura.
const brandWordmarkVariants = tv({
  slots: {
    container: "items-start gap-2",
    image: "",
    subtitle: "uppercase tracking-wide text-muted",
  },
  variants: {
    size: {
      sm: { image: "h-6", subtitle: "text-xs" },
      md: { image: "h-8", subtitle: "text-sm" },
      lg: { image: "h-12", subtitle: "text-base" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * EXPORTS
 */
export { brandWordmarkVariants };
