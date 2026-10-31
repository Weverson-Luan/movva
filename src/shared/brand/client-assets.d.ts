// Arquivos do cliente ativo, resolvidos pelo alias `@client` do metro.config.js.
declare module "@client/*" {
  import type { ImageSourcePropType } from "react-native";

  const source: ImageSourcePropType;
  export default source;
}
