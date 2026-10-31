/**
 * IMPORTS
 */
import { View } from "react-native";
import Animated, { Extrapolation, interpolate, type SharedValue, useAnimatedStyle } from "react-native-reanimated";

type DotProps = {
  index: number;
  width: number;
  scrollX: SharedValue<number>;
};

type PaginationDotsProps = {
  items: { key: string }[];
  width: number;
  scrollX: SharedValue<number>;
};

// O dot ativo estica conforme o dedo arrasta (segue o scroll, não o índice).
const Dot = ({ index, width, scrollX }: DotProps) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const dotStyle = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP),
    opacity: interpolate(scrollX.value, inputRange, [0.25, 1, 0.25], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={dotStyle}>
      <View className="h-2 w-full rounded-full bg-primary" />
    </Animated.View>
  );
};

const PaginationDots = ({ items, width, scrollX }: PaginationDotsProps) => {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {items.map((item, index) => (
        <Dot key={item.key} index={index} width={width} scrollX={scrollX} />
      ))}
    </View>
  );
};

/**
 * EXPORTS
 */
export { PaginationDots };
