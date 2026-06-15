import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface RollingNumberProps {
  value: number;
  style?: TextStyle | TextStyle[];
  duration?: number;
}

export const RollingNumber: React.FC<RollingNumberProps> = ({ value, style, duration = 220 }) => {
  const prevValue = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (value === prevValue.current) return;
    const direction = value > prevValue.current ? 1 : -1;
    prevValue.current = value;
    setDisplayValue(value);
    translateY.value = direction * 10;
    opacity.value = 0;
    translateY.value = withTiming(0, { duration });
    opacity.value = withTiming(1, { duration });
  }, [value, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[style, animatedStyle]}>{displayValue}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});

export default RollingNumber;
