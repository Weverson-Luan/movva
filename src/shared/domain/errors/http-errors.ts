/**
 * IMPORTS
 */
import { AppError } from "./app-error";

/** 400: dados enviados em formato inválido. */
class BadRequestError extends AppError {
  constructor(message = "Requisição inválida. Verifique os dados enviados.") {
    super(message, 400);
  }
}

/** 401: não autenticado (token ausente/expirado ou credenciais erradas). */
class UnauthorizedError extends AppError {
  constructor(message = "Sua sessão expirou. Entre novamente.") {
    super(message, 401);
  }
}

/** 403: autenticado, mas sem permissão. */
class ForbiddenError extends AppError {
  constructor(message = "Você não tem permissão para realizar esta ação.") {
    super(message, 403);
  }
}

/** 404: recurso não encontrado. */
class NotFoundError extends AppError {
  constructor(message = "Não encontramos o que você procurou.") {
    super(message, 404);
  }
}

/** 422: dados válidos no formato, mas recusados pela regra da API. */
class UnprocessableEntityError extends AppError {
  constructor(message = "Não foi possível processar os dados enviados.") {
    super(message, 422);
  }
}

/** Sem resposta do servidor (sem internet, timeout, servidor fora do ar). */
class NetworkError extends AppError {
  constructor(message = "Sem conexão com o servidor. Verifique sua internet.") {
    super(message);
  }
}

/** Qualquer outro erro (500, erro de código...). */
class UnexpectedError extends AppError {
  constructor(message = "Algo deu errado. Tente novamente.", statusCode?: number) {
    super(message, statusCode);
  }
}

/**
 * EXPORTS
 */
export {
  BadRequestError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
  UnprocessableEntityError,
};
