/**
 * IMPORTS
 */
import type { FC } from "react";

import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { useBrand } from "@/brand/BrandProvider";

// view-model - signin-up-view
import type { useSigninUpViewModel } from "@/modules/signin-up/presentation/view-model/signin-up-view-model";

/**
 * Tela SignInView
 */
const SignInView: FC<ReturnType<typeof useSigninUpViewModel>> = ({ control }) => {
  const { displayName } = useBrand();

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 justify-center gap-4 px-6">
        <Text className="text-3xl font-bold text-text">Hello World</Text>
        <Text className="mb-4 text-base text-muted">Entre na sua conta {displayName}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

/**
 * EXPORTS
 */
export default SignInView;
