/**
 * IMPORTS
 */

import type { UserInterface } from "../user";

interface RegisterHttpParams {
  name: string;
  email: string;
  age: string;
}

interface RegisterHttpResponse {
  access_token: string;
  user: UserInterface;
  refresh_token: string;
}

/**
 * EXPORT
 */
export type { RegisterHttpParams, RegisterHttpResponse };
