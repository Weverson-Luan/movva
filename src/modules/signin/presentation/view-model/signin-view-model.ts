/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

// mutation / signin
import { useSignInMutation } from "@/modules/signin/presentation/hooks/queries/auth/use-signin-mutation";

import { useUserStore } from "@/shared/data/store/zustand/user/user-store";
import { useNextEntryRoute } from "@/shared/presentation/routes/hooks/use-next-entry-route";
import { ROUTES } from "@/shared/presentation/routes/routes";

// typings / schema
import { type SignInFormData, signInSchema } from "./signin-schema";

// Estado e regras da tela de login. A view só desenha o que vem daqui.
const useSignInViewModel = () => {
  const signInMutation = useSignInMutation();
  const authSignin = useUserStore((state) => state.authSignin);
  const nextEntryRoute = useNextEntryRoute();

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
      // Grava a sessão e segue o fluxo de entrada (onboarding e sync na primeira vez).
      onSuccess: ({ access_token, user }) => {
        authSignin({ user, token: access_token });
        router.replace(nextEntryRoute());
      },
    });
  });

  const goToSignUp = () => {
    router.push(ROUTES.signinUp);
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
