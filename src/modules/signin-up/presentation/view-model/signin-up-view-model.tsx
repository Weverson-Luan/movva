/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// mutation / signin-up
import { useSigninUpMutation } from "@/modules/signin-up/presentation/hooks/queries/auth/use-signin-up-mutation";

// typings / schema
import { type SigninUpFormData, singinUpScheme } from "./use-signin-schema";

const useSigninUpViewModel = () => {
  const signinUpMutation = useSigninUpMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninUpFormData>({
    resolver: yupResolver(singinUpScheme),
    defaultValues: {
      name: "",
      phone: "",
      confirmPassword: "",
      password: "",
      email: "",
    },
  });

  // Erro: o service já trata e a mutation mostra o toast.
  const onSubmit = handleSubmit((userData) => {
    // confirmPassword só existe para validar o formulário: não vai para a API.
    const { confirmPassword: _confirmPassword, ...signinUpData } = userData;

    signinUpMutation.mutate(signinUpData);
  });

  return {
    control,
    errors,
    onSubmit,
    isSubmitting: signinUpMutation.isPending,
  };
};

/**
 * EXPORTS
 */
export { useSigninUpViewModel };
