/**
 * IMPORTS
 */
import { Image, Text, View } from "react-native";

// marca do cliente ativo
import { useBrand } from "@/shared/brand/BrandProvider";
import { brandAssets } from "@/shared/brand/brand-assets";

// variantes
import { brandWordmarkVariants } from "./brand-wordmark.variants";

// typings
import type { BrandWordmarkProps } from "./interface";

// Proporção do wordmark do cliente (clients/<cliente>/wordmark.png): cada nome tem uma largura.
// Sem o tamanho do arquivo, cai numa proporção média de nome curto.
const wordmarkSource = Image.resolveAssetSource(brandAssets.wordmark);
const WORDMARK_ASPECT_RATIO =
  wordmarkSource?.width && wordmarkSource.height ? wordmarkSource.width / wordmarkSource.height : 4;

// Nome da marca desenhado + linha de contexto opcional, alinhados à esquerda.
const BrandWordmark = ({ subtitle, size, className = "" }: BrandWordmarkProps) => {
  const { displayName } = useBrand();
  const styles = brandWordmarkVariants({ size });

  return (
    <View className={styles.container({ className })}>
      <Image
        source={brandAssets.wordmark}
        className={styles.image()}
        style={{ aspectRatio: WORDMARK_ASPECT_RATIO }}
        resizeMode="contain"
        accessibilityRole="header"
        accessibilityLabel={displayName}
      />
      {subtitle ? (
        <Text className={styles.subtitle()} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

/**
 * EXPORTS
 */
export { BrandWordmark };
