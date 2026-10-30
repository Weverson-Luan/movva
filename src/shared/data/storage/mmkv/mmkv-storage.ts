/**
 * IMPORTS
 */
import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";
import { brand } from "@/brand/brand";

// Um arquivo de storage por cliente (cada cliente já é um app separado,
// o id só deixa isso explícito ao depurar).
const storage = createMMKV({ id: `${brand.client}-storage` });

// Adaptador para o middleware `persist` do zustand.
const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => {
    storage.remove(name);
  },
};

/**
 * EXPORTS
 */
export { storage, zustandStorage };
