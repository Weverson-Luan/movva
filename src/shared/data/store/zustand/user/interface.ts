/**
 * IMPORTS
 */

import type { UserInterface } from "@/shared/interfaces/http/user";

interface SetSessionParams {
  user: UserInterface;
  token: string;
  /** opcional: o login ainda não devolve refresh token */
  refreshToken?: string;
}

interface UpdateTokensParams {
  token: string;
  refreshToken: string;
}

interface UserStore {
  user: UserInterface | null;
  token: string | null;
  refreshToken: string | null;

  /** fazer secao de usuario */
  authSignin: (sessionData: SetSessionParams) => void;

  /** fazer atualizacao de tokens de usuario */
  updateTokens: (updateTokensParams: UpdateTokensParams) => void;

  /** fazer logout do usuario */
  logout: () => void;
}

/**
 * EXPORTS
 */
export type { SetSessionParams, UpdateTokensParams, UserStore };
