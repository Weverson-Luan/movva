/**
 * IMPORTS
 */
import type { FC } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

// components
import { BrandButton } from "@/modules/dashboard/components/BrandButton";
// view-model - signin-up
import type { useSigninUpViewModel } from "@/modules/signin-up/presentation/view-model/signin-up-view-model";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";

/**
 * Tela SigninUpView
 */
const SigninUpView: FC<ReturnType<typeof useSigninUpViewModel>> = ({ control, onSubmit, isSubmitting }) => {
  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerClassName="flex-grow justify-center gap-6 px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1">
          <Text className="text-3xl font-bold text-text">Criar conta</Text>
          <Text className="text-base text-muted">Preencha seus dados para começar</Text>
        </View>

        <InputControlled control={control} name="name" label="Nome" icon="person-outline" placeholder="Seu nome" />

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
          name="phone"
          label="Telefone"
          icon="call-outline"
          placeholder="11999999999"
          keyboardType="phone-pad"
          autoComplete="tel"
        />

        <InputControlled
          control={control}
          name="password"
          label="Senha"
          icon="lock-closed-outline"
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          autoComplete="new-password"
        />

        <InputControlled
          control={control}
          name="confirmPassword"
          label="Confirmar senha"
          icon="lock-closed-outline"
          placeholder="Repita a senha"
          secureTextEntry
          autoComplete="new-password"
          onSubmitEditing={() => onSubmit()}
        />

        <BrandButton title={isSubmitting ? "Criando conta..." : "Criar conta"} onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * EXPORTS
 */
export default SigninUpView;
