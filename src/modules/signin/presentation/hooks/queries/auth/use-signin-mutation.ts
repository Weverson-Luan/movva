/**
 * IMPORTS
 */
import { useMutation } from "@tanstack/react-query";

// factory / signin
import { makeAuthService } from "@/modules/signin/factories/make-auth-service";

// typings
import type { SignInHttpParams } from "@/shared/interfaces/http/signin";

const authService = makeAuthService();

const useSignInMutation = () => {
  const mutation = useMutation({
    mutationKey: ["auth", "signin"],
    mutationFn: (payload: SignInHttpParams) => authService.signIn(payload),
  });

  return mutation;
};

/**
 * EXPORTS
 */
export { useSignInMutation };
