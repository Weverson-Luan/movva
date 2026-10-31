/**
 * IMPORTS
 */
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// typings
import type { KeyBoardContainerProps } from "./interface";

const KeyboardContainer = ({ children, className = "" }: KeyBoardContainerProps) => {
  return (
    <SafeAreaView className={`flex-1 ${className}`}>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * EXPORTS
 */
export { KeyboardContainer };
