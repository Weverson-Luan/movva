/**
 * IMPORTS
 */
import type { ISignInRepository } from "@/modules/signin/domain/repositories/signin-repository-contract";
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

// Atraso para o loading do botão aparecer como numa chamada real.
const MOCK_DELAY_MS = 800;

// Login falso para desenvolver sem API: aceita qualquer e-mail/senha.
// Ligado pela factory quando EXPO_PUBLIC_MOCK_API=true (.env.local).
class SignInRepositoryMock implements ISignInRepository {
  async signIn({ email }: SignInHttpParams): Promise<SignInHttpResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    return {
      access_token: "mock-access-token",
      user: { id: "mock-user", name: email.split("@")[0] || "Motorista" },
    };
  }
}

/**
 * EXPORTS
 */
export { SignInRepositoryMock };
