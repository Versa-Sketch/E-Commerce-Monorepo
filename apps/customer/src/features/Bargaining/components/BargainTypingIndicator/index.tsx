import React, { useEffect } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { useAuthStore } from '../../../Auth/Providers/useAuthStore';
import { bubbleStyle, dotStyle, rowStyle } from './styledcomponents';

const TypingDot: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 300 }), withTiming(0.3, { duration: 300 })), -1, true)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[dotStyle, { backgroundColor: color }, animatedStyle]} />;
};

export const BargainTypingIndicator: React.FC = observer(() => {
  const { theme } = useTheme();
  const bargainingStore = useBargainingStore();
  const authStore = useAuthStore();

  const currentUserId = authStore.currentUser?.id;
  const isOtherPartyTyping = Array.from(bargainingStore.typingUsers.entries()).some(
    ([userId, isTyping]) => isTyping && userId !== currentUserId
  );

  if (!isOtherPartyTyping) return null;

  return (
    <View style={rowStyle}>
      <View style={[bubbleStyle, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}>
        <TypingDot delay={0} color={theme.colors.textMuted} />
        <TypingDot delay={150} color={theme.colors.textMuted} />
        <TypingDot delay={300} color={theme.colors.textMuted} />
      </View>
    </View>
  );
});
export default BargainTypingIndicator;
