import Constants from "expo-constants";

export type Theme = {
  primary: string;
  primaryText: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  danger: string;
  /** atenção, não erro (ex.: perto do repouso) */
  warning: string;
  radius: number;
};

export type Features = {
  delivery: boolean;
  chat: boolean;
  fidelidade: boolean;
  onboarding: boolean;
};

export type OnboardingSlide = {
  title: string;
  description: string;
};

export type Brand = {
  client: string;
  displayName: string;
  apiUrl: string;
  /** API local usada em desenvolvimento (__DEV__). Opcional. */
  apiUrlDev?: string;
  supportEmail: string;
  /** Frase curta abaixo do nome na splash. */
  tagline: string;
  /** Ícone do MaterialCommunityIcons que anda na barra de carregamento da splash. */
  loaderIcon: string;
  /** Textos do onboarding; a imagem de cada slide vem de clients/<cliente>/onboarding/<n>.png. */
  onboarding: { slides: OnboardingSlide[] };
  theme: Theme;
  features: Features;
};

// Lido do `extra` gerado pelo app.config.js no momento do build.
const extra = Constants.expoConfig?.extra as Brand | undefined;

if (!extra?.theme) {
  throw new Error("Configuração da marca não encontrada. Verifique o app.config.js.");
}

export const brand: Brand = extra;
