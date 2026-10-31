/**
 * IMPORTS
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_SIZE, RING_DELAYS_MS, SPIN_DURATION_MS } from "./constants";
// typings
import type { SyncHeroProps } from "./interface";
import { syncHeroVariants } from "./sync-hero.variants";
import { SyncRing } from "./sync-ring";

// Ícone central: gira enquanto sincroniza e vira um check com mola no fim.
const SyncHero = ({ isDone }: SyncHeroProps) => {
  const theme = useTheme();
  const styles = syncHeroVariants();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: SPIN_DURATION_MS, easing: Easing.linear }), -1);
  }, [rotation]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View className={styles.container()}>
      {!isDone &&
        RING_DELAYS_MS.map((delay) => (
          <View key={delay} className={styles.layer()}>
            <Animated.View exiting={FadeOut}>
              <SyncRing delay={delay} />
            </Animated.View>
          </View>
        ))}

      <View className={styles.badge()}>
        {isDone ? (
          <Animated.View key="done" entering={ZoomIn.springify().damping(10)}>
            <MaterialCommunityIcons name="check-bold" size={ICON_SIZE} color={theme.primaryText} />
          </Animated.View>
        ) : (
          <Animated.View key="syncing" style={iconStyle}>
            <MaterialCommunityIcons name="sync" size={ICON_SIZE} color={theme.primaryText} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { SyncHero };
