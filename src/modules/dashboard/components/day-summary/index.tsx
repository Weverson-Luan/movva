/**
 * IMPORTS
 */
import { Text, View } from "react-native";
import { daySummaryVariants } from "./day-summary.variants";
import { DaySummaryCard } from "./day-summary-card";

// typings
import type { DaySummaryProps } from "./interface";

// "Resumo do dia": um cartão por total (trabalho, pausas...), lado a lado.
const DaySummary = ({ items }: DaySummaryProps) => {
  const styles = daySummaryVariants();

  return (
    <View className={styles.container()}>
      <Text className={styles.title()} accessibilityRole="header">
        Resumo do dia
      </Text>
      <View className={styles.row()}>
        {items.map((item) => (
          <DaySummaryCard
            key={item.key}
            kind={item.key}
            label={item.label}
            baseMinutes={item.baseMinutes}
            runningSinceMs={item.runningSinceMs}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { DaySummary };
