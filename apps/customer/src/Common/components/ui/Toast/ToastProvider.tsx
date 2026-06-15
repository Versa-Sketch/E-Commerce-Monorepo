import React, { createContext, useCallback, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';

export type ToastType = 'error' | 'success';

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 2500;
const TOAST_ANIMATION_MS = 220;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    opacity.value = withTiming(0, { duration: TOAST_ANIMATION_MS });
    translateY.value = withTiming(20, { duration: TOAST_ANIMATION_MS });
    setTimeout(() => setToast(null), TOAST_ANIMATION_MS);
  }, [opacity, translateY]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'error') => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setToast({ message, type });
      opacity.value = withTiming(1, { duration: TOAST_ANIMATION_MS });
      translateY.value = withTiming(0, { duration: TOAST_ANIMATION_MS });
      hideTimer.current = setTimeout(hideToast, TOAST_DURATION_MS);
    },
    [opacity, translateY, hideToast]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const backgroundColor = toast?.type === 'success' ? theme.colors.success : theme.colors.error;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            animatedStyle,
            { bottom: insets.bottom + theme.spacing.lg, backgroundColor },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.text, theme.textPresets.bodyMedium]}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
