/**
 * IMPORTS
 */

import type { DaySummaryItem, DaySummaryKind } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

type DaySummaryProps = {
  items: DaySummaryItem[];
};

type DaySummaryCardProps = Pick<DaySummaryItem, "label" | "baseMinutes" | "runningSinceMs"> & {
  /** qual total é; define o ícone */
  kind: DaySummaryKind;
};

type DaySummaryValueProps = Pick<DaySummaryItem, "label" | "baseMinutes" | "runningSinceMs">;

/**
 * EXPORTS
 */
export type { DaySummaryCardProps, DaySummaryProps, DaySummaryValueProps };
