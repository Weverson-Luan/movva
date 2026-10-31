/**
 * IMPORTS
 */
import { useAppHeader } from "@/shared/hooks/use-app-header";

// Estado da tela de documentos. Placeholder até existir a listagem de documentos.
const useDocumentsViewModel = () => {
  const header = useAppHeader("Documentos");

  return {
    header,
    title: "Documentos",
    description: "Em breve, seus documentos aparecem aqui.",
  };
};

type DocumentsViewModel = ReturnType<typeof useDocumentsViewModel>;

/**
 * EXPORTS
 */
export type { DocumentsViewModel };
export { useDocumentsViewModel };
