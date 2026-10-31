/**
 * IMPORTS
 */
import { type FC, useEffect, useRef } from "react";
import { type FlatList, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// components
import { OnboardingSlide } from "@/modules/onboarding/components/onboarding-slide";
import { PaginationDots } from "@/modules/onboarding/components/pagination-dots";
// view-model - onboarding
import type {
  OnboardingSlideItem,
  OnboardingViewModel,
} from "@/modules/onboarding/presentation/view-model/onboarding-view-model";
import { Button } from "@/shared/components/ui/button";

/**
 * Tela OnboardingView
 */
const OnboardingView: FC<OnboardingViewModel> = ({
  slides,
  currentIndex,
  isLastSlide,
  onChangeIndex,
  onNext,
  onSkip,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OnboardingSlideItem>>(null);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // "Próximo" muda o índice no ViewModel; a lista acompanha.
  useEffect(() => {
    listRef.current?.scrollToIndex({ index: currentIndex, animated: true });
  }, [currentIndex]);

  // "Pular" some ao chegar no último slide.
  const lastOffset = (slides.length - 1) * width;
  const skipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [lastOffset - width, lastOffset], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}>
      <Animated.FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => <OnboardingSlide slide={item} index={index} width={width} scrollX={scrollX} />}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={(event) => onChangeIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
      />

      <View className="gap-4 px-6">
        <PaginationDots items={slides} width={width} scrollX={scrollX} />
        <Button title={isLastSlide ? "Começar" : "Próximo"} icon="arrow-right" onPress={onNext} />
        <Animated.View style={skipStyle} pointerEvents={isLastSlide ? "none" : "auto"}>
          <Button title="Pular" variant="ghost" onPress={onSkip} />
        </Animated.View>
      </View>
    </View>
  );
};

/**
 * EXPORTS
 */
export default OnboardingView;
