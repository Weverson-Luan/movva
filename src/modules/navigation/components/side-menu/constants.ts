/**
 * IMPORTS
 */
import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { ViewStyle } from "react-native";
import type { PrivateRoute } from "@/modules/navigation/presentation/view-model/private-routes";

const ICON_BY_ROUTE: Record<PrivateRoute, ComponentProps<typeof Ionicons>["name"]> = {
  dashboard: "home-outline",
  journey: "speedometer-outline",
  documents: "document-text-outline",
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// className não chega no contentContainer do DrawerContentScrollView;
// flexGrow deixa o rodapé no fim mesmo com poucos itens.
const SCROLL_CONTENT_STYLE: ViewStyle = { flexGrow: 1 };

/**
 * EXPORTS
 */
export { HIT_SLOP, ICON_BY_ROUTE, SCROLL_CONTENT_STYLE };
