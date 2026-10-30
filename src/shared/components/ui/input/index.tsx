/**
 * IMPORTS
 */

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
// styles
import { useTheme } from "@/brand/BrandProvider";
// variantes
import { inputVariants } from "./input.variants";

// typings
import type { InputProps } from "./interface";

const Input = ({
  label,
  icon,
  error,
  isDisabled = false,
  secureTextEntry,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(Boolean(secureTextEntry));

  const state = error ? "error" : isFocused ? "focused" : "default";
  const styles = inputVariants({ state, isDisabled });
  const iconColor = { error: theme.danger, focused: theme.primary, default: theme.muted }[state];

  return (
    <View className={styles.container()}>
      {label && <Text className={styles.label()}>{label}</Text>}

      <View className={styles.wrapper()}>
        {icon && <Ionicons name={icon} size={20} color={iconColor} />}

        <TextInput
          className={styles.input()}
          placeholderTextColor={theme.muted}
          editable={!isDisabled}
          secureTextEntry={isHidden}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...textInputProps}
        />

        {/* Campo de senha: botão para mostrar/esconder */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsHidden((hidden) => !hidden)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? "Mostrar senha" : "Esconder senha"}
          >
            <Ionicons name={isHidden ? "eye-off-outline" : "eye-outline"} size={20} color={theme.muted} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className={styles.error()}>{error}</Text>}
    </View>
  );
};

/**
 * EXPORTS
 */
export { Input };
