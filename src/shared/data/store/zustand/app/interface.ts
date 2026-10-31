interface AppStore {
  /** onboarding já foi visto neste aparelho */
  hasSeenOnboarding: boolean;

  /** primeira sincronização de dados já foi concluída */
  hasSynced: boolean;

  /** marcar onboarding como visto */
  completeOnboarding: () => void;

  /** marcar sincronização como concluída */
  completeSync: () => void;
}

/**
 * EXPORTS
 */
export type { AppStore };
