/**
 * IMPORTS
 */
import type { FC } from "react";
import { ScrollView, Text, View } from "react-native";
// view-model - signin
import type { SignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";
import { BrandLogo } from "@/shared/components/ui/brand-logo";
// components
import { Button } from "@/shared/components/ui/button";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";
import { KeyboardContainer } from "@/shared/components/ui/keyboard-container";

/**
 * Tela SignInView
 */
const SignInView: FC<SignInViewModel> = ({ control, onSubmit, goToSignUp, isSubmitting }) => {
  return (
    <KeyboardContainer className="bg-background">
      <ScrollView
        contentContainerClassName="flex-grow justify-center gap-6 px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-6">
          <BrandLogo />
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

        <Button title={isSubmitting ? "Entrando..." : "Entrar"} onPress={() => onSubmit()} />

        <Text className="text-center text-muted" onPress={goToSignUp}>
          Não tem conta? <Text className="font-semibold text-primary">Cadastre-se</Text>
        </Text>
      </ScrollView>
    </KeyboardContainer>
  );
};

/**
 * EXPORTS
 */
export default SignInView;
