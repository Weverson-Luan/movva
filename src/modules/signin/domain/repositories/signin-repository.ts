/**
 * IMPORTS
 */
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

// Contrato do domínio: o service depende disto, não do axios.
interface ISignInRepository {
  signIn(params: SignInHttpParams): Promise<SignInHttpResponse>;
}

/**
 * EXPORTS
 */
export type { ISignInRepository };
