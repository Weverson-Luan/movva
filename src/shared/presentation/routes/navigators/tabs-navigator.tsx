/**
 * IMPORTS
 */
import { type BottomTabBarProps, Tabs } from "expo-router/tabs";

import { useTheme } from "@/shared/brand/BrandProvider";
import { FloatingTabBar } from "@/shared/presentation/routes/components/floating-tab-bar";
import { PRIVATE_ROUTE_KEYS } from "@/shared/presentation/routes/routes";
import { useTabBarViewModel } from "@/shared/presentation/routes/view-model/tab-bar-view-model";

// Liga o view-model da tab bar ao componente flutuante.
const TabBar = (props: BottomTabBarProps) => {
  return <FloatingTabBar {...useTabBarViewModel(props)} />;
};

// Abas da área logada com a tab bar flutuante. A ordem segue PRIVATE_ROUTES (routes.ts).
// Renderizado por src/app/(private)/(tabs)/_layout.tsx: cada nome é um arquivo dessa pasta.
const TabsNavigator = () => {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.background } }}
    >
      {PRIVATE_ROUTE_KEYS.map((name) => (
        <Tabs.Screen key={name} name={name} />
      ))}
    </Tabs>
  );
};

/**
 * EXPORTS
 */
export { TabsNavigator };
