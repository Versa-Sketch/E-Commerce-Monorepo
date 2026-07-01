import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function useSwipeGesture(onRemove: () => void) {
  const cardWidth = SCREEN_WIDTH - 40;

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const containerHeight = useSharedValue(-1);
  const isDismissed = useSharedValue(false);
  const isDragging = useSharedValue(false);
  const hasTriggeredHaptic = useSharedValue(false);
  const activeScale = useSharedValue(1);
  const activeOpacity = useSharedValue(1);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const dismiss = useCallback(() => {
    if (isDismissed.value) return;
    isDismissed.value = true;
    activeScale.value = withTiming(0.96, { duration: 240 });
    activeOpacity.value = withTiming(0, { duration: 240 });
    translateX.value = withTiming(-SCREEN_WIDTH - 50, { duration: 240 }, () => {
      containerHeight.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(onRemove)();
      });
    });
  }, [onRemove]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-15, 15])
    .onBegin(() => {
      startX.value = translateX.value;
      isDragging.value = true;
    })
    .onUpdate((e) => {
      if (isDismissed.value) return;
      const newX = Math.min(0, Math.max(-cardWidth, startX.value + e.translationX));
      translateX.value = newX;
      const threshold = -cardWidth * 0.35;
      if (newX < threshold) {
        if (!hasTriggeredHaptic.value) {
          hasTriggeredHaptic.value = true;
          runOnJS(triggerHaptic)();
        }
      } else {
        hasTriggeredHaptic.value = false;
      }
    })
    .onEnd((e) => {
      isDragging.value = false;
      if (isDismissed.value) return;
      const threshold = -cardWidth * 0.35;
      const isFullDismiss = translateX.value < threshold || e.velocityX < -1000;
      if (isFullDismiss) {
        isDismissed.value = true;
        activeScale.value = withTiming(0.96, { duration: 240 });
        activeOpacity.value = withTiming(0, { duration: 240 });
        translateX.value = withTiming(-SCREEN_WIDTH - 50, { duration: 240 }, () => {
          containerHeight.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(onRemove)();
          });
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const dragScale = useDerivedValue(() =>
    withSpring(isDragging.value ? 0.98 : 1, { damping: 15 })
  );
  const dragElevation = useDerivedValue(() =>
    withSpring(isDragging.value ? 12 : 6, { damping: 15 })
  );
  const dragShadowOpacity = useDerivedValue(() =>
    withSpring(isDragging.value ? 0.15 : 0.05, { damping: 15 })
  );

  const foregroundStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: isDismissed.value ? activeScale.value : dragScale.value },
    ],
    opacity: activeOpacity.value,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: isDragging.value ? 8 : 3 },
    shadowOpacity: dragShadowOpacity.value,
    shadowRadius: isDragging.value ? 12 : 5,
    elevation: dragElevation.value,
  }));

  const backgroundStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.abs(translateX.value) / (cardWidth * 0.35));
    return { opacity: progress };
  });

  const trashIconStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.abs(translateX.value) / (cardWidth * 0.35));
    return { transform: [{ scale: 0.8 + 0.2 * progress }], opacity: progress };
  });

  const xBtnStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value === -1 ? undefined : containerHeight.value,
  }));

  const onLayout = (height: number) => {
    if (containerHeight.value === -1) {
      containerHeight.value = height;
    }
  };

  return {
    panGesture,
    dismiss,
    onLayout,
    foregroundStyle,
    backgroundStyle,
    trashIconStyle,
    xBtnStyle,
    containerStyle,
  };
}
