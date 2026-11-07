/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Text, View } from "react-native";
import { formatDuration } from "@/modules/dashboard/utils/record-format";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";
import { useElapsedMinutes } from "@/shared/hooks/use-elapsed-minutes";

import { PERIOD_ICON_SIZE } from "./constants";
// typings
import type { PeriodElapsedProps } from "./interface";
import { periodElapsedVariants } from "./journey-today-card.variants";

// Folha isolada: "Período atual desde 09:40 • 2h 02min" — só ela re-renderiza a cada minuto.
const PeriodElapsed = memo(({ sinceLabel, startedAtMs }: PeriodElapsedProps) => {
  const theme = useTheme();
  const styles = periodElapsedVariants();
  const elapsedMinutes = useElapsedMinutes(startedAtMs);

  return (
    <View className={styles.container()}>
      <Ionicons name="timer-outline" size={PERIOD_ICON_SIZE} color={theme.surface} />
      <Text className={styles.label()} numberOfLines={1}>
        {`${sinceLabel} • ${formatDuration(elapsedMinutes)}`}
      </Text>
    </View>
  );
});

PeriodElapsed.displayName = "PeriodElapsed";

/**
 * EXPORTS
 */
export { PeriodElapsed };
