/**
 * IMPORTS
 */
import { SignInRepositoryImpl } from "@/modules/signin/data/repositories/signin-repository-impl";
import { SignInRepositoryMock } from "@/modules/signin/data/repositories/signin-repository-mock";
import { AuthService } from "@/modules/signin/domain/use-cases/auth.service";
import { apiClient } from "@/shared/data/infra/http/axios";

// Único lugar que liga as camadas: troque o repositório aqui (ex.: um mock em testes).
// EXPO_PUBLIC_MOCK_API=true no .env.local usa o login falso (sem API).
const makeAuthServiceFactory = () => {
  const signInRepository =
    process.env.EXPO_PUBLIC_MOCK_API === "true" ? new SignInRepositoryMock() : new SignInRepositoryImpl(apiClient);
  return new AuthService(signInRepository);
};

/**
 * EXPORTS
 */
export { makeAuthServiceFactory };
