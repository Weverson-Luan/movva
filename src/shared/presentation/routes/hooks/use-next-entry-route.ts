/**
 * IMPORTS
 */
import type { Href } from "expo-router";
import { useCallback } from "react";
import { useFeature } from "@/shared/brand/BrandProvider";
import { useAppStore } from "@/shared/data/store/zustand/app/app-store";
import { useUserStore } from "@/shared/data/store/zustand/user/user-store";
import { ROUTES } from "@/shared/presentation/routes/routes";

// Ordem única do fluxo de entrada: login → onboarding → sincronização → início.
// Cada tela só avisa que terminou; quem decide a próxima é esta função.
// Lê os stores na hora da chamada (getState) para enxergar o que a tela acabou de gravar.
const useNextEntryRoute = () => {
  const hasOnboarding = useFeature("onboarding");

  return useCallback((): Href => {
    const { token } = useUserStore.getState();
    const { hasSeenOnboarding, hasSynced } = useAppStore.getState();

    if (!token) return ROUTES.signin;
    if (hasOnboarding && !hasSeenOnboarding) return ROUTES.onboarding;
    if (!hasSynced) return ROUTES.sync;
    return ROUTES.dashboard;
  }, [hasOnboarding]);
};

/**
 * EXPORTS
 */
export { useNextEntryRoute };
