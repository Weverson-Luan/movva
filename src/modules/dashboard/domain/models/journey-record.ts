/**
 * IMPORTS
 */

type JourneyRecordType = "operation" | "meal" | "clock-in";

// Registro da jornada como guardado: só o início. Fim e duração são derivados
// (ver buildRecordPeriods) — o fim de um registro é sempre o início do próximo.
type JourneyRecord = {
  id: string;
  type: JourneyRecordType;
  title: string;
  startedAt: Date;
  /** já enviado ao servidor */
  isSynced: boolean;
};

type JourneyRecordPeriod = JourneyRecord & {
  /** início do registro seguinte; `null` no registro em andamento */
  endedAt: Date | null;
  /** até `endedAt`, ou até agora no registro em andamento */
  durationMinutes: number;
};

// Registro já encerrado (o próximo começou): o único que entra no histórico.
type CompletedJourneyRecordPeriod = JourneyRecordPeriod & { endedAt: Date };

/**
 * EXPORTS
 */
export type { CompletedJourneyRecordPeriod, JourneyRecord, JourneyRecordPeriod, JourneyRecordType };
