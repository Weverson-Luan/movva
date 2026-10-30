/**
 * IMPORTS
 */
import { Linking, ScrollView, Text, View } from "react-native";
import { Feature, useBrand } from "@/brand/BrandProvider";
import { BrandButton } from "@/modules/dashboard/components/BrandButton";

type CardProps = { title: string; text: string };

const Card = ({ title, text }: CardProps) => {
  return (
    <View className="gap-1 rounded-brand bg-surface p-4">
      <Text className="text-[17px] font-semibold text-primary">{title}</Text>
      <Text className="text-text">{text}</Text>
    </View>
  );
};

const DashboardView = () => {
  const { displayName, supportEmail, apiUrl } = useBrand();

  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-4 p-5 pt-[72px]">
      <Text className="text-[28px] font-bold text-text">{displayName}</Text>
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

      <BrandButton title="Falar com o suporte" onPress={() => Linking.openURL(`mailto:${supportEmail}`)} />
    </ScrollView>
  );
};

/**
 * EXPORTS
 */
export default DashboardView;
