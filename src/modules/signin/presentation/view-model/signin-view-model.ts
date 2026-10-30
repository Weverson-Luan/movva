/**
 * IMPORTS
 */
import { router } from "expo-router";
import { useState } from "react";

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

// Estado e regras da tela de login. A view só desenha o que vem daqui.
const useSignInViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ao digitar, some o erro daquele campo.
  const changeEmail = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const changePassword = (value: string) => {
    setPassword(value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const signIn = async () => {
    if (isSubmitting) return;

    const validation = validate(email, password);
    setErrors(validation);
    if (validation.email || validation.password) return;

    setIsSubmitting(true);
    try {
      // TODO: chamar a API de login (useBrand().apiUrl) e guardar o token.
      router.replace("/(private)/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToSignUp = () => {
    router.push("/signin-up");
  };

  return {
    email,
    password,
    errors,
    isSubmitting,
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
