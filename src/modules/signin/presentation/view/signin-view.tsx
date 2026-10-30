/**
 * IMPORTS
 */
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import { useBrand, useTheme } from "@/brand/BrandProvider";
import { BrandButton } from "@/modules/dashboard/components/BrandButton";
import useSignInViewModel from "@/modules/signin/presentation/view-model/signin-view-model";

const SignInView = () => {
  const { displayName } = useBrand();
  const theme = useTheme();
  const { email, password, errors, isSubmitting, changeEmail, changePassword, signIn, goToSignUp } =
    useSignInViewModel();

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 justify-center gap-4 px-6">
        <Text className="text-3xl font-bold text-text">Hello World</Text>
        <Text className="mb-4 text-base text-muted">Entre na sua conta {displayName}</Text>

        <View className="gap-1">
          <TextInput
            className="rounded-brand bg-surface px-4 py-3.5 text-base text-text"
            placeholder="E-mail"
            placeholderTextColor={theme.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={changeEmail}
          />
          {errors.email && <Text className="text-sm text-primary">{errors.email}</Text>}
        </View>

        <View className="gap-1">
          <TextInput
            className="rounded-brand bg-surface px-4 py-3.5 text-base text-text"
            placeholder="Senha"
            placeholderTextColor={theme.muted}
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={changePassword}
            onSubmitEditing={signIn}
          />
          {errors.password && <Text className="text-sm text-primary">{errors.password}</Text>}
        </View>

        <BrandButton title={isSubmitting ? "Entrando..." : "Entrar"} onPress={signIn} />

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
