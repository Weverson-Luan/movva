/**
 * IMPORTS
 */
import DocumentsView from "@/modules/documents/presentation/view/documents-view";
import { useDocumentsViewModel } from "@/modules/documents/presentation/view-model/documents-view-model";

// A rota liga o view-model à view: a view só recebe props.
const Documents = () => {
  const viewModel = useDocumentsViewModel();
  return <DocumentsView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default Documents;
