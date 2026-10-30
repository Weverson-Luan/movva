/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";

// mutation / signin-up
import { useSigninUpMutation } from "@/modules/signin-up/presentation/hooks/queries/auth/use-signin-up-mutation";

// typings / schema
import { type SigninUpFormData, singinUpScheme } from "./use-signin-schema";

// Converte o erro da API em uma mensagem para o usuário.
const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 409) return "Já existe uma conta com este e-mail.";
    if (!error.response) return "Sem conexão com o servidor. Tente novamente.";
  }
  return "Não foi possível criar sua conta. Tente novamente.";
};

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

  const onSubmit = handleSubmit(async (userData) => {
    // confirmPassword só existe para validar o formulário: não vai para a API.
    const { confirmPassword: _confirmPassword, ...signinUpData } = userData;

    try {
      await signinUpMutation.mutateAsync(signinUpData);
    } catch {
      // O erro já fica em signinUpMutation.error e aparece como apiError.
    }
  });

  return {
    control,
    errors,
    onSubmit,
    isSubmitting: signinUpMutation.isPending,
    apiError: signinUpMutation.isError ? getErrorMessage(signinUpMutation.error) : undefined,
  };
};

/**
 * EXPORTS
 */
export { useSigninUpViewModel };
