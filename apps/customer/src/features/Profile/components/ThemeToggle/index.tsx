import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  menuIconStyle,
  menuItemLeftStyle,
  menuItemToggleStyle,
  toggleKnobStyle,
  togglePressableStyle,
  toggleRowSectionStyle,
} from './styledcomponents';
interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  const { theme } = useTheme();
  return (
    <View style={toggleRowSectionStyle}>
      <View style={[menuItemToggleStyle, { backgroundColor: theme.colors.surface }]}>
        <View style={menuItemLeftStyle}>
          <Ionicons name="moon-outline" size={20} color={theme.colors.primary} style={menuIconStyle} />
          <Text style={[theme.textPresets.label, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
            Dark Interface Theme
          </Text>
        </View>
        <Pressable onPress={onToggle} style={[togglePressableStyle, { backgroundColor: isDark ? theme.colors.primary : '#E4E9E9' }]}>
          <View style={[toggleKnobStyle, { transform: [{ translateX: isDark ? 20 : 2 }] }]} />
        </Pressable>
      </View>
    </View>
  );
};
export default ThemeToggle;
