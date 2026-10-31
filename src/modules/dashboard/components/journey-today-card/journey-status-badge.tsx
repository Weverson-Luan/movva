/**
 * IMPORTS
 */
import { Text, View } from "react-native";
// typings
import type { JourneyStatusBadgeProps } from "./interface";
import { journeyStatusBadgeVariants } from "./journey-today-card.variants";

// Selo do estado atual (ex.: "● Em trabalho").
const JourneyStatusBadge = ({ status, label }: JourneyStatusBadgeProps) => {
  const styles = journeyStatusBadgeVariants({ status });

  return (
    <View className={styles.container()} accessible accessibilityLabel={`Status: ${label}`}>
      <View className={styles.dot()} />
      <Text className={styles.label()}>{label}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { JourneyStatusBadge };
