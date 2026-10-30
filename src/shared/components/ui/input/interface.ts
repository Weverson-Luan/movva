/**
 * IMPORTS
 */

import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  error?: string;
  isDisabled?: boolean;
};

/**
 * EXPORTS
 */
export type { InputProps };
