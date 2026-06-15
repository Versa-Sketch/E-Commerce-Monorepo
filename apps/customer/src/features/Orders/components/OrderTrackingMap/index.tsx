import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  customerPinPositionStyle,
  mapContainerStyle,
  mapGridLineHorizontalStyle,
  mapGridLineVerticalStyle,
  pinCircleStyle,
  pinLabelStyle,
  pinStyle,
  radarPulseStyle as pulseBgStyle,
  riderIconFrameStyle,
  routePathStyle,
  storePinPositionStyle,
} from './styledcomponents';
export const OrderTrackingMap: React.FC = () => {
  const { theme, isDark } = useTheme();
  const riderTranslateX = useSharedValue(-20);
  const riderTranslateY = useSharedValue(20);
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    riderTranslateX.value = withRepeat(
      withSequence(
        withTiming(120, { duration: 6000, easing: Easing.linear }),
        withTiming(-20, { duration: 0 })
      ),
      -1,
      false
    );
    riderTranslateY.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 6000, easing: Easing.linear }),
        withTiming(20, { duration: 0 })
      ),
      -1,
      false
    );
    pulseScale.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const animatedRiderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: riderTranslateX.value },
        { translateY: riderTranslateY.value },
      ],
    };
  });
  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: 1.8 - pulseScale.value,
    };
  });
  return (
    <View
      style={[
        mapContainerStyle,
        {
          backgroundColor: isDark ? '#192024' : '#E8F5E9',
          borderRadius: theme.borderRadius.lg,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={mapGridLineHorizontalStyle} />
      <View style={mapGridLineVerticalStyle} />
      <View style={[pinStyle, storePinPositionStyle]}>
        <View style={[pinCircleStyle, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="basket" size={14} color="#FFFFFF" />
        </View>
        <Text style={[theme.textPresets.caption, pinLabelStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Store
        </Text>
      </View>
      <View style={[pinStyle, customerPinPositionStyle]}>
        <Animated.View style={[pulseBgStyle, { backgroundColor: theme.colors.primary }, animatedPulseStyle]} />
        <View style={[pinCircleStyle, { backgroundColor: theme.colors.deepPrimary }]}>
          <Ionicons name="home" size={14} color="#FFFFFF" />
        </View>
        <Text style={[theme.textPresets.caption, pinLabelStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          Home
        </Text>
      </View>
      <View style={[routePathStyle, { borderColor: theme.colors.primary }]} />
      <Animated.View style={[riderIconFrameStyle, { backgroundColor: theme.colors.accent }, animatedRiderStyle]}>
        <Ionicons name="bicycle" size={16} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};
export default OrderTrackingMap;
