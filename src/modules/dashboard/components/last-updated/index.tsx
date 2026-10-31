/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { LAST_UPDATED_ICON_SIZE } from "./constants";
// typings
import type { LastUpdatedProps } from "./interface";
import { lastUpdatedVariants } from "./last-updated.variants";

// Rodapé da tela inicial: quando os dados foram atualizados pela última vez.
const LastUpdated = ({ label }: LastUpdatedProps) => {
  const theme = useTheme();
  const styles = lastUpdatedVariants();

  return (
    <View className={styles.container()} accessible accessibilityLabel={label}>
      <Ionicons name="sync-outline" size={LAST_UPDATED_ICON_SIZE} color={theme.muted} />
      <Text className={styles.label()}>{label}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { LastUpdated };
