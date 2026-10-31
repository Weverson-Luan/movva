/**
 * IMPORTS
 */
import { AppError, UnexpectedError } from "@/shared/domain/errors";
import { showToast } from "./show-toast";

// Toast nativo. Só a camada de apresentação chama isto.
const showErrorToast = (error: unknown) => {
  const { message } = error instanceof AppError ? error : new UnexpectedError();
  showToast({ title: "Ops!", message, preset: "error" });
};

const showSuccessToast = (title: string, message?: string) => {
  showToast({ title, message, preset: "done" });
};

/**
 * EXPORTS
 */
export { showErrorToast, showSuccessToast };
