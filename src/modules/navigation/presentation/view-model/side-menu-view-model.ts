/**
 * IMPORTS
 */
import * as Linking from "expo-linking";
import { router, usePathname } from "expo-router";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { useBrand } from "@/shared/brand/BrandProvider";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";
import { showErrorToast } from "@/shared/utils/toast";
import { PRIVATE_ROUTE_HREF, PRIVATE_ROUTE_PATH, type PrivateRoute } from "./private-routes";

type SideMenuItem = {
  /** rota do item; a view escolhe o ícone por aqui */
  key: PrivateRoute;
  label: string;
  isActive: boolean;
};

const MENU_ITEMS: { key: PrivateRoute; label: string }[] = [
  { key: "dashboard", label: "Início" },
  { key: "journey", label: "Resumo Jornada" },
  { key: "documents", label: "Documentos" },
];

// Estado do menu lateral: usuário, itens com o ativo marcado e ações.
const useSideMenuViewModel = ({ navigation }: DrawerContentComponentProps) => {
  const userName = useUserStore((state) => state.user?.name ?? "");
  const { supportEmail, tagline } = useBrand();
  const pathname = usePathname();

  const items: SideMenuItem[] = MENU_ITEMS.map((item) => ({
    ...item,
    isActive: pathname === PRIVATE_ROUTE_PATH[item.key],
  }));

  const onClose = () => navigation.closeDrawer();

  const onPressItem = (key: PrivateRoute) => {
    navigation.closeDrawer();
    router.navigate(PRIVATE_ROUTE_HREF[key]);
  };

  // Sem app de e-mail o openURL falha: mostra o toast em vez de engolir o erro.
  const onPressSupport = () => {
    Linking.openURL(`mailto:${supportEmail}`).catch(showErrorToast);
  };

  return {
    userName,
    subtitle: "Seu registro de jornada",
    tagline,
    items,
    onClose,
    onPressItem,
    onPressSupport,
  };
};

type SideMenuViewModel = ReturnType<typeof useSideMenuViewModel>;

/**
 * EXPORTS
 */
export type { SideMenuItem, SideMenuViewModel };
export { useSideMenuViewModel };
