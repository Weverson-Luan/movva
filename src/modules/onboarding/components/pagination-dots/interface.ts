/**
 * IMPORTS
 */

import type { SharedValue } from "react-native-reanimated";

type PaginationDotsProps = {
  items: { key: string }[];
  width: number;
  /** posição horizontal da lista (px) */
  scrollX: SharedValue<number>;
};

type PaginationDotProps = Pick<PaginationDotsProps, "width" | "scrollX"> & {
  index: number;
};

/**
 * EXPORTS
 */
export type { PaginationDotProps, PaginationDotsProps };
