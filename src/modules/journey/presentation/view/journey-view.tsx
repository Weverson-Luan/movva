/**
 * IMPORTS
 */
import type { FC } from "react";
import { Text } from "react-native";
// view-model - journey
import type { JourneyViewModel } from "@/modules/journey/presentation/view-model/journey-view-model";
import { AppHeader } from "@/shared/components/ui/app-header";
import { Screen } from "@/shared/components/ui/screen";

const JourneyView: FC<JourneyViewModel> = ({ header, title, description }) => {
  return (
    <Screen header={<AppHeader {...header} />} edges={["top"]} scroll contentClassName="gap-2 p-5">
      <Text className="text-2xl font-bold text-text" accessibilityRole="header">
        {title}
      </Text>
      <Text className="text-base text-muted">{description}</Text>
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default JourneyView;
