/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

// mutation / signin
import { useSignInMutation } from "@/modules/signin/presentation/hooks/queries/auth/use-signin-mutation";

// typings / schema
import { type SignInFormData, signInSchema } from "./signin-schema";

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

  // Erro: o service já trata e a mutation mostra o toast. Aqui só o caminho de sucesso.
  const onSubmit = handleSubmit((signInData) => {
    signInMutation.mutate(signInData, {
      onSuccess: () => {
        router.replace("/(private)/dashboard");
      },
    });
  });

  const goToSignUp = () => {
    router.push("/signin-up");
  };

  return {
    control,
    onSubmit,
    goToSignUp,
    isSubmitting: signInMutation.isPending,
  };
};

type SignInViewModel = ReturnType<typeof useSignInViewModel>;

/**
 * EXPORTS
 */
export type { SignInViewModel };
export { useSignInViewModel };
