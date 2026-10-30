/**
 * IMPORTS
 */
import type { AxiosInstance } from "axios";
import type { ISignInRepository } from "@/modules/signin/domain/repositories/signin-repository";
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

class SignInRepositoryImpl implements ISignInRepository {
  constructor(private readonly http: AxiosInstance) {}

  async signIn(params: SignInHttpParams): Promise<SignInHttpResponse> {
    const { data } = await this.http.post<SignInHttpResponse>("/auth/login", params);
    return data;
  }
}

/**
 * EXPORTS
 */
export { SignInRepositoryImpl };
