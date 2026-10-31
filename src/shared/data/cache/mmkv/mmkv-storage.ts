/**
 * IMPORTS
 */
import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";
import { brand } from "@/shared/brand/brand";

// Um arquivo de storage por cliente (cada cliente já é um app separado,
// o id só deixa isso explícito ao depurar).
const storage = createMMKV({ id: `${brand.client}-storage` });

// Adaptador para o middleware `persist` do zustand.
const zustandStorage: StateStorage = {
  /**usado para buscar item */
  getItem: (name) => storage.getString(name) ?? null,

  /**usado para adicionar item */
  setItem: (name, value) => storage.set(name, value),

  /**usado para remove item */
  removeItem: (name) => {
    storage.remove(name);
  },
};

/**
 * EXPORTS
 */
export { storage, zustandStorage };
