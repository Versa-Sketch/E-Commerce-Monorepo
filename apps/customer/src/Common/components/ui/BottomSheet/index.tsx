import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Dimensions, Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { backdropStyle, bodyStyle, closeBtnStyle, containerStyle, handleBaseStyle, handleContainerStyle, headerStyle, sheetStyle } from './styledcomponents';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.55,
}) => {
  const { theme, isDark } = useTheme();
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(0.4, { duration: 250 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
    }
  }, [visible]);
  const animatedBackdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const animatedSheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const renderHandle = () => (
    <View style={handleContainerStyle}>
      <View style={[handleBaseStyle, { backgroundColor: isDark ? theme.colors.border : '#E4E9E9' }]} />
    </View>
  );
  const renderHeader = () => (
    <View style={[headerStyle, { paddingHorizontal: theme.spacing.md }]}>
      <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
        {title || ''}
      </Text>
      <Pressable onPress={onClose} style={closeBtnStyle}>
        <Ionicons name="close-circle" size={24} color={theme.colors.textSecondary} />
      </Pressable>
    </View>
  );
  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={containerStyle}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[backdropStyle, { backgroundColor: '#000000' }, animatedBackdropStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            sheetStyle,
            {
              backgroundColor: theme.colors.surface,
              height,
              borderTopLeftRadius: theme.borderRadius.xl,
              borderTopRightRadius: theme.borderRadius.xl,
            },
            animatedSheetStyle,
          ]}
        >
          {renderHandle()}
          {(title || typeof onClose === 'function') && renderHeader()}
          <View style={bodyStyle}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};
export default BottomSheet;
