/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
// typings
import type { DaySummaryItem, DaySummaryKind } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";

type DaySummaryProps = {
  items: DaySummaryItem[];
};

// Um ícone por total: trabalho (pasta), pausas (café, como no card de jornada), total (cronômetro).
const ICON_BY_KIND: Record<DaySummaryKind, ComponentProps<typeof Ionicons>["name"]> = {
  work: "briefcase-outline",
  breaks: "cafe-outline",
  total: "stopwatch-outline",
};

const DaySummaryCard = ({ kind, label, value }: Pick<DaySummaryItem, "label" | "value"> & { kind: DaySummaryKind }) => {
  const theme = useTheme();

  return (
    <View
      className="flex-1 gap-2 rounded-brand border border-muted/40 bg-surface p-3"
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <Ionicons name={ICON_BY_KIND[kind]} size={20} color={theme.muted} />
      <Text className="text-[28px] font-bold text-text" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text className="text-sm text-muted" numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
};

// "Resumo do dia": um cartão por total (trabalho, pausas...), lado a lado.
const DaySummary = ({ items }: DaySummaryProps) => {
  return (
    <View className="gap-3">
      <Text className="text-xl font-bold text-text" accessibilityRole="header">
        Resumo do dia
      </Text>
      <View className="flex-row gap-3">
        {items.map((item) => (
          <DaySummaryCard key={item.key} kind={item.key} label={item.label} value={item.value} />
        ))}
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { DaySummary };
