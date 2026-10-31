/**
 * IMPORTS
 */
import { memo } from "react";
import { Text } from "react-native";
import { formatClockDuration } from "@/modules/dashboard/utils/record-format";
import { useElapsedMinutes } from "@/shared/hooks/use-elapsed-minutes";

import { daySummaryCardVariants } from "./day-summary.variants";

// typings
import type { DaySummaryValueProps } from "./interface";

// Folha isolada: só este texto re-renderiza a cada minuto, e só se o total estiver
// correndo (`runningSinceMs`). Total parado → hook sem timer, nenhum re-render.
const DaySummaryValue = memo(({ label, baseMinutes, runningSinceMs }: DaySummaryValueProps) => {
  const styles = daySummaryCardVariants();
  const elapsedMinutes = useElapsedMinutes(runningSinceMs);
  const value = formatClockDuration(baseMinutes + elapsedMinutes);

  return (
    <Text className={styles.value()} numberOfLines={1} adjustsFontSizeToFit accessibilityLabel={`${label}: ${value}`}>
      {value}
    </Text>
  );
});

DaySummaryValue.displayName = "DaySummaryValue";

/**
 * EXPORTS
 */
export { DaySummaryValue };
