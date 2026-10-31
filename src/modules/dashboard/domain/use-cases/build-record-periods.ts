/**
 * IMPORTS
 */

import type { JourneyRecord, JourneyRecordPeriod } from "@/modules/dashboard/domain/models/journey-record";

const MS_PER_MINUTE = 60_000;

// Regra: o fim de uma atividade é sempre o início da próxima.
// Ordena por início; cada registro termina quando o seguinte começa. O último está
// em andamento (sem fim) e conta até `now`. Devolve em ordem cronológica.
const buildRecordPeriods = (records: JourneyRecord[], now: Date): JourneyRecordPeriod[] => {
  const ordered = [...records].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

  return ordered.map((record, index) => {
    const endedAt = ordered[index + 1]?.startedAt ?? null;
    const until = endedAt ?? now;
    const durationMinutes = Math.max(0, Math.floor((until.getTime() - record.startedAt.getTime()) / MS_PER_MINUTE));

    return { ...record, endedAt, durationMinutes };
  });
};

/**
 * EXPORTS
 */
export { buildRecordPeriods };
