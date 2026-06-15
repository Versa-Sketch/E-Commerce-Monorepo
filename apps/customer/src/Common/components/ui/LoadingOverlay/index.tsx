import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';

interface LoadingOverlayProps {
  message: string | null;
  hint?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  hint = "Please don't go back or close the app",
}) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);
    }
    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !message) setVisible(false);
    });
  }, [message, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="auto">
      <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[
            theme.textPresets.bodyMedium,
            { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, marginTop: 14 },
          ]}
        >
          {displayMessage}
        </Text>
        <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>{hint}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    minWidth: 200,
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 18,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },
});
