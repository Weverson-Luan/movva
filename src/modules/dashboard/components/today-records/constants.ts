/**
 * IMPORTS
 */

import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type {
  TodayRecordSyncStatus,
  TodayRecordType,
} from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

// Um ícone por tipo: operação (play), refeição (café), entrada na jornada (log-in).
const ICON_BY_TYPE: Record<TodayRecordType, ComponentProps<typeof Ionicons>["name"]> = {
  operation: "play-outline",
  meal: "cafe-outline",
  "clock-in": "log-in-outline",
};

const RECORD_ICON_SIZE = 18;

// Selo de envio: texto e ícone por estado (a cor vem do variants).
const SYNC_BADGE: Record<TodayRecordSyncStatus, { label: string; icon: ComponentProps<typeof Ionicons>["name"] }> = {
  synced: { label: "Sincronizada", icon: "cloud-done-outline" },
  pending: { label: "Pendente", icon: "cloud-upload-outline" },
};

const SYNC_BADGE_ICON_SIZE = 14;

/**
 * EXPORTS
 */
export { ICON_BY_TYPE, RECORD_ICON_SIZE, SYNC_BADGE, SYNC_BADGE_ICON_SIZE };
