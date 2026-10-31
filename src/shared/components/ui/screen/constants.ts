/**
 * IMPORTS
 */

import type { ScreenEdge } from "./interface";

// Respiro entre o fim do conteúdo e a barra de navegação: igual em todas as telas.
const SCREEN_BOTTOM_GAP = 16;

const DEFAULT_EDGES: ScreenEdge[] = ["top", "bottom"];

/**
 * EXPORTS
 */
export { DEFAULT_EDGES, SCREEN_BOTTOM_GAP };
