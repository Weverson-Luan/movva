/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_BY_ROUTE } from "./constants";
import { floatingTabBarItemVariants } from "./floating-tab-bar.variants";
// typings
import type { FloatingTabBarItemProps } from "./interface";

// Uma aba: ícone com destaque em pílula quando ativa + rótulo.
const FloatingTabBarItem = ({ item, onPress }: FloatingTabBarItemProps) => {
  const theme = useTheme();
  const styles = floatingTabBarItemVariants({ state: item.isFocused ? "focused" : "default" });

  return (
    <TouchableOpacity
      className={styles.button()}
      onPress={() => onPress(item.key)}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: item.isFocused }}
    >
      <View className={styles.iconWrapper()}>
        <Ionicons name={ICON_BY_ROUTE[item.key]} size={24} color={item.isFocused ? theme.primary : theme.text} />
      </View>
      <Text className={styles.label()}>{item.label}</Text>
    </TouchableOpacity>
  );
};

/**
 * EXPORTS
 */
export { FloatingTabBarItem };
