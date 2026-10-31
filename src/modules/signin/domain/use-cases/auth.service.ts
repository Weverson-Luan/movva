/**
 * IMPORTS
 */
import type { ISignInRepository } from "@/modules/signin/domain/repositories/signin-repository-contract";

// errors
import { AppError, UnexpectedError } from "@/shared/domain/errors";

// typings
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

// Regras de negócio do login. Não conhece axios nem React: recebe o repositório pronto.
class AuthService {
  constructor(private readonly signInRepository: ISignInRepository) {}

  async signIn({ email, password }: SignInHttpParams): Promise<SignInHttpResponse> {
    try {
      return await this.signInRepository.signIn({
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (error) {
      // Erros HTTP já chegam como AppError com a mensagem do backend.
      // Qualquer outro erro vira UnexpectedError: daqui para cima só existe erro de domínio.
      // Sempre relança: é assim que a mutation sabe que falhou (toast, sem navegar).
      throw error instanceof AppError ? error : new UnexpectedError();
    }
  }
}

/**
 * EXPORTS
 */
export { AuthService };
