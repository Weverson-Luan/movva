/**
 * IMPORTS
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { tv } from "tailwind-variants";
// typings
import type { SyncStepItem } from "@/modules/sync/presentation/view-model/sync-view-model";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

type SyncStepRowProps = {
  step: SyncStepItem;
  index: number;
};

const stepLabel = tv({
  base: "flex-1 text-base",
  variants: {
    status: {
      pending: "text-muted",
      running: "font-semibold text-text",
      done: "text-text",
    },
  },
});

const SyncStepIcon = ({ status }: Pick<SyncStepItem, "status">) => {
  const theme = useTheme();

  if (status === "running") return <ActivityIndicator size="small" color={theme.primary} />;
  if (status === "done") {
    return (
      <Animated.View entering={ZoomIn.springify()}>
        <MaterialCommunityIcons name="check-circle" size={22} color={theme.primary} />
      </Animated.View>
    );
  }
  return <MaterialCommunityIcons name="circle-outline" size={22} color={theme.muted} />;
};

// Cada linha entra em cascata (atraso pelo índice).
const SyncStepRow = ({ step, index }: SyncStepRowProps) => {
  return (
    <Animated.View entering={FadeInDown.delay(300 + index * 120)}>
      <View className="flex-row items-center gap-3">
        <View className="h-6 w-6 items-center justify-center">
          <SyncStepIcon status={step.status} />
        </View>
        <Text className={stepLabel({ status: step.status })}>{step.label}</Text>
      </View>
    </Animated.View>
  );
};

/**
 * EXPORTS
 */
export { SyncStepRow };
