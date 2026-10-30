/**
 * IMPORTS
 */
import * as yup from "yup";

const signInSchema = yup.object({
  email: yup.string().trim().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

type SignInFormData = yup.InferType<typeof signInSchema>;

/**
 * EXPORTS
 */
export type { SignInFormData };
export { signInSchema };
