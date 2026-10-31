/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "expo-router/drawer";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/shared/brand/BrandProvider";
import { BrandWordmark } from "@/shared/components/ui/brand-wordmark";
import { getInitials } from "@/shared/utils/initials";

import { HIT_SLOP, SCROLL_CONTENT_STYLE } from "./constants";
// typings
import type { SideMenuProps } from "./interface";
import { sideMenuVariants } from "./side-menu.variants";
import { SideMenuItemRow } from "./side-menu-item";

// Conteúdo do menu lateral: marca, usuário, itens de navegação e suporte no rodapé.
// O DrawerContentScrollView já protege a área segura do drawer.
const SideMenu = ({ userName, subtitle, tagline, items, onClose, onPressItem, onPressSupport }: SideMenuProps) => {
  const theme = useTheme();
  const styles = sideMenuVariants();

  return (
    <DrawerContentScrollView contentContainerStyle={SCROLL_CONTENT_STYLE} showsVerticalScrollIndicator={false}>
      <View className={styles.container()}>
        <View className={styles.header()}>
          <BrandWordmark size="sm" />
          <TouchableOpacity
            onPress={onClose}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
          >
            <Ionicons name="close" size={26} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View className={styles.profile()}>
          <View className={styles.avatar()}>
            <Text className={styles.avatarText()}>{getInitials(userName)}</Text>
          </View>
          <Text className={styles.name()} numberOfLines={1}>
            {userName}
          </Text>
          <Text className={styles.subtitle()}>{subtitle}</Text>
        </View>

        <View className={styles.items()}>
          {items.map((item) => (
            <SideMenuItemRow key={item.key} item={item} onPress={onPressItem} />
          ))}
        </View>

        <View className={styles.footer()}>
          <TouchableOpacity
            className={styles.support()}
            onPress={onPressSupport}
            accessibilityRole="button"
            accessibilityLabel="Ajuda e suporte"
          >
            <Ionicons name="help-circle-outline" size={24} color={theme.muted} />
            <Text className={styles.supportLabel()}>Ajuda e suporte</Text>
          </TouchableOpacity>
          <Text className={styles.tagline()}>{tagline}</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

/**
 * EXPORTS
 */
export { SideMenu };
