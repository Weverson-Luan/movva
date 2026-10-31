/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// styles
import { useTheme } from "@/shared/brand/BrandProvider";
import { BrandWordmark } from "@/shared/components/ui/brand-wordmark";
import { getInitials } from "@/shared/utils/initials";

// variantes
import { appHeaderVariants } from "./app-header.variants";

// typings
import type { AppHeaderProps } from "./interface";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// Cabeçalho das telas logadas: menu, marca do cliente com contexto, notificações e avatar.
const AppHeader = ({
  subtitle,
  userName,
  hasUnreadNotifications = false,
  onPressMenu,
  onPressNotifications,
  onPressAvatar,
}: AppHeaderProps) => {
  const theme = useTheme();
  const styles = appHeaderVariants();

  return (
    <SafeAreaView edges={["top"]} className={styles.container()}>
      <View className={styles.content()}>
        <TouchableOpacity
          className={styles.menuButton()}
          onPress={onPressMenu}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
        >
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>

        <BrandWordmark subtitle={subtitle} size="sm" className={styles.brand()} />

        <View className={styles.actions()}>
          <TouchableOpacity
            className={styles.bellButton()}
            onPress={onPressNotifications}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={hasUnreadNotifications ? "Notificações, há novas" : "Notificações"}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
            {hasUnreadNotifications ? <View className={styles.bellDot()} /> : null}
          </TouchableOpacity>

          <TouchableOpacity
            className={styles.avatar()}
            onPress={onPressAvatar}
            accessibilityRole="button"
            accessibilityLabel={`Perfil de ${userName}`}
          >
            <Text className={styles.avatarText()}>{getInitials(userName)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * EXPORTS
 */
export { AppHeader };
