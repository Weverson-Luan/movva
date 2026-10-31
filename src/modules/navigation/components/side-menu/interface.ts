/**
 * IMPORTS
 */
import type { PrivateRoute } from "@/modules/navigation/presentation/view-model/private-routes";
import type { SideMenuItem } from "@/modules/navigation/presentation/view-model/side-menu-view-model";

type SideMenuProps = {
  /** nome do usuário; vira as iniciais do avatar */
  userName: string;
  /** linha abaixo do nome (ex.: "Seu registro de jornada") */
  subtitle: string;
  /** frase do cliente no rodapé */
  tagline: string;
  items: SideMenuItem[];
  onClose: () => void;
  onPressItem: (key: PrivateRoute) => void;
  onPressSupport: () => void;
};

type SideMenuItemRowProps = {
  item: SideMenuItem;
  onPress: (key: PrivateRoute) => void;
};

/**
 * EXPORTS
 */
export type { SideMenuItemRowProps, SideMenuProps };
