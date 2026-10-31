/**
 * IMPORTS
 */

import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { PressableProps } from "react-native";

type ButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: "solid" | "ghost";
  /** Ícone ao lado do texto (ex.: "arrow-right"). */
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  /** lado do ícone; padrão à direita */
  iconPosition?: "left" | "right";
  isDisabled?: boolean;
};

/**
 * EXPORTS
 */
export type { ButtonProps };
