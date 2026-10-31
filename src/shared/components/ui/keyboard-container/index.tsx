/**
 * IMPORTS
 */
import { KeyboardAvoidingView, Platform } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// typings
import type { KeyBoardContainerProps } from "./interface";

const KeyboardContainer = ({ children }: KeyBoardContainerProps) => {
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>{children}</KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * EXPORTS
 */
export { KeyboardContainer };
