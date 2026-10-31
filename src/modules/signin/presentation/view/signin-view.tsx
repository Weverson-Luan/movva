/**
 * IMPORTS
 */
import type { FC } from "react";
import { Image, ScrollView, Text, View } from "react-native";
// components
import { BrandButton } from "@/modules/dashboard/components/BrandButton";
// view-model - signin
import type { SignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";
// hook de marca do cliente
import { useBrand } from "@/shared/brand/BrandProvider";
// imagens do cliente ativo
import { brandAssets } from "@/shared/brand/brand-assets";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";
import { KeyboardContainer } from "@/shared/components/ui/keyboard-container";

/**
 * Tela SignInView
 */
const SignInView: FC<SignInViewModel> = ({ control, onSubmit, goToSignUp, isSubmitting }) => {
  const { displayName } = useBrand();

  return (
    <KeyboardContainer className="bg-background">
      <ScrollView
        contentContainerClassName="flex-grow justify-center gap-6 px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-6">
          <View className="flex-row items-center gap-3">
            <Image
              source={brandAssets.loginLogo}
              className="h-12 w-12"
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text className="text-3xl font-bold text-text">{displayName}</Text>
          </View>
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
      </ScrollView>
    </KeyboardContainer>
  );
};

/**
 * EXPORTS
 */
export default SignInView;
