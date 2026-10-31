import Constants from "expo-constants";

export type Theme = {
  primary: string;
  primaryText: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  danger: string;
  radius: number;
};

export type Features = {
  delivery: boolean;
  chat: boolean;
  fidelidade: boolean;
};

export type Brand = {
  client: string;
  displayName: string;
  apiUrl: string;
  /** API local usada em desenvolvimento (__DEV__). Opcional. */
  apiUrlDev?: string;
  supportEmail: string;
  theme: Theme;
  features: Features;
};

// Lido do `extra` gerado pelo app.config.js no momento do build.
const extra = Constants.expoConfig?.extra as Brand | undefined;

if (!extra?.theme) {
  throw new Error("Configuração da marca não encontrada. Verifique o app.config.js.");
}

export const brand: Brand = extra;
