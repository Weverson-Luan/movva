/**
 * IMPORTS
 */

import type { JourneyStatus, JourneyTodayData } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";

type JourneyTodayCardProps = JourneyTodayData;

type JourneyStatusBadgeProps = {
  status: JourneyStatus;
  label: string;
};

type WorkedDurationProps = {
  /** trabalho já encerrado (min) */
  baseMinutes: number;
  /** início da atividade de trabalho em andamento (ms); null = não soma tempo corrente */
  activeStartedAtMs: number | null;
};

type PeriodElapsedProps = {
  /** ex.: "Período atual desde 09:40" */
  sinceLabel: string;
  /** início da atividade em andamento (ms) */
  startedAtMs: number;
};

/**
 * EXPORTS
 */
export type { JourneyStatusBadgeProps, JourneyTodayCardProps, PeriodElapsedProps, WorkedDurationProps };
