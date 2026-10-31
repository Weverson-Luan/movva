/**
 * IMPORTS
 */
import { memo } from "react";
import { Text } from "react-native";
import { formatWorkedDuration } from "@/modules/dashboard/utils/record-format";
import { useElapsedMinutes } from "@/shared/hooks/use-elapsed-minutes";
// typings
import type { WorkedDurationProps } from "./interface";
import { journeyTodayCardVariants } from "./journey-today-card.variants";

// Folha isolada: é o ÚNICO trecho que re-renderiza a cada minuto (o card e a tela não).
// `memo` + props numéricas: se o card re-renderizar com os mesmos valores, este texto não.
const WorkedDuration = memo(({ baseMinutes, activeStartedAtMs }: WorkedDurationProps) => {
  const styles = journeyTodayCardVariants();
  const elapsedMinutes = useElapsedMinutes(activeStartedAtMs);
  const label = formatWorkedDuration(baseMinutes + elapsedMinutes);

  return (
    <Text
      className={styles.worked()}
      numberOfLines={1}
      adjustsFontSizeToFit
      accessibilityLabel={`${label} de trabalho registrado`}
    >
      {label}
    </Text>
  );
});

WorkedDuration.displayName = "WorkedDuration";

/**
 * EXPORTS
 */
export { WorkedDuration };
