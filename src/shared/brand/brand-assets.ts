/**
 * IMPORTS
 */

import loginLogo from "@client/login-logo.png";
import logo from "@client/logo.png";
import onboarding1 from "@client/onboarding/1.png";
import onboarding2 from "@client/onboarding/2.png";
import onboarding3 from "@client/onboarding/3.png";
import wordmark from "@client/wordmark.png";
import type { ImageSourcePropType } from "react-native";

// Imagens do cliente ativo (clients/<cliente>/). Os nomes são iguais em todo cliente:
// cliente novo só troca os arquivos. `loginLogo` é a marca transparente do login;
// `wordmark` é o nome da marca desenhado (cabeçalhos).
// A ordem de `onboarding` segue `onboarding.slides` do config.json.
const brandAssets: {
  logo: ImageSourcePropType;
  loginLogo: ImageSourcePropType;
  wordmark: ImageSourcePropType;
  onboarding: ImageSourcePropType[];
} = {
  logo,
  loginLogo,
  wordmark,
  onboarding: [onboarding1, onboarding2, onboarding3],
};

/**
 * EXPORTS
 */
export { brandAssets };
