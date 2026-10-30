/**
 * IMPORTS
 */
import type { FC } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useBrand } from "@/brand/BrandProvider";

// components
import { BrandButton } from "@/modules/dashboard/components/BrandButton";
// view-model - signin
import type { SignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";

/**
 * Tela SignInView
 */
const SignInView: FC<SignInViewModel> = ({ control, onSubmit, goToSignUp, isSubmitting, apiError }) => {
  const { displayName } = useBrand();

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 justify-center gap-6 px-6">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-text">Hello World</Text>
          <Text className="text-base text-muted">Entre na sua conta {displayName}</Text>
        </View>

        <InputControlled
          control={control}
          name="email"
          label="E-mail"
          icon="mail-outline"
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <InputControlled
          control={control}
          name="password"
          label="Senha"
          icon="lock-closed-outline"
          placeholder="Sua senha"
          secureTextEntry
          autoComplete="password"
          onSubmitEditing={() => onSubmit()}
        />

        {apiError && <Text className="text-center text-sm text-danger">{apiError}</Text>}

        <BrandButton title={isSubmitting ? "Entrando..." : "Entrar"} onPress={onSubmit} />

        <Text className="text-center text-muted" onPress={goToSignUp}>
          Não tem conta? <Text className="font-semibold text-primary">Cadastre-se</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

/**
 * EXPORTS
 */
export default SignInView;
