/**
 * IMPORTS
 */

import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  error?: string;
  isDisabled?: boolean;
};

type InputControlledProps<T extends FieldValues> = Omit<InputProps, "value" | "onChangeText" | "error"> & {
  control: Control<T>;
  name: Path<T>;
};

/**
 * EXPORTS
 */
export type { InputControlledProps, InputProps };
