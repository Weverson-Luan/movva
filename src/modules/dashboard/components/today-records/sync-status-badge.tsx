/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

import { SYNC_BADGE, SYNC_BADGE_ICON_SIZE } from "./constants";
// typings
import type { SyncStatusBadgeProps } from "./interface";
import { syncStatusBadgeVariants } from "./today-records.variants";

// Selo de envio do registro: "Sincronizada" (success) ou "Pendente" (warning).
const SyncStatusBadge = ({ status }: SyncStatusBadgeProps) => {
  const theme = useTheme();
  const styles = syncStatusBadgeVariants({ status });
  const { label, icon } = SYNC_BADGE[status];

  return (
    <View className={styles.container()}>
      <Ionicons name={icon} size={SYNC_BADGE_ICON_SIZE} color={status === "synced" ? theme.success : theme.warning} />
      <Text className={styles.label()}>{label}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { SyncStatusBadge };
