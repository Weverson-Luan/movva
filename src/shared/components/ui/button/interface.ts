/**
 * IMPORTS
 */

import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { PressableProps } from "react-native";

type ButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: "solid" | "ghost";
  /** Ícone à direita do texto (ex.: "arrow-right"). */
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  isDisabled?: boolean;
};

/**
 * EXPORTS
 */
export type { ButtonProps };
