/**
 * IMPORTS
 */

import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { DaySummaryKind } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

// Um ícone por total: trabalho (pasta), pausas (café, como no card de jornada), total (cronômetro).
const ICON_BY_KIND: Record<DaySummaryKind, ComponentProps<typeof Ionicons>["name"]> = {
  work: "briefcase-outline",
  breaks: "cafe-outline",
  total: "stopwatch-outline",
};

/**
 * EXPORTS
 */
export { ICON_BY_KIND };
