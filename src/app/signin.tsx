/**
 * IMPORTS
 */

import SignInView from "@/modules/signin/presentation/view/signin-view";
import { useSignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";

// A rota liga o view-model à view: a view só recebe props.
const SignIn = () => {
  const viewModel = useSignInViewModel();
  return <SignInView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default SignIn;
