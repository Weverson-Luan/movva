/**
 * IMPORTS
 */
import { SigninUpRepositoryImpl } from "@/modules/signin-up/data/repositories/signin-up-repository-impl";
import { SigninUpService } from "@/modules/signin-up/domain/use-cases/signin-up.service";
import { apiClient } from "@/shared/data/infra/http/axios";

// Único lugar que liga as camadas: troque o repositório aqui (ex.: um mock em testes).
const makeSigninUpService = () => {
  const signinUpRepository = new SigninUpRepositoryImpl(apiClient);
  return new SigninUpService(signinUpRepository);
};

/**
 * EXPORTS
 */
export { makeSigninUpService };
