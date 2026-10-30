/**
 * IMPORTS
 */
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { useSignInMutation } from "@/modules/signin/presentation/hooks/queries/auth/use-signin-mutation";

type SignInErrors = {
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (email: string, password: string): SignInErrors => {
  const errors: SignInErrors = {};

  if (!email.trim()) errors.email = "Informe seu e-mail.";
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = "E-mail inválido.";

  if (!password) errors.password = "Informe sua senha.";

  return errors;
};

// Converte o erro da API em uma mensagem para o usuário.
const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return "E-mail ou senha incorretos.";
    if (!error.response) return "Sem conexão com o servidor. Tente novamente.";
  }
  return "Não foi possível entrar. Tente novamente.";
};

// Estado e regras da tela de login. A view só desenha o que vem daqui.
const useSignInViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const signInMutation = useSignInMutation();

  // Ao digitar, some o erro daquele campo e o erro da API.
  const changeEmail = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    signInMutation.reset();
  };

  const changePassword = (value: string) => {
    setPassword(value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    signInMutation.reset();
  };

  const signIn = () => {
    if (signInMutation.isPending) return;

    const validation = validate(email, password);
    setErrors(validation);
    if (validation.email || validation.password) return;

    signInMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          // TODO: guardar o access_token (ex.: expo-secure-store) antes de navegar.
          router.replace("/(private)/dashboard");
        },
      },
    );
  };

  const goToSignUp = () => {
    router.push("/signin-up");
  };

  return {
    email,
    password,
    errors,
    apiError: signInMutation.isError ? getErrorMessage(signInMutation.error) : undefined,
    isSubmitting: signInMutation.isPending,
    changeEmail,
    changePassword,
    signIn,
    goToSignUp,
  };
};

/**
 * EXPORTS
 */
export type SignInViewModel = ReturnType<typeof useSignInViewModel>;
export default useSignInViewModel;
