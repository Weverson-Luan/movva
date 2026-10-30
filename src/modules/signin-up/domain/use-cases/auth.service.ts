/**
 * IMPORTS
 */
import type { ISignInRepository } from "@/modules/signin/domain/repositories/signin-repository";
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

// Regras de negócio do login. Não conhece axios nem React: recebe o repositório pronto.
class AuthService {
  constructor(private readonly signInRepository: ISignInRepository) {}

  async signIn({ email, password }: SignInHttpParams): Promise<SignInHttpResponse> {
    return this.signInRepository.signIn({
      email: email.trim().toLowerCase(),
      password,
    });
  }
}

/**
 * EXPORTS
 */
export { AuthService };
