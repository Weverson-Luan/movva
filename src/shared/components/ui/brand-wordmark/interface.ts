/**
 * IMPORTS
 */

import type { VariantProps } from "tailwind-variants";
import type { brandWordmarkVariants } from "./brand-wordmark.variants";

type BrandWordmarkProps = VariantProps<typeof brandWordmarkVariants> & {
  /** linha de contexto abaixo da marca (ex.: "Jornada • Belo Horizonte - MG"); sai em caixa alta */
  subtitle?: string;
  /** classes extras do container (ex.: margem) */
  className?: string;
};

/**
 * EXPORTS
 */
export type { BrandWordmarkProps };
