/**
 * IMPORTS
 */
import { Text, View } from "react-native";
// typings
import type { WelcomeGreetingProps } from "./interface";
import { welcomeGreetingVariants } from "./welcome-greeting.variants";

// Boas-vindas do topo da tela inicial: data, saudação e status da jornada.
const WelcomeGreeting = ({ dateLabel, title, message, tone }: WelcomeGreetingProps) => {
  const styles = welcomeGreetingVariants({ tone });

  return (
    <View className={styles.container()}>
      <Text className={styles.date()}>{dateLabel}</Text>
      <Text className={styles.title()} accessibilityRole="header">
        {title}
      </Text>
      <Text className={styles.message()}>{message}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { WelcomeGreeting };
