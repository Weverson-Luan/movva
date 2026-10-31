/**
 * IMPORTS
 */
import type { FC } from "react";
import { Text, View } from "react-native";
// view-model - signin-up
import type { useSigninUpViewModel } from "@/modules/signin-up/presentation/view-model/signin-up-view-model";
import { BrandLogo } from "@/shared/components/ui/brand-logo";
// components
import { Button } from "@/shared/components/ui/button";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";
import { Screen } from "@/shared/components/ui/screen";

/**
 * Tela SigninUpView
 */
const SigninUpView: FC<ReturnType<typeof useSigninUpViewModel>> = ({ control, onSubmit, isSubmitting }) => {
  return (
    <Screen keyboard scroll contentClassName="justify-center gap-6 px-6 py-12">
      <View className="items-center gap-6">
        <BrandLogo />
        <View className="items-center gap-1">
          <Text className="text-2xl font-bold text-text">Criar conta</Text>
          <Text className="text-base text-muted">Preencha seus dados para começar</Text>
        </View>
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

      <Button title={isSubmitting ? "Criando conta..." : "Criar conta"} onPress={() => onSubmit()} />
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default SigninUpView;
