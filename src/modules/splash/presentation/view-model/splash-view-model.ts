/**
 * IMPORTS
 */
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { useFeature } from "@/shared/brand/BrandProvider";
import { useAppStore } from "@/shared/data/store/zustand/app/app-store";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";

// Tempo da barra de carregamento (a View anima e avisa no fim).
const SPLASH_DURATION_MS = 2200;

const useSplashViewModel = () => {
  const hasOnboarding = useFeature("onboarding");
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);
  const hasSynced = useAppStore((state) => state.hasSynced);
  const token = useUserStore((state) => state.token);

  // A splash animada assume o lugar da nativa assim que monta.
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  // Primeira abertura: onboarding → sincronização → login.
  const onFinish = useCallback(() => {
    if (hasOnboarding && !hasSeenOnboarding) {
      router.replace("/onboarding");
      return;
    }
    if (!hasSynced) {
      router.replace("/sync");
      return;
    }
    router.replace(token ? "/(private)/dashboard" : "/signin");
  }, [hasOnboarding, hasSeenOnboarding, hasSynced, token]);

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
