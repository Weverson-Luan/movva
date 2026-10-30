/**
 * IMPORTS
 */
import { SignInRepositoryImpl } from "@/modules/signin/data/repositories/signin-repository-impl";
import { AuthService } from "@/modules/signin/domain/use-cases/auth.service";
import { apiClient } from "@/shared/data/infra/http/axios";

// Único lugar que liga as camadas: troque o repositório aqui (ex.: um mock em testes).
const makeAuthService = () => {
  const signInRepository = new SignInRepositoryImpl(apiClient);
  return new AuthService(signInRepository);
};

/**
 * EXPORTS
 */
export { makeAuthService };
