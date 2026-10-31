/**
 * IMPORTS
 */
import type { FC } from "react";
import { DaySummary } from "@/modules/dashboard/components/day-summary";
import { JourneyTodayCard } from "@/modules/dashboard/components/journey-today-card";
import { LastUpdated } from "@/modules/dashboard/components/last-updated";
import { TodayRecords } from "@/modules/dashboard/components/today-records";
import { WelcomeGreeting } from "@/modules/dashboard/components/welcome-greeting";
// view-model - dashboard
import type { DashboardViewModel } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";
import { AppHeader } from "@/shared/components/ui/app-header";
import { Screen } from "@/shared/components/ui/screen";

const DashboardView: FC<DashboardViewModel> = ({
  header,
  welcome,
  journeyToday,
  daySummary,
  todayRecords,
  lastUpdatedLabel,
}) => {
  return (
    <Screen header={<AppHeader {...header} />} scroll contentClassName="gap-4 p-5">
      <WelcomeGreeting {...welcome} />

      <JourneyTodayCard {...journeyToday} />

      <DaySummary items={daySummary} />

      <TodayRecords items={todayRecords} />

      <LastUpdated label={lastUpdatedLabel} />
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default DashboardView;
