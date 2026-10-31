/**
 * IMPORTS
 */
import SplashView from "@/modules/splash/presentation/view/splash-view";
import { useSplashViewModel } from "@/modules/splash/presentation/view-model/splash-view-model";

// A rota liga o view-model à view: a view só recebe props.
const Splash = () => {
  const viewModel = useSplashViewModel();
  return <SplashView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default Splash;
