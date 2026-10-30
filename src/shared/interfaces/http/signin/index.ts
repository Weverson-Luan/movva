/**
 * IMPORTS
 */
import type { UserInterface } from "../user";

interface SignInHttpParams {
  email: string;
  password: string;
}

interface SignInHttpResponse {
  access_token: string;
  user: UserInterface;
}

/**
 * EXPORTS
 */
export type { SignInHttpParams, SignInHttpResponse };
