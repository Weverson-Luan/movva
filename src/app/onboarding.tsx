/**
 * IMPORTS
 */
import OnboardingView from "@/modules/onboarding/presentation/view/onboarding-view";
import { useOnboardingViewModel } from "@/modules/onboarding/presentation/view-model/onboarding-view-model";

// A rota liga o view-model à view: a view só recebe props.
const Onboarding = () => {
  const viewModel = useOnboardingViewModel();
  return <OnboardingView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default Onboarding;
