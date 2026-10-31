/**
 * IMPORTS
 */
import { useAppHeader } from "@/shared/hooks/use-app-header";

// Estado da tela de jornada. Placeholder até existir o resumo da jornada.
const useJourneyViewModel = () => {
  const header = useAppHeader("Resumo da jornada");

  return {
    header,
    title: "Jornada",
    description: "Em breve, o resumo completo da sua jornada aparece aqui.",
  };
};

type JourneyViewModel = ReturnType<typeof useJourneyViewModel>;

/**
 * EXPORTS
 */
export type { JourneyViewModel };
export { useJourneyViewModel };
