/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_BY_TYPE, RECORD_ICON_SIZE, SYNC_BADGE } from "./constants";
// typings
import type { TodayRecordRowProps } from "./interface";
import { SyncStatusBadge } from "./sync-status-badge";
import { todayRecordRowVariants } from "./today-records.variants";

// Um registro: ícone na trilha à esquerda, título/data/status e duração à direita.
const TodayRecordRow = ({ record, isLast }: TodayRecordRowProps) => {
  const theme = useTheme();
  const { type, title, periodLabel, syncStatus, durationLabel } = record;
  const styles = todayRecordRowVariants({ isLast });
  const a11yLabel = [title, periodLabel, SYNC_BADGE[syncStatus].label, durationLabel].join(", ");

  return (
    <View className={styles.container()} accessible accessibilityLabel={a11yLabel}>
      <View className={styles.rail()}>
        <View className={styles.iconCircle()}>
          <Ionicons name={ICON_BY_TYPE[type]} size={RECORD_ICON_SIZE} color={theme.muted} />
        </View>
        <View className={styles.connector()} />
      </View>

      <View className={styles.body()}>
        <View className={styles.topLine()}>
          <Text className={styles.title()} numberOfLines={1}>
            {title}
          </Text>
          <Text className={styles.duration()}>{durationLabel}</Text>
        </View>
        <View className={styles.meta()}>
          <Text className={styles.period()}>{periodLabel}</Text>
          <SyncStatusBadge status={syncStatus} />
        </View>
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { TodayRecordRow };
