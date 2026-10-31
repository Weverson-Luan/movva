/**
 * IMPORTS
 */

import type { DaySummaryItem, DaySummaryKind } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

type DaySummaryProps = {
  items: DaySummaryItem[];
};

type DaySummaryCardProps = Pick<DaySummaryItem, "label" | "value"> & {
  /** qual total é; define o ícone */
  kind: DaySummaryKind;
};

/**
 * EXPORTS
 */
export type { DaySummaryCardProps, DaySummaryProps };
