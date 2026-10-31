/**
 * IMPORTS
 */
import { isAxiosError } from "axios";
import {
  AppError,
  BadRequestError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
  UnprocessableEntityError,
} from "@/shared/domain/errors";

// Mensagem enviada pela API ({ message: "..." } ou { message: ["...", "..."] }).
const getApiMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== "object" || !("message" in data)) return undefined;
  const { message } = data as { message: unknown };
  if (typeof message === "string") return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  return undefined;
};

// Converte qualquer erro do axios em um erro do domínio.
// A mensagem é sempre a do backend ({ "message": "..." }), que já vem pronta
// para o usuário; a mensagem padrão de cada erro só entra se ela não vier.
const mapHttpError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (!isAxiosError(error)) return new UnexpectedError();
  if (!error.response) return new NetworkError();

  const status = error.response.status;
  const apiMessage = getApiMessage(error.response.data);

  switch (status) {
    case 400:
      return new BadRequestError(apiMessage);
    case 401:
      return new UnauthorizedError(apiMessage);
    case 403:
      return new ForbiddenError(apiMessage);
    case 404:
      return new NotFoundError(apiMessage);
    case 422:
      return new UnprocessableEntityError(apiMessage);
    default:
      return new UnexpectedError(apiMessage, status);
  }
};

/**
 * EXPORTS
 */
export { mapHttpError };
