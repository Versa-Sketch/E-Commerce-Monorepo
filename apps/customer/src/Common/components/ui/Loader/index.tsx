import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { containerStyle, fullscreenStyle } from './styledcomponents';
interface LoaderProps {
  size?: 'small' | 'large';
  fullscreen?: boolean;
}
export const Loader: React.FC<LoaderProps> = ({ size = 'large', fullscreen = false }) => {
  const { theme } = useTheme();
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1200, easing: Easing.linear }), -1, false);
    colorProgress.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const spinnerSize = size === 'large' ? 44 : 24;
  const borderThickness = size === 'large' ? 4 : 2.5;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    borderColor: interpolateColor(colorProgress.value, [0, 1], [theme.colors.primary, theme.colors.accent]),
  }));
  // Render helpers
  const renderSpinner = () => (
    <View style={containerStyle}>
      <Animated.View
        style={[
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            borderWidth: borderThickness,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'transparent',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
  if (fullscreen) {
    return (
      <View style={[fullscreenStyle, { backgroundColor: theme.colors.background }]}>
        {renderSpinner()}
      </View>
    );
  }
  return renderSpinner();
};
export default Loader;
