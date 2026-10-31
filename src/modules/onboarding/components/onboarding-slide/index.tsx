/**
 * IMPORTS
 */
import { Image, Text, View } from "react-native";
import Animated from "react-native-reanimated";
// typings
import type { OnboardingSlideProps } from "./interface";
import { onboardingSlideVariants } from "./onboarding-slide.variants";
import { useOnboardingSlideAnimation } from "./use-onboarding-slide-animation";

// Um slide: ilustração com blobs atrás e textos embaixo. A animação vem do hook ao lado.
const OnboardingSlide = ({ slide, index, width, scrollX }: OnboardingSlideProps) => {
  const styles = onboardingSlideVariants();
  const { imageStyle, outerBlobStyle, innerBlobStyle, textStyle } = useOnboardingSlideAnimation({
    index,
    width,
    scrollX,
  });

  return (
    <View style={{ width }} className={styles.container()}>
      <View className={styles.stage()}>
        <View className={styles.layer()}>
          <Animated.View style={outerBlobStyle}>
            <View className={styles.outerBlob()} />
          </Animated.View>
        </View>
        <View className={styles.layer()}>
          <Animated.View style={innerBlobStyle}>
            <View className={styles.innerBlob()} />
          </Animated.View>
        </View>
        <Animated.View style={imageStyle}>
          <Image
            source={slide.image}
            className={styles.image()}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>
      </View>

      <Animated.View style={textStyle}>
        <View className={styles.texts()}>
          <Text className={styles.title()}>{slide.title}</Text>
          <Text className={styles.description()}>{slide.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * EXPORTS
 */
export { OnboardingSlide };
