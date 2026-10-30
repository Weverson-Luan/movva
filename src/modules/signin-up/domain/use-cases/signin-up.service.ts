/**
 * IMPORTS
 */
import type { ISigninUpRepository } from "@/modules/signin-up/domain/repositories/signin-up-repository";
import type { RegisterHttpParams, RegisterHttpResponse } from "@/shared/interfaces/http/register";

// Regras de negócio do cadastro. Não conhece axios nem React: recebe o repositório pronto.
class SigninUpService {
  constructor(private readonly signinUpRepository: ISigninUpRepository) {}

  async signinUp({ name, email, password, phone }: RegisterHttpParams): Promise<RegisterHttpResponse> {
    return this.signinUpRepository.signinUp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.replace(/\D/g, ""),
    });
  }
}

/**
 * EXPORTS
 */
export { SigninUpService };
