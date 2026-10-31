/**
 * IMPORTS
 */
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { Drawer } from "expo-router/drawer";

import { SideMenu } from "@/modules/navigation/components/side-menu";
import { useSideMenuViewModel } from "@/modules/navigation/presentation/view-model/side-menu-view-model";
import { useTheme } from "@/shared/brand/BrandProvider";

// Liga o view-model do menu ao conteúdo do drawer.
const SideMenuContent = (props: DrawerContentComponentProps) => {
  return <SideMenu {...useSideMenuViewModel(props)} />;
};

// Provedores, CSS e StatusBar já vêm do layout raiz (src/app/_layout.tsx).
// Aqui fica a navegação das telas que exigem login: menu lateral por fora, abas por dentro.
const PrivateLayout = () => {
  const theme = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <SideMenuContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          backgroundColor: theme.surface,
          borderTopRightRadius: theme.radius * 2,
          borderBottomRightRadius: theme.radius * 2,
        },
      }}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
};

/**
 * EXPORTS
 */
export default PrivateLayout;
