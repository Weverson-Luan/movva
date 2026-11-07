/**
 * IMPORTS
 */
import { View } from "react-native";

import { TAB_BAR_BOTTOM_GAP } from "./constants";
import { floatingTabBarVariants } from "./floating-tab-bar.variants";
import { FloatingTabBarItem } from "./floating-tab-bar-item";
// typings
import type { FloatingTabBarProps } from "./interface";

// Tab bar da área logada: pílula flutuante acima da barra de navegação do sistema.
const FloatingTabBar = ({ items, bottomInset, onPressTab }: FloatingTabBarProps) => {
  const styles = floatingTabBarVariants();

  return (
    <View className={styles.container()} style={{ paddingBottom: bottomInset + TAB_BAR_BOTTOM_GAP }}>
      <View className={styles.bar()} accessibilityRole="tablist">
        {items.map((item) => (
          <FloatingTabBarItem key={item.key} item={item} onPress={onPressTab} />
        ))}
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { FloatingTabBar };
