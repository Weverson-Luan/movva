/**
 * IMPORTS
 */
import SyncView from "@/modules/sync/presentation/view/sync-view";
import { useSyncViewModel } from "@/modules/sync/presentation/view-model/sync-view-model";

// A rota liga o view-model à view: a view só recebe props.
const Sync = () => {
  const viewModel = useSyncViewModel();
  return <SyncView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default Sync;
