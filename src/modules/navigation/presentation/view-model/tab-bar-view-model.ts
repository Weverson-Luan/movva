/**
 * IMPORTS
 */
import type { BottomTabBarProps } from "expo-router/tabs";
import { isPrivateRoute, type PrivateRoute } from "./private-routes";

type TabBarItem = {
  /** rota da aba; a view escolhe o ícone por aqui */
  key: PrivateRoute;
  label: string;
  isFocused: boolean;
};

const TAB_LABEL: Record<PrivateRoute, string> = {
  dashboard: "Início",
  journey: "Jornada",
  documents: "Documentos",
};

// Estado da tab bar flutuante a partir do navegador de abas.
const useTabBarViewModel = ({ state, emitter, navigateToTab, insets }: BottomTabBarProps) => {
  const focusedName = state.routes[state.index]?.name;

  const items: TabBarItem[] = state.routes
    .filter((route) => isPrivateRoute(route.name))
    .map((route) => ({
      key: route.name as PrivateRoute,
      label: TAB_LABEL[route.name as PrivateRoute],
      isFocused: route.name === focusedName,
    }));

  // Mesmo contrato da tab bar padrão: avisa o tabPress e só navega se ninguém impediu.
  const onPressTab = (key: PrivateRoute) => {
    const route = state.routes.find((item) => item.name === key);
    if (!route) return;

    const event = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (key !== focusedName && !event.defaultPrevented) {
      navigateToTab(route.key);
    }
  };

  return {
    items,
    bottomInset: insets.bottom,
    onPressTab,
  };
};

type TabBarViewModel = ReturnType<typeof useTabBarViewModel>;

/**
 * EXPORTS
 */
export type { TabBarItem, TabBarViewModel };
export { useTabBarViewModel };
