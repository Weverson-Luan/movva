/**
 * IMPORTS
 */
import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { PrivateRoute } from "./routes";

type RouteIconName = ComponentProps<typeof Ionicons>["name"];

// Um ícone por rota, o mesmo na tab bar e no menu lateral.
const ROUTE_ICON: Record<PrivateRoute, RouteIconName> = {
  dashboard: "home-outline",
  journey: "timer-outline",
  documents: "document-text-outline",
};

// Largura do menu lateral (o padrão do Drawer ocupa ~86% da tela no celular).
const DRAWER_WIDTH = "75%";

/**
 * EXPORTS
 */
export type { RouteIconName };
export { DRAWER_WIDTH, ROUTE_ICON };
