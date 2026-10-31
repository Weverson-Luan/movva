/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_BY_ROUTE } from "./constants";
// typings
import type { SideMenuItemRowProps } from "./interface";
import { sideMenuItemVariants } from "./side-menu.variants";

// Linha de navegação do menu; a ativa ganha fundo e cor primária.
const SideMenuItemRow = ({ item, onPress }: SideMenuItemRowProps) => {
  const theme = useTheme();
  const styles = sideMenuItemVariants({ state: item.isActive ? "active" : "default" });

  return (
    <TouchableOpacity
      className={styles.row()}
      onPress={() => onPress(item.key)}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: item.isActive }}
    >
      <Ionicons name={ICON_BY_ROUTE[item.key]} size={24} color={item.isActive ? theme.primary : theme.muted} />
      <Text className={styles.label()}>{item.label}</Text>
    </TouchableOpacity>
  );
};

/**
 * EXPORTS
 */
export { SideMenuItemRow };
