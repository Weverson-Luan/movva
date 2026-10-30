/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

// mutation / signin
import { useSignInMutation } from "@/modules/signin/presentation/hooks/queries/auth/use-signin-mutation";

// typings / schema
import { type SignInFormData, signInSchema } from "./signin-schema";

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
  const signInMutation = useSignInMutation();

  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (signInData) => {
    try {
      await signInMutation.mutateAsync(signInData);
      // TODO: guardar a sessão no useUserStore (authSignin) antes de navegar.
      router.replace("/(private)/dashboard");
    } catch {
      // O erro já fica em signInMutation.error e aparece como apiError.
    }
  });

  const goToSignUp = () => {
    router.push("/signin-up");
  };

  return {
    control,
    onSubmit,
    goToSignUp,
    isSubmitting: signInMutation.isPending,
    apiError: signInMutation.isError ? getErrorMessage(signInMutation.error) : undefined,
  };
};

type SignInViewModel = ReturnType<typeof useSignInViewModel>;

/**
 * EXPORTS
 */
export type { SignInViewModel };
export { useSignInViewModel };
