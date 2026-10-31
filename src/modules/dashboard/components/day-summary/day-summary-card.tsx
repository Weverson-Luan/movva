/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_BY_KIND } from "./constants";
import { daySummaryCardVariants } from "./day-summary.variants";

// typings
import type { DaySummaryCardProps } from "./interface";

// Um total do dia: ícone, valor e rótulo. Leitor de tela lê como uma frase ("Pausas: 00:30").
const DaySummaryCard = ({ kind, label, value }: DaySummaryCardProps) => {
  const theme = useTheme();
  const styles = daySummaryCardVariants();

  return (
    <View className={styles.container()} accessible accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={ICON_BY_KIND[kind]} size={20} color={theme.muted} />
      <Text className={styles.value()} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text className={styles.label()} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { DaySummaryCard };
