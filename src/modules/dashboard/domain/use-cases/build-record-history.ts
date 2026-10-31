/**
 * IMPORTS
 */

import type {
  CompletedJourneyRecordPeriod,
  JourneyRecordPeriod,
} from "@/modules/dashboard/domain/models/journey-record";

const isCompleted = (period: JourneyRecordPeriod): period is CompletedJourneyRecordPeriod => period.endedAt !== null;

// Regra: o histórico nunca exibe atividade em andamento — só registros encerrados.
// Recebe os períodos de buildRecordPeriods (fim = início do próximo) e devolve do
// mais recente para o mais antigo.
const buildRecordHistory = (periods: JourneyRecordPeriod[]): CompletedJourneyRecordPeriod[] => {
  return periods.filter(isCompleted).reverse();
};

/**
 * EXPORTS
 */
export { buildRecordHistory };
