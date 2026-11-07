/**
 * IMPORTS
 */
import { Text, View } from "react-native";
// typings
import type { JourneyTodayCardProps } from "./interface";
import { JourneyStatusBadge } from "./journey-status-badge";
import { journeyTodayCardVariants } from "./journey-today-card.variants";
import { PeriodElapsed } from "./period-elapsed";
import { WorkedDuration } from "./worked-duration";

// Tempo de trabalho do dia: estado, total trabalhado, período e atividade em andamento.
const JourneyTodayCard = ({
  status,
  statusLabel,
  workedBaseMinutes,
  activeWorkStartedAtMs,
  currentPeriod,
}: JourneyTodayCardProps) => {
  const styles = journeyTodayCardVariants();

  return (
    <View className={styles.container()}>
      <View className={styles.header()}>
        <Text className={styles.title()} accessibilityRole="header">
          Tempo de trabalho
        </Text>
        <JourneyStatusBadge status={status} label={statusLabel} />
      </View>

      <WorkedDuration baseMinutes={workedBaseMinutes} activeStartedAtMs={activeWorkStartedAtMs} />

      {currentPeriod ? (
        <View className={styles.details()}>
          <PeriodElapsed sinceLabel={currentPeriod.sinceLabel} startedAtMs={currentPeriod.startedAtMs} />

          <Text className={styles.activityTitle()} numberOfLines={1}>
            {currentPeriod.title}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

/**
 * EXPORTS
 */
export { JourneyTodayCard };
