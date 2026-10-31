/**
 * IMPORTS
 */
import type { Href } from "expo-router";
import { useCallback } from "react";
import { useFeature } from "@/shared/brand/BrandProvider";
import { useAppStore } from "@/shared/data/store/zustand/app/app-store";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";

// Ordem única do fluxo de entrada: login → onboarding → sincronização → dashboard.
// Cada tela só avisa que terminou; quem decide a próxima é esta função.
// Lê os stores na hora da chamada (getState) para enxergar o que a tela acabou de gravar.
const useNextEntryRoute = () => {
  const hasOnboarding = useFeature("onboarding");

  return useCallback((): Href => {
    const { token } = useUserStore.getState();
    const { hasSeenOnboarding, hasSynced } = useAppStore.getState();

    if (!token) return "/signin";
    if (hasOnboarding && !hasSeenOnboarding) return "/onboarding";
    if (!hasSynced) return "/sync";
    return "/(private)/(tabs)/dashboard";
  }, [hasOnboarding]);
};

/**
 * EXPORTS
 */
export { useNextEntryRoute };
