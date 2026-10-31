/**
 * IMPORTS
 */
import type { FC } from "react";
import { Text, View } from "react-native";
import { DaySummary } from "@/modules/dashboard/components/day-summary";
import { JourneyTodayCard } from "@/modules/dashboard/components/journey-today-card";
import { TodayRecords } from "@/modules/dashboard/components/today-records";
import { WelcomeGreeting } from "@/modules/dashboard/components/welcome-greeting";
// view-model - dashboard
import type { DashboardViewModel } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";
import { Feature } from "@/shared/brand/BrandProvider";
import { AppHeader } from "@/shared/components/ui/app-header";
import { Button } from "@/shared/components/ui/button";
import { Screen } from "@/shared/components/ui/screen";

type CardProps = { title: string; text: string };

const Card = ({ title, text }: CardProps) => {
  return (
    <View className="gap-1 rounded-brand bg-surface p-4">
      <Text className="text-[17px] font-semibold text-primary">{title}</Text>
      <Text className="text-text">{text}</Text>
    </View>
  );
};

const DashboardView: FC<DashboardViewModel> = ({ header, welcome, journeyToday, daySummary, todayRecords }) => {
  return (
    <Screen header={<AppHeader {...header} />} scroll contentClassName="gap-4 p-5">
      <WelcomeGreeting {...welcome} />

      <JourneyTodayCard {...journeyToday} />

      <DaySummary items={daySummary} />

      <TodayRecords items={todayRecords} />
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default DashboardView;
