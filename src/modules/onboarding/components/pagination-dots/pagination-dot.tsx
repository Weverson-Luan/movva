/**
 * IMPORTS
 */
import { View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

import { DOT_OPACITIES, DOT_WIDTHS } from "./constants";
// typings
import type { PaginationDotProps } from "./interface";
import { paginationDotsVariants } from "./pagination-dots.variants";

// O dot ativo estica conforme o dedo arrasta (segue o scroll, não o índice).
const PaginationDot = ({ index, width, scrollX }: PaginationDotProps) => {
  const styles = paginationDotsVariants();
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const dotStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, DOT_WIDTHS, Extrapolation.CLAMP),
    opacity: interpolate(scrollX.value, inputRange, DOT_OPACITIES, Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={dotStyle}>
      <View className={styles.dot()} />
    </Animated.View>
  );
};

/**
 * EXPORTS
 */
export { PaginationDot };
