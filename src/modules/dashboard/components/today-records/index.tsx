/**
 * IMPORTS
 */
import { Text, View } from "react-native";
// typings
import type { TodayRecordsProps } from "./interface";
import { TodayRecordRow } from "./today-record-row";
import { todayRecordsVariants } from "./today-records.variants";

// "Registros de hoje": timeline dos registros do dia, com atalho para o histórico.
const TodayRecords = ({ items, onPressHistory }: TodayRecordsProps) => {
  const styles = todayRecordsVariants();

  return (
    <View className={styles.container()}>
      <View className={styles.header()}>
        <Text className={styles.title()} accessibilityRole="header">
          Registros de hoje
        </Text>
        <Text className={styles.historyLink()} onPress={onPressHistory} accessibilityRole="link" suppressHighlighting>
          Histórico
        </Text>
      </View>

      <View className={styles.card()}>
        {items.map((record, index) => (
          <TodayRecordRow key={record.key} record={record} isLast={index === items.length - 1} />
        ))}
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { TodayRecords };
