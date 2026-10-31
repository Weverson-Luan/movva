/**
 * IMPORTS
 */
import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { PrivateRoute } from "@/modules/navigation/presentation/view-model/private-routes";

const ICON_BY_ROUTE: Record<PrivateRoute, ComponentProps<typeof Ionicons>["name"]> = {
  dashboard: "home-outline",
  journey: "timer-outline",
  documents: "document-text-outline",
};

// Respiro entre a pílula e a barra de navegação do sistema.
const TAB_BAR_BOTTOM_GAP = 12;

/**
 * EXPORTS
 */
export { ICON_BY_ROUTE, TAB_BAR_BOTTOM_GAP };
