/**
 * IMPORTS
 */
import type { FC } from "react";
import { Text } from "react-native";
// view-model - documents
import type { DocumentsViewModel } from "@/modules/documents/presentation/view-model/documents-view-model";
import { AppHeader } from "@/shared/components/ui/app-header";
import { Screen } from "@/shared/components/ui/screen";

const DocumentsView: FC<DocumentsViewModel> = ({ header, title, description }) => {
  return (
    <Screen header={<AppHeader {...header} />} edges={["top"]} scroll contentClassName="gap-2 p-5">
      <Text className="text-2xl font-bold text-text" accessibilityRole="header">
        {title}
      </Text>
      <Text className="text-base text-muted">{description}</Text>
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default DocumentsView;
