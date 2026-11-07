/**
 * IMPORTS
 */
import * as Linking from "expo-linking";
import { router, usePathname } from "expo-router";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { useBrand } from "@/shared/brand/BrandProvider";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";
import { PRIVATE_ROUTE_KEYS, PRIVATE_ROUTES, type PrivateRoute, ROUTES } from "@/shared/presentation/routes/routes";
import { showErrorToast } from "@/shared/utils/toast";

type SideMenuItem = {
  /** rota do item; a view escolhe o ícone por aqui */
  key: PrivateRoute;
  label: string;
  isActive: boolean;
};

// Estado do menu lateral: usuário, itens com o ativo marcado e ações.
const useSideMenuViewModel = ({ navigation }: DrawerContentComponentProps) => {
  const userName = useUserStore((state) => state.user?.name ?? "");
  const { supportEmail, tagline } = useBrand();
  const pathname = usePathname();

  const items: SideMenuItem[] = PRIVATE_ROUTE_KEYS.map((key) => ({
    key,
    label: PRIVATE_ROUTES[key].menuLabel,
    isActive: pathname === ROUTES[key],
  }));

  const onClose = () => navigation.closeDrawer();

  const onPressItem = (key: PrivateRoute) => {
    navigation.closeDrawer();
    router.navigate(ROUTES[key]);
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
