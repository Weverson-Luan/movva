/**
 * IMPORTS
 */
import type { Href } from "expo-router";

// Abas da área logada: o nome é o arquivo da rota em src/app/(private)/(tabs)/.
type PrivateRoute = "dashboard" | "journey" | "documents";

const PRIVATE_ROUTE_HREF: Record<PrivateRoute, Href> = {
  dashboard: "/(private)/(tabs)/dashboard",
  journey: "/(private)/(tabs)/journey",
  documents: "/(private)/(tabs)/documents",
};

// Caminho como o usePathname devolve (grupos não entram na URL).
const PRIVATE_ROUTE_PATH: Record<PrivateRoute, string> = {
  dashboard: "/dashboard",
  journey: "/journey",
  documents: "/documents",
};

const isPrivateRoute = (name: string): name is PrivateRoute => name in PRIVATE_ROUTE_HREF;

/**
 * EXPORTS
 */
export type { PrivateRoute };
export { isPrivateRoute, PRIVATE_ROUTE_HREF, PRIVATE_ROUTE_PATH };
