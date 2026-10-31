/**
 * IMPORTS
 */
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { useBrand } from "@/shared/brand/BrandProvider";
import { brandAssets } from "@/shared/brand/brand-assets";
import { useAppStore } from "@/shared/data/store/zustand/app/app-store";

type OnboardingSlideItem = {
  key: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const useOnboardingViewModel = () => {
  const { onboarding } = useBrand();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Textos do config.json + imagem do cliente na mesma posição (logo se faltar).
  const slides = useMemo<OnboardingSlideItem[]>(
    () =>
      onboarding.slides.map((slide, index) => ({
        ...slide,
        key: `slide-${index + 1}`,
        image: brandAssets.onboarding[index] ?? brandAssets.logo,
      })),
    [onboarding.slides],
  );

  const isLastSlide = currentIndex === slides.length - 1;

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace("/sync");
  }, [completeOnboarding]);

  const onNext = useCallback(() => {
    if (isLastSlide) {
      finish();
      return;
    }
    setCurrentIndex((index) => index + 1);
  }, [isLastSlide, finish]);

  return {
    slides,
    currentIndex,
    isLastSlide,
    onChangeIndex: setCurrentIndex,
    onNext,
    onSkip: finish,
  };
};

type OnboardingViewModel = ReturnType<typeof useOnboardingViewModel>;

/**
 * EXPORTS
 */
export type { OnboardingSlideItem, OnboardingViewModel };
export { useOnboardingViewModel };
