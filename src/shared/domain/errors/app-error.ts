/**
 * IMPORTS
 */

// Erro base do domínio. O `message` é sempre uma frase pronta para o usuário.
class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/**
 * EXPORTS
 */
export { AppError };
