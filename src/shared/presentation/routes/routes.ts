/**
 * IMPORTS
 */
import type { Href } from "expo-router";

// Fonte única dos caminhos do app. Grupos como (private) e (tabs) não entram na URL,
// então o mesmo valor serve para navegar (router.*) e para comparar com usePathname().
// Rota nova: crie o arquivo em src/app/ e registre aqui.
const ROUTES = {
  splash: "/",
  signin: "/signin",
  signinUp: "/signin-up",
  onboarding: "/onboarding",
  sync: "/sync",
  dashboard: "/dashboard",
  journey: "/journey",
  documents: "/documents",
} as const satisfies Record<string, Href>;

// Área logada: o nome é o arquivo da rota em src/app/(private)/(tabs)/.
type PrivateRoute = "dashboard" | "journey" | "documents";

type PrivateRouteConfig = {
  /** rótulo na tab bar flutuante */
  tabLabel: string;
  /** rótulo no menu lateral */
  menuLabel: string;
};

// A ordem aqui é a ordem no menu lateral; a da tab bar segue o Tabs (navigators/tabs-navigator.tsx).
const PRIVATE_ROUTES: Record<PrivateRoute, PrivateRouteConfig> = {
  dashboard: { tabLabel: "Início", menuLabel: "Início" },
  journey: { tabLabel: "Jornada", menuLabel: "Resumo Jornada" },
  documents: { tabLabel: "Documentos", menuLabel: "Documentos" },
};

const PRIVATE_ROUTE_KEYS = Object.keys(PRIVATE_ROUTES) as PrivateRoute[];

const isPrivateRoute = (name: string): name is PrivateRoute => name in PRIVATE_ROUTES;

/**
 * EXPORTS
 */
export type { PrivateRoute, PrivateRouteConfig };
export { isPrivateRoute, PRIVATE_ROUTE_KEYS, PRIVATE_ROUTES, ROUTES };
