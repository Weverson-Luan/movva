/**
 * IMPORTS
 */

import type {
  TodayRecordItem,
  TodayRecordSyncStatus,
} from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

type TodayRecordsProps = {
  items: TodayRecordItem[];
  /** abre o histórico completo */
  onPressHistory?: () => void;
};

type TodayRecordRowProps = {
  record: TodayRecordItem;
  /** último da lista: sem linha ligando ao próximo */
  isLast: boolean;
};

type SyncStatusBadgeProps = {
  status: TodayRecordSyncStatus;
};

/**
 * EXPORTS
 */
export type { SyncStatusBadgeProps, TodayRecordRowProps, TodayRecordsProps };
