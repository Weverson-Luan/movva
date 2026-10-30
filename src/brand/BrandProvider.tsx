import type React from 'react';
import { createContext, useContext } from 'react';
import { type Brand, brand, type Features } from './brand';

const BrandContext = createContext<Brand>(brand);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

/** Marca completa do cliente atual (nome, tema, API, features). */
export const useBrand = () => useContext(BrandContext);

/** Atalho para as cores e o raio de borda. */
export const useTheme = () => useContext(BrandContext).theme;

/** true se a funcionalidade estiver ativa para este cliente. */
export const useFeature = (name: keyof Features) => useContext(BrandContext).features[name];

/** Renderiza os filhos só se a feature estiver ativa. */
export function Feature({ name, children }: { name: keyof Features; children: React.ReactNode }) {
  return useFeature(name) ? children : null;
}
