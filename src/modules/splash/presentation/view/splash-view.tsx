/**
 * IMPORTS
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { type ComponentProps, type FC, useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
// view-model - splash
import type { SplashViewModel } from "@/modules/splash/presentation/view-model/splash-view-model";
import { useBrand, useTheme } from "@/shared/brand/BrandProvider";
// marca do cliente
import { brandAssets } from "@/shared/brand/brand-assets";
import { Screen } from "@/shared/components/ui/screen";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

// w-52 = 208px
const LOADER_WIDTH = 208;
const LOADER_ICON_SIZE = 26;
const INTRO_DELAY_MS = 700;

/**
 * Onda que se expande atrás da logo.
 */
const LogoPulse = () => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - pulse.value),
    transform: [{ scale: 0.8 + pulse.value * 0.8 }],
  }));

  return (
    <View className="absolute inset-0 items-center justify-center">
      <Animated.View style={pulseStyle}>
        <View className="h-40 w-40 rounded-full bg-primary/30" />
      </Animated.View>
    </View>
  );
};

/**
 * Barra de carregamento com o ícone do cliente andando sobre ela.
 */
const BrandLoader = ({ duration, onFinish }: SplashViewModel) => {
  const theme = useTheme();
  const { loaderIcon } = useBrand();
  const progress = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      INTRO_DELAY_MS,
      withTiming(1, { duration, easing: Easing.inOut(Easing.cubic) }, (finished) => {
        if (finished) scheduleOnRN(onFinish);
      }),
    );
    bounce.value = withRepeat(withSequence(withTiming(-3, { duration: 160 }), withTiming(0, { duration: 160 })), -1);
  }, [progress, bounce, duration, onFinish]);

  const fillStyle = useAnimatedStyle(() => ({ width: progress.value * LOADER_WIDTH }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (LOADER_WIDTH - LOADER_ICON_SIZE) }, { translateY: bounce.value }],
  }));

  return (
    <Animated.View entering={FadeIn.delay(INTRO_DELAY_MS)}>
      <View className="items-center gap-2">
        <View className="w-52 gap-1">
          <Animated.View style={iconStyle}>
            <MaterialCommunityIcons name={loaderIcon as IconName} size={LOADER_ICON_SIZE} color={theme.primary} />
          </Animated.View>
          <View className="h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
            <Animated.View style={fillStyle}>
              <View className="h-1.5 w-full rounded-full bg-primary" />
            </Animated.View>
          </View>
        </View>
        <Text className="text-xs text-muted">Carregando...</Text>
      </View>
    </Animated.View>
  );
};

/**
 * Tela SplashView
 */
const SplashView: FC<SplashViewModel> = (props) => {
  const { displayName, tagline } = useBrand();

  return (
    <Screen contentClassName="items-center justify-between px-8 pb-4">
      <View className="flex-1 items-center justify-center gap-6">
        <View className="h-40 w-40 items-center justify-center">
          <LogoPulse />
          <Animated.View entering={ZoomIn.springify().damping(12)}>
            <Image
              source={brandAssets.logo}
              className="h-32 w-32 rounded-brand"
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </Animated.View>
        </View>

        <View className="items-center gap-2">
          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <Text className="text-center text-3xl font-bold tracking-widest text-primary">
              {displayName.toUpperCase()}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(500).duration(500)}>
            <Text className="text-center text-sm text-muted">{tagline}</Text>
          </Animated.View>
        </View>
      </View>

      <BrandLoader {...props} />
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default SplashView;
