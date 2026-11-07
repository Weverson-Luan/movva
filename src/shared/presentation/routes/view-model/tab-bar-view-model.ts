/**
 * IMPORTS
 */
import type { BottomTabBarProps } from "expo-router/tabs";
import { isPrivateRoute, PRIVATE_ROUTES, type PrivateRoute } from "@/shared/presentation/routes/routes";

type TabBarItem = {
  /** rota da aba; a view escolhe o ícone por aqui */
  key: PrivateRoute;
  label: string;
  isFocused: boolean;
};

// Estado da tab bar flutuante a partir do navegador de abas.
const useTabBarViewModel = ({ state, emitter, navigateToTab, insets }: BottomTabBarProps) => {
  const focusedName = state.routes[state.index]?.name;

  const items: TabBarItem[] = state.routes
    .map((route) => route.name)
    .filter(isPrivateRoute)
    .map((key) => ({
      key,
      label: PRIVATE_ROUTES[key].tabLabel,
      isFocused: key === focusedName,
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
