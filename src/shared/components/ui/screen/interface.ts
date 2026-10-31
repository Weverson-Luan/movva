/**
 * IMPORTS
 */

import type { ReactNode } from "react";

type ScreenEdge = "top" | "bottom";

type ScreenProps = {
  children: ReactNode;
  /** cabeçalho fixo acima do conteúdo (ex.: AppHeader); ele mesmo protege o topo */
  header?: ReactNode;
  /** bordas protegidas pela área segura; padrão: as duas */
  edges?: ScreenEdge[];
  /** conteúdo rola; termina acima da barra de navegação */
  scroll?: boolean;
  /** sobe o conteúdo com o teclado e fecha o teclado ao tocar fora */
  keyboard?: boolean;
  /** classes da raiz */
  className?: string;
  /** classes do conteúdo (layout, gap, padding horizontal) */
  contentClassName?: string;
};

/**
 * EXPORTS
 */
export type { ScreenEdge, ScreenProps };
