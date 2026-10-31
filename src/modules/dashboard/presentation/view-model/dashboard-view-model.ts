/**
 * IMPORTS
 */
import { useCallback, useMemo } from "react";
import { Linking } from "react-native";
import type {
  CompletedJourneyRecordPeriod,
  JourneyRecord,
  JourneyRecordType,
} from "@/modules/dashboard/domain/models/journey-record";
import { buildRecordHistory } from "@/modules/dashboard/domain/use-cases/build-record-history";
import { formatDayLabel, getFirstName, getGreeting } from "@/modules/dashboard/utils/greeting";
import { formatDuration, formatPeriod } from "@/modules/dashboard/utils/record-format";
import { useBrand } from "@/shared/brand/BrandProvider";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";

// Fixos até a API devolver a base do motorista, as notificações e o status da jornada.
const HEADER_SUBTITLE = "Jornada • Belo Horizonte - MG";
const HAS_UNREAD_NOTIFICATIONS = true;
const IS_NEAR_REST = true;

type JourneyStatus = "working" | "paused" | "resting";

type JourneyTodayData = {
  /** define a cor do ponto do selo */
  status: JourneyStatus;
  /** texto do selo (ex.: "Em trabalho") */
  statusLabel: string;
  /** tempo trabalhado (ex.: "04h 12min") */
  workedLabel: string;
  /** ex.: "Início 07:00" */
  startLabel: string;
  /** ex.: "Pausas 30min" */
  breaksLabel: string;
};

// Fixo até existir o endpoint de jornada.
const JOURNEY_TODAY: JourneyTodayData = {
  status: "working",
  statusLabel: "Em trabalho",
  workedLabel: "04h 12min",
  startLabel: "Início 07:00",
  breaksLabel: "Pausas 30min",
};

type DaySummaryKind = "work" | "breaks" | "total";

type DaySummaryItem = {
  /** qual total é; a view escolhe o ícone por aqui */
  key: DaySummaryKind;
  /** rótulo do total (ex.: "Pausas") */
  label: string;
  /** duração formatada (ex.: "00:30") */
  value: string;
};

// Fixo até existir o endpoint de jornada.
const DAY_SUMMARY: DaySummaryItem[] = [
  { key: "work", label: "Trabalho", value: "04:00" },
  { key: "breaks", label: "Pausas", value: "00:30" },
  { key: "total", label: "Total trabalho", value: "03:30" },
];

type TodayRecordType = JourneyRecordType;

type TodayRecordSyncStatus = "synced" | "pending";

type TodayRecordItem = {
  key: string;
  /** tipo do registro; a view escolhe o ícone por aqui */
  type: TodayRecordType;
  title: string;
  /** início às fim (ex.: "21/10/2026 09:30 às 21/10/2026 11:00"); fim = início do próximo */
  periodLabel: string;
  /** envio ao servidor; a view mostra o selo (Sincronizada / Pendente) */
  syncStatus: TodayRecordSyncStatus;
  /** ex.: "2h 02min" */
  durationLabel: string;
};

// Mock até existir o endpoint de registros: só o início de cada um (hoje, horário fixo).
// Fim e duração saem da regra de domínio (buildRecordPeriods).
const todayAt = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const buildMockRecords = (): JourneyRecord[] => [
  { id: "record-1", type: "clock-in", title: "Operação com veículo", startedAt: todayAt(7, 0), isSynced: true },
  { id: "record-2", type: "meal", title: "Refeição", startedAt: todayAt(9, 40), isSynced: false },
  { id: "record-3", type: "operation", title: "Operação com veículo", startedAt: todayAt(10, 10), isSynced: false },
];

// Registro encerrado (domínio) → linha da timeline (texto pronto).
const toTodayRecordItem = (period: CompletedJourneyRecordPeriod): TodayRecordItem => ({
  key: period.id,
  type: period.type,
  title: period.title,
  periodLabel: formatPeriod(period.startedAt, period.endedAt),
  syncStatus: period.isSynced ? "synced" : "pending",
  durationLabel: formatDuration(period.durationMinutes),
});

type WelcomeGreetingTone = "default" | "warning";

type WelcomeGreetingData = {
  /** data do dia (ex.: "sexta-feira, 30 de outubro"); sai em caixa alta */
  dateLabel: string;
  /** saudação com o nome (ex.: "Boa tarde, Carlos.") */
  title: string;
  /** status da jornada abaixo da saudação */
  message: string;
  /** `warning` destaca a mensagem (ex.: perto do repouso) */
  tone: WelcomeGreetingTone;
};

// Estado da tela inicial. A view só desenha o que vem daqui.
const useDashboardViewModel = () => {
  const userName = useUserStore((state) => state.user?.name ?? "");

  const welcome = useMemo<WelcomeGreetingData>(() => {
    const now = new Date();
    const firstName = getFirstName(userName);
    return {
      dateLabel: formatDayLabel(now),
      title: firstName ? `${getGreeting(now)}, ${firstName}.` : `${getGreeting(now)}.`,
      message: IS_NEAR_REST ? "Está próximo de entrar em repouso." : "Sua jornada em um só lugar.",
      tone: IS_NEAR_REST ? "warning" : "default",
    };
  }, [userName]);

  // Só registros encerrados; fim = início do próximo (regras no domínio).
  const todayRecords = useMemo(() => buildRecordHistory(buildMockRecords(), new Date()).map(toTodayRecordItem), []);

  return {
    header: {
      subtitle: HEADER_SUBTITLE,
      userName,
      hasUnreadNotifications: HAS_UNREAD_NOTIFICATIONS,
    },
    welcome,
    journeyToday: JOURNEY_TODAY,
    daySummary: DAY_SUMMARY,
    todayRecords,
  };
};

type DashboardViewModel = ReturnType<typeof useDashboardViewModel>;

/**
 * EXPORTS
 */
export type {
  DashboardViewModel,
  DaySummaryItem,
  DaySummaryKind,
  JourneyStatus,
  JourneyTodayData,
  TodayRecordItem,
  TodayRecordSyncStatus,
  TodayRecordType,
  WelcomeGreetingData,
  WelcomeGreetingTone,
};
export { useDashboardViewModel };
