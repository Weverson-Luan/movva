/**
 * IMPORTS
 */
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { RING_DURATION_MS } from "./constants";
// typings
import type { SyncRingProps } from "./interface";
import { syncHeroVariants } from "./sync-hero.variants";

// Onda que sai do centro e some enquanto cresce.
const SyncRing = ({ delay }: SyncRingProps) => {
  const styles = syncHeroVariants();
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: RING_DURATION_MS, easing: Easing.out(Easing.quad) }), -1),
    );
  }, [wave, delay]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - wave.value),
    transform: [{ scale: 1 + wave.value * 1.2 }],
  }));

  return (
    <Animated.View style={ringStyle}>
      <View className={styles.ring()} />
    </Animated.View>
  );
};

/**
 * EXPORTS
 */
export { SyncRing };
