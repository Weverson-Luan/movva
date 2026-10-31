/**
 * IMPORTS
 */
import { Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_EDGES, SCREEN_BOTTOM_GAP } from "./constants";
// typings
import type { ScreenProps } from "./interface";
import { screenVariants } from "./screen.variants";

// Raiz de toda tela: fundo do tema + área segura com o mesmo respiro em todas as telas.
// Topo: padding na raiz (sem `header`). Base: padding no fim do conteúdo — com `scroll`,
// o conteúdo rola por trás da barra de navegação, mas o último item para acima dela.
const Screen = ({
  children,
  header,
  edges = DEFAULT_EDGES,
  scroll = false,
  keyboard = false,
  className,
  contentClassName,
}: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const styles = screenVariants();

  const paddingTop = edges.includes("top") && !header ? insets.top : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom + SCREEN_BOTTOM_GAP : 0;

  const body = scroll ? (
    <ScrollView
      contentContainerClassName={styles.scrollContainer()}
      contentContainerStyle={{ paddingBottom }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className={styles.scrollContent({ className: contentClassName })}>{children}</View>
    </ScrollView>
  ) : (
    <View className={styles.body()} style={{ paddingBottom }}>
      <View className={styles.content({ className: contentClassName })}>{children}</View>
    </View>
  );

  return (
    <View className={styles.root({ className })} style={{ paddingTop }}>
      {header}
      {keyboard ? (
        <KeyboardAvoidingView className={styles.keyboard()} behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {body}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </View>
  );
};

/**
 * EXPORTS
 */
export { Screen };
