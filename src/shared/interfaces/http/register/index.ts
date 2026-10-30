/**
 * IMPORTS
 */

import type { UserInterface } from "../user";

interface RegisterHttpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterHttpResponse {
  token: string;
  user: UserInterface;
  refresh_token: string;
}

/**
 * EXPORT
 */
export type { RegisterHttpParams, RegisterHttpResponse };
