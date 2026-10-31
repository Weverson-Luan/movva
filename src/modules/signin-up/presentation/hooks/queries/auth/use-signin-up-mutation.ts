/**
 * IMPORTS
 */
import { useMutation } from "@tanstack/react-query";

// factory / signin-up
import { makeSigninUpService } from "@/modules/signin-up/factories/make-signin-up-service";

// typings
import type { RegisterHttpParams } from "@/shared/interfaces/http/register";

// toast
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

const signinUpService = makeSigninUpService();

const useSigninUpMutation = () => {
  const mutation = useMutation({
    mutationKey: ["auth", "signin-up"],
    mutationFn: (payload: RegisterHttpParams) => signinUpService.signinUp(payload),
    onSuccess: () => showSuccessToast("Conta criada!"),
    onError: showErrorToast,
  });

  return mutation;
};

/**
 * EXPORTS
 */
export { useSigninUpMutation };
