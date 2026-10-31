/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
// marca do cliente
import { useTheme } from "@/shared/brand/BrandProvider";
import { Button } from "@/shared/components/ui/button";

import { HERO_ICON_SIZE } from "./constants";
// typings
import type { JourneyTodayCardProps } from "./interface";
import { JourneyMetaItem } from "./journey-meta-item";
import { JourneyStatusBadge } from "./journey-status-badge";
import { journeyTodayCardVariants } from "./journey-today-card.variants";

// "Sua jornada hoje": estado, tempo trabalhado, início/pausas e atalho para acompanhar.
const JourneyTodayCard = ({
  status,
  statusLabel,
  workedLabel,
  startLabel,
  breaksLabel,
  onPressTrack,
}: JourneyTodayCardProps) => {
  const theme = useTheme();
  const styles = journeyTodayCardVariants();

  return (
    <View className={styles.container()}>
      <View className={styles.header()}>
        <Text className={styles.title()} accessibilityRole="header">
          Sua jornada hoje
        </Text>
        <JourneyStatusBadge status={status} label={statusLabel} />
      </View>

      <View className={styles.hero()}>
        <View className={styles.heroTexts()} accessible accessibilityLabel={`${workedLabel} de trabalho registrado`}>
          <Text className={styles.worked()} numberOfLines={1} adjustsFontSizeToFit>
            {workedLabel}
          </Text>
          <Text className={styles.workedCaption()}>de trabalho registrado</Text>
        </View>
        <Ionicons name="stopwatch-outline" size={HERO_ICON_SIZE} color={theme.primary} />
      </View>

      <View className={styles.meta()}>
        <JourneyMetaItem icon="log-in-outline" label={startLabel} />
        <JourneyMetaItem icon="cafe-outline" label={breaksLabel} />
      </View>

      <Button title="Acompanhar jornada" icon="arrow-right" iconPosition="left" onPress={onPressTrack} />
    </View>
  );
};

/**
 * EXPORTS
 */
export { JourneyTodayCard };
