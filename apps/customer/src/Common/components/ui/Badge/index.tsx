import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { badgeStyle } from './styledcomponents';
interface BadgeProps {
  label: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}
const resolveColors = (
  variant: BadgeProps['variant'],
  theme: ReturnType<typeof useTheme>['theme'] & { dark: boolean }
) => {
  switch (variant) {
    case 'secondary':
      return {
        bg: theme.dark ? theme.colors.surfaceSecondary : '#E4E9E9',
        text: theme.colors.textSecondary,
        soft: true,
      };
    case 'success':
      return {
        bg: theme.dark ? 'rgba(60, 208, 112, 0.15)' : 'rgba(34, 181, 115, 0.1)',
        text: theme.colors.success,
        soft: true,
      };
    case 'warning':
      return {
        bg: theme.dark ? 'rgba(245, 185, 78, 0.15)' : 'rgba(242, 169, 59, 0.1)',
        text: theme.colors.warning,
        soft: true,
      };
    case 'error':
      return {
        bg: theme.dark ? 'rgba(236, 93, 98, 0.15)' : 'rgba(229, 72, 77, 0.1)',
        text: theme.colors.error,
        soft: true,
      };
    case 'accent':
      return { bg: theme.colors.accent, text: theme.colors.surface, soft: false };
    case 'primary':
    default:
      return { bg: theme.colors.primary, text: theme.colors.surface, soft: false };
  }
};
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const { bg, text } = resolveColors(variant, theme as any);
  const verticalPadding = size === 'sm' ? 2 : 4;
  const horizontalPadding = size === 'sm' ? 6 : 10;
  const fontSize = size === 'sm' ? 10 : 12;
  return (
    <View
      style={[
        badgeStyle,
        {
          backgroundColor: bg,
          paddingVertical: verticalPadding,
          paddingHorizontal: horizontalPadding,
          borderRadius: theme.borderRadius.round,
        },
        style,
      ]}
    >
      <Text
        style={[
          theme.textPresets.label,
          { color: text, fontSize, lineHeight: fontSize + 2 },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};
export default Badge;
