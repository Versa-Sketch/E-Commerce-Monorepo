import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createTypingIndicatorStyles } from './styles';

export interface TypingIndicatorProps {
  /** e.g. "Seller" or a merchant's display name. */
  name: string;
}

function BouncingDot({ delay, color }: { delay: number; color: string }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, { toValue: -4, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(1200 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color, transform: [{ translateY }] }}
    />
  );
}

const TypingIndicatorBase: React.FC<TypingIndicatorProps> = ({ name }) => {
  const theme = useBargainTheme();
  const styles = createTypingIndicatorStyles(theme);

  return (
    <View style={styles.row}>
      <BouncingDot delay={0} color={theme.colors.textTertiary} />
      <BouncingDot delay={150} color={theme.colors.textTertiary} />
      <BouncingDot delay={300} color={theme.colors.textTertiary} />
      <Text style={styles.label}>{name} is typing…</Text>
    </View>
  );
};

export const TypingIndicator = React.memo(TypingIndicatorBase);
