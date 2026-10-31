/**
 * IMPORTS
 */

import type { DaySummaryTotal, JourneySummary } from "@/modules/dashboard/domain/models/journey-record";
import { isBreakRecord } from "@/modules/dashboard/domain/use-cases/summarize-journey";

// Totais do "Resumo do dia". O tempo corrente da atividade aberta entra só nos totais
// que ela afeta (`runningSince`); quem soma esse tempo é a apresentação, minuto a minuto.
// - work:   jornada desde o primeiro registro, com pausas (trabalho + pausas)
// - breaks: pausas
// - total:  trabalho líquido (work − breaks)
const buildDaySummary = ({
  completedWorkMinutes,
  completedBreakMinutes,
  active,
}: JourneySummary): DaySummaryTotal[] => {
  const activeStart = active?.startedAt ?? null;
  const isActiveBreak = active !== null && isBreakRecord(active.type);

  return [
    { kind: "work", baseMinutes: completedWorkMinutes + completedBreakMinutes, runningSince: activeStart },
    { kind: "breaks", baseMinutes: completedBreakMinutes, runningSince: isActiveBreak ? activeStart : null },
    { kind: "total", baseMinutes: completedWorkMinutes, runningSince: isActiveBreak ? null : activeStart },
  ];
};

/**
 * EXPORTS
 */
export { buildDaySummary };
