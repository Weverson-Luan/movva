/**
 * IMPORTS
 */

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
// styles
import { useTheme } from "@/shared/brand/BrandProvider";
// variantes
import { buttonVariants } from "./button.variants";

// typings
import type { ButtonProps } from "./interface";

// Botão com "mola" ao tocar: encolhe no press e volta com spring.
const Button = ({
  title,
  variant = "solid",
  icon,
  isDisabled = false,
  onPressIn,
  onPressOut,
  ...pressableProps
}: ButtonProps) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const styles = buttonVariants({ variant, isDisabled });
  const iconColor = variant === "solid" ? theme.primaryText : theme.primary;

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        className={styles.container()}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        onPressIn={(event) => {
          scale.value = withSpring(0.96);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1);
          onPressOut?.(event);
        }}
        {...pressableProps}
      >
        <Text className={styles.label()}>{title}</Text>
        {icon && <MaterialCommunityIcons name={icon} size={20} color={iconColor} />}
      </Pressable>
    </Animated.View>
  );
};

/**
 * EXPORTS
 */
export { Button };
