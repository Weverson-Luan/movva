/**
 * IMPORTS
 */

import { tv } from "tailwind-variants";

// Só cores do tema: os blobs usam o primary do cliente bem transparente.
const onboardingSlideVariants = tv({
  slots: {
    container: "flex-1 items-center justify-center gap-10 px-8",
    stage: "h-80 w-80 items-center justify-center",
    layer: "absolute inset-0 items-center justify-center",
    outerBlob: "h-80 w-80 rounded-full bg-primary/5",
    innerBlob: "h-64 w-64 rounded-full bg-primary/5",
    image: "h-80 w-80",
    texts: "items-center gap-3",
    title: "text-center text-3xl font-bold text-text",
    description: "text-center text-base text-muted",
  },
});

/**
 * EXPORTS
 */
export { onboardingSlideVariants };
