/**
 * IMPORTS
 */
import { useCallback } from "react";
import { Linking } from "react-native";
import { useBrand } from "@/shared/brand/BrandProvider";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";

// Fixos até a API devolver a base do motorista e as notificações.
const HEADER_SUBTITLE = "Jornada • Belo Horizonte - MG";
const HAS_UNREAD_NOTIFICATIONS = true;

// Estado da tela inicial. A view só desenha o que vem daqui.
const useDashboardViewModel = () => {
  const { supportEmail, apiUrl } = useBrand();
  const userName = useUserStore((state) => state.user?.name ?? "");

  const onContactSupport = useCallback(() => {
    void Linking.openURL(`mailto:${supportEmail}`);
  }, [supportEmail]);

  return {
    header: {
      subtitle: HEADER_SUBTITLE,
      userName,
      hasUnreadNotifications: HAS_UNREAD_NOTIFICATIONS,
    },
    apiUrl,
    onContactSupport,
  };
};

type DashboardViewModel = ReturnType<typeof useDashboardViewModel>;

/**
 * EXPORTS
 */
export type { DashboardViewModel };
export { useDashboardViewModel };
