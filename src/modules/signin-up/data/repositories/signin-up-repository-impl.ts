/**
 * IMPORTS
 */
import type { AxiosInstance } from "axios";
import type { ISigninUpRepository } from "@/modules/signin-up/domain/repositories/signin-up-repository";
import type { RegisterHttpParams, RegisterHttpResponse } from "@/shared/interfaces/http/register";

class SigninUpRepositoryImpl implements ISigninUpRepository {
  constructor(private readonly http: AxiosInstance) {}

  async signinUp(params: RegisterHttpParams): Promise<RegisterHttpResponse> {
    const { data } = await this.http.post<RegisterHttpResponse>("/auth/register", params);
    return data;
  }
}

/**
 * EXPORTS
 */
export { SigninUpRepositoryImpl };
