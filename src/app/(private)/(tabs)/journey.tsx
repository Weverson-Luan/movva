/**
 * IMPORTS
 */
import JourneyView from "@/modules/journey/presentation/view/journey-view";
import { useJourneyViewModel } from "@/modules/journey/presentation/view-model/journey-view-model";

// A rota liga o view-model à view: a view só recebe props.
const Journey = () => {
  const viewModel = useJourneyViewModel();
  return <JourneyView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default Journey;
