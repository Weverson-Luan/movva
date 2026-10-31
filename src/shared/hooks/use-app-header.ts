/**
 * IMPORTS
 */
import { useNavigation } from "expo-router";
import type { DrawerNavigationProp } from "expo-router/drawer";
import type { ParamListBase } from "expo-router/react-navigation";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";

// Fixo até a API devolver as notificações.
const HAS_UNREAD_NOTIFICATIONS = true;

// Props do AppHeader comuns às telas logadas: usuário e abertura do menu lateral.
// As abas ficam dentro do Drawer; o openDrawer sobe até ele.
const useAppHeader = (subtitle?: string) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const userName = useUserStore((state) => state.user?.name ?? "");

  return {
    subtitle,
    userName,
    hasUnreadNotifications: HAS_UNREAD_NOTIFICATIONS,
    onPressMenu: () => navigation.openDrawer(),
    onPressAvatar: () => navigation.openDrawer(),
  };
};

/**
 * EXPORTS
 */
export { useAppHeader };
