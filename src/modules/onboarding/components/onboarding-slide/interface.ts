/**
 * IMPORTS
 */

import type { SharedValue } from "react-native-reanimated";
import type { OnboardingSlideItem } from "@/modules/onboarding/presentation/view-model/onboarding-view-model";

type OnboardingSlideProps = {
  slide: OnboardingSlideItem;
  index: number;
  width: number;
  /** posição horizontal da lista (px), atualizada no thread de UI */
  scrollX: SharedValue<number>;
};

type OnboardingSlideAnimationParams = Pick<OnboardingSlideProps, "index" | "width" | "scrollX">;

/**
 * EXPORTS
 */
export type { OnboardingSlideAnimationParams, OnboardingSlideProps };
