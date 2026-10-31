/**
 * IMPORTS
 */
import { type FC, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
// components
import { SyncHero } from "@/modules/sync/components/sync-hero";
import { SyncStepRow } from "@/modules/sync/components/sync-step-row";
// view-model - sync
import type { SyncViewModel } from "@/modules/sync/presentation/view-model/sync-view-model";
// marca do cliente
import { useBrand } from "@/shared/brand/BrandProvider";
import { Button } from "@/shared/components/ui/button";
import { Screen } from "@/shared/components/ui/screen";

/**
 * Barra de progresso que desliza até o valor novo.
 */
const SyncProgressBar = ({ progress }: Pick<SyncViewModel, "progress">) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [animatedProgress, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${animatedProgress.value * 100}%` }));

  return (
    <View className="gap-2">
      <View className="h-2 w-full overflow-hidden rounded-full bg-muted/20">
        <Animated.View style={fillStyle}>
          <View className="h-2 w-full rounded-full bg-primary" />
        </Animated.View>
      </View>
      <Text className="text-right text-xs font-semibold text-muted">{Math.round(progress * 100)}%</Text>
    </View>
  );
};

/**
 * Tela SyncView
 */
const SyncView: FC<SyncViewModel> = ({ steps, progress, isDone, onContinue }) => {
  const { displayName } = useBrand();

  return (
    <Screen contentClassName="justify-between px-6 pt-6">
      <View className="items-center gap-4">
        <SyncHero isDone={isDone} />

        <Animated.View key={isDone ? "done" : "syncing"} entering={FadeIn.duration(400)}>
          <View className="items-center gap-2">
            <Text className="text-center text-2xl font-bold text-text">
              {isDone ? "Tudo pronto!" : "Sincronizando seus dados"}
            </Text>
            <Text className="text-center text-base text-muted">
              {isDone
                ? "Seus dados já estão no aparelho. Agora você pode usar o app mesmo sem internet."
                : `Estamos preparando o ${displayName} para funcionar mesmo sem internet.`}
            </Text>
          </View>
        </Animated.View>
      </View>

      <View className="gap-5 rounded-brand bg-surface p-5">
        <SyncProgressBar progress={progress} />
        {steps.map((step, index) => (
          <SyncStepRow key={step.key} step={step} index={index} />
        ))}
      </View>

      <View className="h-button">
        {isDone && (
          <Animated.View entering={FadeInUp.springify()}>
            <Button title="Continuar" icon="arrow-right" onPress={onContinue} />
          </Animated.View>
        )}
      </View>
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default SyncView;
