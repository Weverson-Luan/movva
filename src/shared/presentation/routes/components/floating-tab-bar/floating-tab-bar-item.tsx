/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/shared/brand/BrandProvider";

import { ROUTE_ICON } from "@/shared/presentation/routes/constants";
import { floatingTabBarItemVariants } from "./floating-tab-bar.variants";
// typings
import type { FloatingTabBarItemProps } from "./interface";

// Uma aba: ícone + rótulo; ativa mostra só o ícone na pílula.
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
      {/* key pelo estado: remonta a pílula ao trocar de aba. No Android (nova arquitetura) o fundo
          aplicado depois da montagem perde o raio e a pílula fica quadrada. */}
      <View key={item.isFocused ? "focused" : "default"} className={styles.iconWrapper()}>
        <Ionicons name={ROUTE_ICON[item.key]} size={24} color={item.isFocused ? theme.primary : theme.text} />
      </View>
      {/* Ativa: só a pílula; o nome segue no accessibilityLabel. */}
      {item.isFocused ? null : <Text className={styles.label()}>{item.label}</Text>}
    </TouchableOpacity>
  );
};

/**
 * EXPORTS
 */
export { FloatingTabBarItem };
