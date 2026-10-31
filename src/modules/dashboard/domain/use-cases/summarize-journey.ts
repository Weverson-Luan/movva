/**
 * IMPORTS
 */

import type {
  JourneyRecordPeriod,
  JourneyRecordType,
  JourneySummary,
} from "@/modules/dashboard/domain/models/journey-record";

// Tipos que contam como pausa; o resto é trabalho.
const BREAK_TYPES: JourneyRecordType[] = ["meal"];

const isBreakRecord = (type: JourneyRecordType) => BREAK_TYPES.includes(type);

// Resumo do dia a partir dos períodos (fim = início do próximo).
// Totais só com registros encerrados; o em andamento fica em `active` para a
// apresentação somar o tempo corrente sem recalcular a lista.
const summarizeJourney = (periods: JourneyRecordPeriod[]): JourneySummary => {
  let completedWorkMinutes = 0;
  let completedBreakMinutes = 0;

  for (const period of periods) {
    if (period.endedAt === null) continue;
    if (isBreakRecord(period.type)) completedBreakMinutes += period.durationMinutes;
    else completedWorkMinutes += period.durationMinutes;
  }

  return {
    completedWorkMinutes,
    completedBreakMinutes,
    active: periods.find((period) => period.endedAt === null) ?? null,
  };
};

/**
 * EXPORTS
 */
export { isBreakRecord, summarizeJourney };
