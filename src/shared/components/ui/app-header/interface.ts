/**
 * IMPORTS
 */

type AppHeaderProps = {
  /** linha de contexto abaixo da marca (ex.: "Jornada • Belo Horizonte - MG") */
  subtitle?: string;
  /** nome do usuário; vira as iniciais do avatar */
  userName: string;
  /** mostra o ponto no sino */
  hasUnreadNotifications?: boolean;
  onPressMenu?: () => void;
  onPressNotifications?: () => void;
  onPressAvatar?: () => void;
};

/**
 * EXPORTS
 */
export type { AppHeaderProps };
