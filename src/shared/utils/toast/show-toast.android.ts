/**
 * IMPORTS
 */
import { ToastAndroid } from "react-native";
import type { ShowToast } from "./show-toast";

// No Android o Burnt usa o ToastAndroid, mas manda a duração em ms (5000) e o
// Android só entende SHORT/LONG: qualquer outro valor vira curto (~2s) e o
// `message` é descartado. Por isso chamamos o ToastAndroid direto, no máximo
// que o sistema permite (LONG, ~3,5s), com o texto principal.
const showToast: ShowToast = ({ title, message }) => {
  ToastAndroid.showWithGravity(message ?? title, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

/**
 * EXPORTS
 */
export { showToast };
