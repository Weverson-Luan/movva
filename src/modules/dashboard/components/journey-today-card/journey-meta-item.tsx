/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { META_ICON_SIZE } from "./constants";
// typings
import type { JourneyMetaItemProps } from "./interface";
import { journeyMetaItemVariants } from "./journey-today-card.variants";

// Detalhe da jornada com ícone (ex.: "Início 07:00").
const JourneyMetaItem = ({ icon, label }: JourneyMetaItemProps) => {
  const theme = useTheme();
  const styles = journeyMetaItemVariants();

  return (
    <View className={styles.container()}>
      <Ionicons name={icon} size={META_ICON_SIZE} color={theme.surface} />
      <Text className={styles.label()}>{label}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { JourneyMetaItem };
