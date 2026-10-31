/**
 * IMPORTS
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// storage
import { zustandStorage } from "@/shared/data/cache/mmkv/mmkv-storage";

// typings
import type { AppStore } from "./interface";

// Etapas da primeira entrada após o login (onboarding, sincronização), por aparelho.
// Ordem do fluxo: @/shared/hooks/use-next-entry-route. Persistido no MMKV do cliente.
const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      hasSynced: false,

      completeOnboarding: () => {
        set({ hasSeenOnboarding: true });
      },
      completeSync: () => {
        set({ hasSynced: true });
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => zustandStorage),
      partialize: ({ hasSeenOnboarding, hasSynced }) => ({ hasSeenOnboarding, hasSynced }),
    },
  ),
);

/**
 * EXPORTS
 */
export { useAppStore };
