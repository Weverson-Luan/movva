/**
 * IMPORTS
 */

import type { DrawerContentComponentProps } from "expo-router/build/layouts/Drawer.js";
import { SideMenu } from "../components/side-menu";
import { useSideMenuViewModel } from "../view-model/side-menu-view-model";

const SideMenuContent = (props: DrawerContentComponentProps) => {
  return <SideMenu {...useSideMenuViewModel(props)} />;
};

/**
 * EXPORTS
 */
export { SideMenuContent };
