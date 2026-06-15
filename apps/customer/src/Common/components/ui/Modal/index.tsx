import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, Modal as RNModal, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { backdropStyle, bodyStyle, centerContainerStyle, closeBtnStyle, headerStyle, modalContentStyle } from './styledcomponents';
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children }) => {
  const { theme } = useTheme();
  const backdropOpacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
    }
  }, [visible]);
  const animatedBackdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const animatedContentStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const renderHeader = () => (
    <View style={headerStyle}>
      <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary }]}>{title || ''}</Text>
      <Pressable onPress={onClose} style={closeBtnStyle}>
        <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
      </Pressable>
    </View>
  );
  return (
    <RNModal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={centerContainerStyle}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[backdropStyle, { backgroundColor: '#000000' }, animatedBackdropStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            modalContentStyle,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              shadowColor: theme.colors.textPrimary,
              padding: theme.spacing.md,
            },
            animatedContentStyle,
          ]}
        >
          {renderHeader()}
          <View style={bodyStyle}>{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
};
export default Modal;
