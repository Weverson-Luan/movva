/**
 * IMPORTS
 */
import { DrawerNavigator } from "@/shared/presentation/routes/navigators/drawer-navigator";

// Área logada: menu lateral por fora, abas por dentro. Configuração em shared/presentation/routes.
const PrivateLayout = () => {
  return <DrawerNavigator />;
};

/**
 * EXPORTS
 */
export default PrivateLayout;
