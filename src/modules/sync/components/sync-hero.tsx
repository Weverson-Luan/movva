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
  withDelay,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

type SyncHeroProps = {
  isDone: boolean;
};

const RING_DELAYS_MS = [0, 600, 1200];

// Onda que sai do centro; três com atraso formam o efeito de "sinal".
const SyncRing = ({ delay }: { delay: number }) => {
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withDelay(delay, withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1));
  }, [wave, delay]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - wave.value),
    transform: [{ scale: 1 + wave.value * 1.2 }],
  }));

  return (
    <Animated.View style={ringStyle}>
      <View className="h-28 w-28 rounded-full border-2 border-primary" />
    </Animated.View>
  );
};

// Ícone central: gira enquanto sincroniza e vira um check com mola no fim.
const SyncHero = ({ isDone }: SyncHeroProps) => {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1);
  }, [rotation]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View className="h-64 w-64 items-center justify-center">
      {!isDone &&
        RING_DELAYS_MS.map((delay) => (
          <View key={delay} className="absolute inset-0 items-center justify-center">
            <Animated.View exiting={FadeOut}>
              <SyncRing delay={delay} />
            </Animated.View>
          </View>
        ))}

      <View className="h-28 w-28 items-center justify-center rounded-full bg-primary">
        {isDone ? (
          <Animated.View key="done" entering={ZoomIn.springify().damping(10)}>
            <MaterialCommunityIcons name="check-bold" size={52} color={theme.primaryText} />
          </Animated.View>
        ) : (
          <Animated.View key="syncing" style={iconStyle}>
            <MaterialCommunityIcons name="sync" size={52} color={theme.primaryText} />
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
