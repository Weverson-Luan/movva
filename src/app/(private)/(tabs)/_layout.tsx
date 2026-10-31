/**
 * IMPORTS
 */
import { type BottomTabBarProps, Tabs } from "expo-router/tabs";

import { FloatingTabBar } from "@/modules/navigation/components/floating-tab-bar";
import { useTabBarViewModel } from "@/modules/navigation/presentation/view-model/tab-bar-view-model";
import { useTheme } from "@/shared/brand/BrandProvider";

// Liga o view-model da tab bar ao componente flutuante.
const TabBar = (props: BottomTabBarProps) => {
  return <FloatingTabBar {...useTabBarViewModel(props)} />;
};

// Abas da área logada. A ordem aqui é a ordem na tab bar.
const TabsLayout = () => {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.background } }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="journey" />
      <Tabs.Screen name="documents" />
    </Tabs>
  );
};

/**
 * EXPORTS
 */
export default TabsLayout;
