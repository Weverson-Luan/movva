/**
 * IMPORTS
 */
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ENTER_DELAY_MS, ENTER_STEP_MS } from "./constants";
// typings
import type { SyncStepRowProps } from "./interface";
import { SyncStepIcon } from "./sync-step-icon";
import { syncStepRowVariants } from "./sync-step-row.variants";

// Cada linha entra em cascata (atraso pelo índice).
const SyncStepRow = ({ step, index }: SyncStepRowProps) => {
  const styles = syncStepRowVariants({ status: step.status });

  return (
    <Animated.View entering={FadeInDown.delay(ENTER_DELAY_MS + index * ENTER_STEP_MS)}>
      <View className={styles.container()}>
        <View className={styles.iconBox()}>
          <SyncStepIcon status={step.status} />
        </View>
        <Text className={styles.label()}>{step.label}</Text>
      </View>
    </Animated.View>
  );
};

/**
 * EXPORTS
 */
export { SyncStepRow };
