/**
 * IMPORTS
 */
import { useEffect } from "react";
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { BLOB_BREATH_SCALE, FLOAT_DISTANCE, FLOAT_DURATION_MS } from "./constants";

// typings
import type { OnboardingSlideAnimationParams } from "./interface";

// Parallax: a ilustração anda mais rápido que o texto, gira de leve e flutua.
const useOnboardingSlideAnimation = ({ index, width, scrollX }: OnboardingSlideAnimationParams) => {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: FLOAT_DURATION_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [float]);

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(scrollX.value, inputRange, [width * 0.5, 0, -width * 0.5], Extrapolation.CLAMP) },
      { translateY: float.value * -FLOAT_DISTANCE },
      { scale: interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP) },
      { rotate: `${interpolate(scrollX.value, inputRange, [-12, 0, 12], Extrapolation.CLAMP)}deg` },
    ],
  }));

  const outerBlobStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP) }],
  }));

  const innerBlobStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale:
          interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP) + float.value * BLOB_BREATH_SCALE,
      },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollX.value, inputRange, [32, 0, 32], Extrapolation.CLAMP) }],
  }));

  return { imageStyle, outerBlobStyle, innerBlobStyle, textStyle };
};

/**
 * EXPORTS
 */
export { useOnboardingSlideAnimation };
