/**
 * IMPORTS
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { ICON_SIZE } from "./constants";

// typings
import type { SyncStepIconProps } from "./interface";

// Pendente: círculo vazio. Rodando: spinner. Concluída: check com mola.
const SyncStepIcon = ({ status }: SyncStepIconProps) => {
  const theme = useTheme();

  if (status === "running") return <ActivityIndicator size="small" color={theme.primary} />;
  if (status === "done") {
    return (
      <Animated.View entering={ZoomIn.springify()}>
        <MaterialCommunityIcons name="check-circle" size={ICON_SIZE} color={theme.primary} />
      </Animated.View>
    );
  }
  return <MaterialCommunityIcons name="circle-outline" size={ICON_SIZE} color={theme.muted} />;
};

/**
 * EXPORTS
 */
export { SyncStepIcon };
