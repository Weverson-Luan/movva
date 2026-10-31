/**
 * IMPORTS
 */
import * as Burnt from "burnt";

type ShowToastParams = {
  title: string;
  message?: string;
  preset: "done" | "error";
};

type ShowToast = (params: ShowToastParams) => void;

// Tempo do toast no iOS, em segundos.
const IOS_DURATION = 4;

// iOS (e padrão). O Android usa show-toast.android.ts (o Metro escolhe pela plataforma).
const showToast: ShowToast = ({ title, message, preset }) => {
  Burnt.toast({
    title,
    message,
    preset,
    haptic: preset === "error" ? "error" : "success",
    duration: IOS_DURATION,
  });
};

/**
 * EXPORTS
 */
export type { ShowToast, ShowToastParams };
export { showToast };
