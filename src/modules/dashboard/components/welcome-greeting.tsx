/**
 * IMPORTS
 */
import { Text, View } from "react-native";
import { tv } from "tailwind-variants";
// typings
import type { WelcomeGreetingData } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

type WelcomeGreetingProps = WelcomeGreetingData;

const messageText = tv({
  base: "text-base",
  variants: {
    tone: {
      default: "text-muted",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

// Boas-vindas do topo da tela inicial: data, saudação e status da jornada.
const WelcomeGreeting = ({ dateLabel, title, message, tone }: WelcomeGreetingProps) => {
  return (
    <View className="gap-1">
      <Text className="text-sm uppercase tracking-wide text-muted">{dateLabel}</Text>
      <Text className="text-[32px] font-bold leading-10 text-text" accessibilityRole="header">
        {title}
      </Text>
      <Text className={messageText({ tone })}>{message}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { WelcomeGreeting };
