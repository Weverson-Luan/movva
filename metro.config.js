const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Alias `@client/...` → `clients/<CLIENT>/...`: imagens do cliente ativo (logo, onboarding).
// Todo cliente tem os mesmos nomes de arquivo; trocar a arte não mexe no código.
// Ao trocar de cliente, rode o Metro com --clear (os scripts start:* já fazem).
const clientDir = path.join(__dirname, "clients", process.env.CLIENT || "movva");
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = defaultResolveRequest ?? context.resolveRequest;
  if (moduleName.startsWith("@client/")) {
    return resolve(context, path.join(clientDir, moduleName.slice("@client/".length)), platform);
  }
  return resolve(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
