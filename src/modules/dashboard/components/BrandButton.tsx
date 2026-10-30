import { Pressable, Text } from "react-native";

type Props = { title: string; onPress?: () => void };

// Exemplo de componente que nunca usa cores fixas: tudo vem do tema do cliente
// (bg-primary, text-primary-text, rounded-brand são definidos no tailwind.config.js).
export function BrandButton({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="items-center rounded-brand bg-primary px-5 py-3.5 active:opacity-85">
      <Text className="text-base font-semibold text-primary-text">{title}</Text>
    </Pressable>
  );
}
