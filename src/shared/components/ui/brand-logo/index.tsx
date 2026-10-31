/**
 * IMPORTS
 */
import { Image, Text, View } from "react-native";

// marca do cliente ativo
import { useBrand } from "@/shared/brand/BrandProvider";
import { brandAssets } from "@/shared/brand/brand-assets";

// typings
import type { BrandLogoProps } from "./interface";

// Marca (clients/<cliente>/login-logo.png) + nome do app (config.json), lado a lado.
const BrandLogo = ({ className = "" }: BrandLogoProps) => {
  const { displayName } = useBrand();

  return (
    <View className={`flex-row items-center gap-3 ${className}`} accessibilityRole="header">
      <Image
        source={brandAssets.loginLogo}
        className="h-12 w-12"
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text className="text-3xl font-bold text-text">{displayName}</Text>
    </View>
  );
};

/**
 * EXPORTS
 */
export { BrandLogo };
