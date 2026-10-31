// Configuração dinâmica: escolhe o cliente pela variável de ambiente CLIENT.
// Ex.: CLIENT=cinbal npx expo start
const fs = require("node:fs");
const path = require("node:path");

const client = process.env.CLIENT || "movva";
const clientDir = path.join(__dirname, "clients", client);

if (!fs.existsSync(clientDir)) {
  const disponiveis = fs.readdirSync(path.join(__dirname, "clients")).join(", ");
  throw new Error(`Cliente "${client}" não encontrado. Disponíveis: ${disponiveis}`);
}

const cfg = require(path.join(clientDir, "config.json"));
const asset = (file) => `./clients/${client}/${file}`;
// Fundo do ícone (Android) e do splash: cor da marca, separada do primary da interface.
const brandBackground = cfg.brandBackground ?? cfg.theme.primary;

module.exports = ({ config }) => ({
  ...config,
  name: cfg.name,
  slug: cfg.slug,
  owner: cfg.easOwner || undefined,
  scheme: cfg.scheme,
  version: cfg.version,
  orientation: "portrait",
  icon: asset("icon.png"),
  userInterfaceStyle: "light",

  ios: {
    bundleIdentifier: cfg.bundleId,
    buildNumber: String(cfg.buildNumber),
    supportsTablet: false,
  },

  android: {
    package: cfg.bundleId,
    versionCode: cfg.buildNumber,
    adaptiveIcon: {
      foregroundImage: asset("adaptive-icon.png"),
      backgroundColor: brandBackground,
    },
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: asset("splash.png"),
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: brandBackground,
      },
    ],
  ],

  // Gera tipos das rotas para o <Link href> e o router.push (.expo/types).
  experiments: { typedRoutes: true },

  // Cada cliente é um projeto EAS separado (app separado na loja).
  runtimeVersion: { policy: "appVersion" },
  updates: cfg.easProjectId ? { url: `https://u.expo.dev/${cfg.easProjectId}` } : undefined,

  // Tudo que o app precisa ler em tempo de execução.
  extra: {
    client,
    displayName: cfg.name,
    apiUrl: cfg.apiUrl,
    apiUrlDev: cfg.apiUrlDev,
    theme: cfg.theme,
    features: cfg.features,
    supportEmail: cfg.supportEmail,
    tagline: cfg.tagline,
    loaderIcon: cfg.loaderIcon,
    onboarding: cfg.onboarding,
    eas: cfg.easProjectId ? { projectId: cfg.easProjectId } : undefined,
  },
});
