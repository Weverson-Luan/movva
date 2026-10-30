/**
 * IMPORTS
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// storage
import { zustandStorage } from "@/shared/data/storage/mmkv/mmkv-storage";

// typings
import type { UserStore } from "./interface";

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,

      authSignin: (sessionData) => {
        set({ ...sessionData });
      },
      updateTokens: (updateTokensParams) => {
        set({ ...updateTokensParams });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => zustandStorage),
      // Só os dados vão para o disco; as funções são recriadas ao abrir o app.
      partialize: ({ user, token, refreshToken }) => ({ user, token, refreshToken }),
    },
  ),
);

/**
 * EXPORTS
 */
export { useUserStore };
