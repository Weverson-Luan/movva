/**
 * IMPORTS
 */
import { useCallback, useMemo } from "react";
import { Linking } from "react-native";
import { formatDayLabel, getFirstName, getGreeting } from "@/modules/dashboard/utils/greeting";
import { useBrand } from "@/shared/brand/BrandProvider";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";

// Fixos até a API devolver a base do motorista, as notificações e o status da jornada.
const HEADER_SUBTITLE = "Jornada • Belo Horizonte - MG";
const HAS_UNREAD_NOTIFICATIONS = true;
const IS_NEAR_REST = true;

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
  const { supportEmail, apiUrl } = useBrand();
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

  const onContactSupport = useCallback(() => {
    void Linking.openURL(`mailto:${supportEmail}`);
  }, [supportEmail]);

  return {
    header: {
      subtitle: HEADER_SUBTITLE,
      userName,
      hasUnreadNotifications: HAS_UNREAD_NOTIFICATIONS,
    },
    welcome,
    daySummary: DAY_SUMMARY,
    apiUrl,
    onContactSupport,
  };
};

type DashboardViewModel = ReturnType<typeof useDashboardViewModel>;

/**
 * EXPORTS
 */
export type { DashboardViewModel, DaySummaryItem, DaySummaryKind, WelcomeGreetingData, WelcomeGreetingTone };
export { useDashboardViewModel };
