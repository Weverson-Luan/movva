/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_BY_KIND } from "./constants";
import { daySummaryCardVariants } from "./day-summary.variants";
import { DaySummaryValue } from "./day-summary-value";

// typings
import type { DaySummaryCardProps } from "./interface";

// Um total do dia: ícone, valor e rótulo. O valor é uma folha à parte (só ela re-renderiza).
const DaySummaryCard = ({ kind, label, baseMinutes, runningSinceMs }: DaySummaryCardProps) => {
  const theme = useTheme();
  const styles = daySummaryCardVariants();

  return (
    <View className={styles.container()}>
      <Ionicons name={ICON_BY_KIND[kind]} size={20} color={theme.muted} />
      <DaySummaryValue label={label} baseMinutes={baseMinutes} runningSinceMs={runningSinceMs} />
      <Text className={styles.label()} numberOfLines={2} importantForAccessibility="no" accessibilityElementsHidden>
        {label}
      </Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { DaySummaryCard };
