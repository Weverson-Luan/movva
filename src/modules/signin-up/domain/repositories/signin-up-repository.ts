/**
 * IMPORTS
 */
import type { RegisterHttpParams, RegisterHttpResponse } from "@/shared/interfaces/http/register";

// Contrato do domínio: o service depende disto, não do axios.
interface ISigninUpRepository {
  signinUp(params: RegisterHttpParams): Promise<RegisterHttpResponse>;
}

/**
 * EXPORTS
 */
export type { ISigninUpRepository };
