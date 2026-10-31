/**
 * IMPORTS
 */
import type { PrivateRoute } from "@/modules/navigation/presentation/view-model/private-routes";
import type { TabBarItem } from "@/modules/navigation/presentation/view-model/tab-bar-view-model";

type FloatingTabBarProps = {
  items: TabBarItem[];
  /** área segura da base (barra de gestos / navegação) */
  bottomInset: number;
  onPressTab: (key: PrivateRoute) => void;
};

type FloatingTabBarItemProps = {
  item: TabBarItem;
  onPress: (key: PrivateRoute) => void;
};

/**
 * EXPORTS
 */
export type { FloatingTabBarItemProps, FloatingTabBarProps };
