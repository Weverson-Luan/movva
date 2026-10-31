/**
 * IMPORTS
 */
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
// typings
import type { OnboardingSlideItem } from "@/modules/onboarding/presentation/view-model/onboarding-view-model";

type OnboardingSlideProps = {
  slide: OnboardingSlideItem;
  index: number;
  width: number;
  /** posição horizontal da lista (px), atualizada no thread de UI */
  scrollX: SharedValue<number>;
};

// Parallax: a ilustração anda mais rápido que o texto, gira de leve e flutua.
const OnboardingSlide = ({ slide, index, width, scrollX }: OnboardingSlideProps) => {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [float]);

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(scrollX.value, inputRange, [width * 0.5, 0, -width * 0.5], Extrapolation.CLAMP) },
      { translateY: float.value * -10 },
      { scale: interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP) },
      { rotate: `${interpolate(scrollX.value, inputRange, [-12, 0, 12], Extrapolation.CLAMP)}deg` },
    ],
  }));

  const outerBlobStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP) }],
  }));

  const innerBlobStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP) + float.value * 0.06 },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollX.value, inputRange, [32, 0, 32], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={{ width }} className="flex-1 items-center justify-center gap-10 px-8">
      <View className="h-80 w-80 items-center justify-center">
        <View className="absolute inset-0 items-center justify-center">
          <Animated.View style={outerBlobStyle}>
            <View className="h-80 w-80 rounded-full bg-primary/5" />
          </Animated.View>
        </View>
        <View className="absolute inset-0 items-center justify-center">
          <Animated.View style={innerBlobStyle}>
            <View className="h-64 w-64 rounded-full bg-primary/5" />
          </Animated.View>
        </View>
        <Animated.View style={imageStyle}>
          <Image source={slide.image} className="h-80 w-80" resizeMode="contain" accessibilityIgnoresInvertColors />
        </Animated.View>
      </View>

      <Animated.View style={textStyle}>
        <View className="items-center gap-3">
          <Text className="text-center text-3xl font-bold text-text">{slide.title}</Text>
          <Text className="text-center text-base text-muted">{slide.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { OnboardingSlide };
