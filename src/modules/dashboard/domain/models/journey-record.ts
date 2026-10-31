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

type JourneySummary = {
  /** trabalho já encerrado (min) */
  completedWorkMinutes: number;
  /** pausas já encerradas (min) */
  completedBreakMinutes: number;
  /** registro em andamento (sem fim); começou quando o anterior terminou */
  active: JourneyRecordPeriod | null;
};

type DaySummaryTotalKind = "work" | "breaks" | "total";

type DaySummaryTotal = {
  kind: DaySummaryTotalKind;
  /** minutos já encerrados */
  baseMinutes: number;
  /** início da atividade aberta que soma neste total; null = total parado */
  runningSince: Date | null;
};

/**
 * EXPORTS
 */
export type {
  CompletedJourneyRecordPeriod,
  DaySummaryTotal,
  DaySummaryTotalKind,
  JourneyRecord,
  JourneyRecordPeriod,
  JourneyRecordType,
  JourneySummary,
};
