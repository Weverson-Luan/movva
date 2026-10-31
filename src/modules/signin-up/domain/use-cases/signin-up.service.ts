/**
 * IMPORTS
 */
import type { ISigninUpRepository } from "@/modules/signin-up/domain/repositories/signin-up-repository";
import { AppError, UnexpectedError } from "@/shared/domain/errors";
import type { RegisterHttpParams, RegisterHttpResponse } from "@/shared/interfaces/http/register";

// Regras de negócio do cadastro. Não conhece axios nem React: recebe o repositório pronto.
class SigninUpService {
  constructor(private readonly signinUpRepository: ISigninUpRepository) {}

  async signinUp({ name, email, password, phone }: RegisterHttpParams): Promise<RegisterHttpResponse> {
    try {
      return await this.signinUpRepository.signinUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.replace(/\D/g, ""),
      });
    } catch (error) {
      // Erros HTTP já chegam como AppError com a mensagem do backend.
      // Qualquer outro erro vira UnexpectedError. Sempre relança para a mutation saber que falhou.
      throw error instanceof AppError ? error : new UnexpectedError();
    }
  }
}

/**
 * EXPORTS
 */
export { SigninUpService };
