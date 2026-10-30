/**
 * IMPORTS
 */

import SigninUpView from "@/modules/signin-up/presentation/view/signin-up-view";
import { useSigninUpViewModel } from "@/modules/signin-up/presentation/view-model/signin-up-view-model";

// A rota liga o view-model à view: a view só recebe props.
const SigninUp = () => {
  const viewModel = useSigninUpViewModel();
  return <SigninUpView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default SigninUp;
