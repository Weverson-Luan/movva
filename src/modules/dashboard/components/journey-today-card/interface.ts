/**
 * IMPORTS
 */

import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { JourneyStatus, JourneyTodayData } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

type JourneyTodayCardProps = JourneyTodayData & {
  /** abre o acompanhamento da jornada */
  onPressTrack?: () => void;
};

type JourneyStatusBadgeProps = {
  status: JourneyStatus;
  label: string;
};

type JourneyMetaItemProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
};

/**
 * EXPORTS
 */
export type { JourneyMetaItemProps, JourneyStatusBadgeProps, JourneyTodayCardProps };
