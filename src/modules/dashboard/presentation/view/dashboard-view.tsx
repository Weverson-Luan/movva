/**
 * IMPORTS
 */
import type { FC } from "react";
import { ScrollView, Text, View } from "react-native";
import { BrandButton } from "@/modules/dashboard/components/BrandButton";
import { WelcomeGreeting } from "@/modules/dashboard/components/welcome-greeting";
// view-model - dashboard
import type { DashboardViewModel } from "@/modules/dashboard/presentation/view-model/dashboard-view-model";
import { Feature } from "@/shared/brand/BrandProvider";
import { AppHeader } from "@/shared/components/ui/app-header";

type CardProps = { title: string; text: string };

const Card = ({ title, text }: CardProps) => {
  return (
    <View className="gap-1 rounded-brand bg-surface p-4">
      <Text className="text-[17px] font-semibold text-primary">{title}</Text>
      <Text className="text-text">{text}</Text>
    </View>
  );
};

const DashboardView: FC<DashboardViewModel> = ({ header, welcome, apiUrl, onContactSupport }) => {
  return (
    <View className="flex-1 bg-background">
      <AppHeader {...header} />

      <ScrollView contentContainerClassName="gap-4 p-5">
        <WelcomeGreeting {...welcome} />

        <Text className="mb-2 text-[13px] text-muted">API: {apiUrl}</Text>

        <Feature name="delivery">
          <Card title="Delivery" text="Peça e receba em casa." />
        </Feature>

        <Feature name="fidelidade">
          <Card title="Programa de fidelidade" text="Junte pontos a cada compra." />
        </Feature>

        <Feature name="chat">
          <Card title="Chat" text="Fale com a nossa equipe." />
        </Feature>

        <BrandButton title="Falar com o suporte" onPress={onContactSupport} />
      </ScrollView>
    </View>
  );
};

/**
 * EXPORTS
 */
export default DashboardView;
