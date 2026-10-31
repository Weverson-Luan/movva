/**
 * IMPORTS
 */

import logo from "@client/logo.png";
import onboarding1 from "@client/onboarding/1.png";
import onboarding2 from "@client/onboarding/2.png";
import onboarding3 from "@client/onboarding/3.png";
import type { ImageSourcePropType } from "react-native";

// Imagens do cliente ativo (clients/<cliente>/). Os nomes são iguais em todo cliente:
// cliente novo só troca os arquivos. A ordem de `onboarding` segue `onboarding.slides` do config.json.
const brandAssets: { logo: ImageSourcePropType; onboarding: ImageSourcePropType[] } = {
  logo,
  onboarding: [onboarding1, onboarding2, onboarding3],
};

/**
 * EXPORTS
 */
export { brandAssets };
