/**
 * IMPORTS
 */
import { Drawer } from "expo-router/drawer";

import { useTheme } from "@/shared/brand/BrandProvider";
import { DRAWER_WIDTH } from "@/shared/presentation/routes/constants";

//
import { SideMenuContent } from "./side-menu-content";

// Menu lateral da área logada; por dentro ficam as abas (tabs-navigator).
// Renderizado por src/app/(private)/_layout.tsx: os nomes das telas são relativos a essa pasta.
const DrawerNavigator = () => {
  const theme = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <SideMenuContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: DRAWER_WIDTH,
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
export { DrawerNavigator };
