/**
 * IMPORTS
 */
import { useMutation } from "@tanstack/react-query";

// factory / signin
import { makeAuthServiceFactory } from "@/modules/signin/factories/make-auth-service";

// typings
import type { SignInHttpParams } from "@/shared/interfaces/http/signin";

// toast
import { showErrorToast } from "@/shared/utils/toast";

const authService = makeAuthServiceFactory();

const useSignInMutation = () => {
  const mutation = useMutation({
    mutationKey: ["auth", "signin"],
    mutationFn: (payload: SignInHttpParams) => authService.signIn(payload),
    onError: showErrorToast,
  });

  return mutation;
};

/**
 * EXPORTS
 */
export { useSignInMutation };
