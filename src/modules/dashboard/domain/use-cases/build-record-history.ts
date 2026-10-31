/**
 * IMPORTS
 */

import type {
  CompletedJourneyRecordPeriod,
  JourneyRecord,
  JourneyRecordPeriod,
} from "@/modules/dashboard/domain/models/journey-record";
import { buildRecordPeriods } from "@/modules/dashboard/domain/use-cases/build-record-periods";

const isCompleted = (period: JourneyRecordPeriod): period is CompletedJourneyRecordPeriod => period.endedAt !== null;

// Regra: o histórico nunca exibe atividade em andamento — só registros encerrados
// (fim = início do próximo). Devolve do mais recente para o mais antigo.
const buildRecordHistory = (records: JourneyRecord[], now: Date): CompletedJourneyRecordPeriod[] => {
  return buildRecordPeriods(records, now).filter(isCompleted).reverse();
};

/**
 * EXPORTS
 */
export { buildRecordHistory };
