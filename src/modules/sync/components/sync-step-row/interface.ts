/**
 * IMPORTS
 */

import type { SyncStepItem } from "@/modules/sync/presentation/view-model/sync-view-model";

type SyncStepRowProps = {
  step: SyncStepItem;
  /** posição na lista; define o atraso da entrada em cascata */
  index: number;
};

type SyncStepIconProps = Pick<SyncStepItem, "status">;

/**
 * EXPORTS
 */
export type { SyncStepIconProps, SyncStepRowProps };
