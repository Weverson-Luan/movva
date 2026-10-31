/**
 * IMPORTS
 */
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { useNextEntryRoute } from "@/shared/hooks/use-next-entry-route";

// Tempo da barra de carregamento (a View anima e avisa no fim).
const SPLASH_DURATION_MS = 2200;

const useSplashViewModel = () => {
  const nextEntryRoute = useNextEntryRoute();

  // A splash animada assume o lugar da nativa assim que monta.
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  // Sem sessão vai para o login; com sessão, retoma a etapa pendente (onboarding, sync) ou o dashboard.
  const onFinish = useCallback(() => {
    router.replace(nextEntryRoute());
  }, [nextEntryRoute]);

  return {
    duration: SPLASH_DURATION_MS,
    onFinish,
  };
};

type SplashViewModel = ReturnType<typeof useSplashViewModel>;

/**
 * EXPORTS
 */
export type { SplashViewModel };
export { useSplashViewModel };
