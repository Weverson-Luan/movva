/**
 * IMPORTS
 */
import DashboardView from "@/modules/dashboard/presentation/view/dashboard-view";
import { useDashboardViewModel } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

// A rota liga o view-model à view: a view só recebe props.
const Dashboard = () => {
  const viewModel = useDashboardViewModel();
  return <DashboardView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default Dashboard;
