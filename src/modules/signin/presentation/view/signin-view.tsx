/**
 * IMPORTS
 */
import type { FC } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
// components
import { BrandButton } from "@/modules/dashboard/components/BrandButton";
// view-model - signin
import type { SignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";
// hook de marca do cliente
import { useBrand } from "@/shared/brand/BrandProvider";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";

/**
 * Tela SignInView
 */
const SignInView: FC<SignInViewModel> = ({ control, onSubmit, goToSignUp, isSubmitting }) => {
  const { displayName } = useBrand();

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 justify-center gap-6 px-6">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-text">{displayName}</Text>
          <Text className="text-base text-muted">Entre na sua conta.</Text>
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
