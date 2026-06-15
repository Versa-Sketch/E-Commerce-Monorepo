import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { Button } from '../Button';
import { actionButtonStyle, containerStyle, descriptionStyle, iconFrameStyle, titleStyle } from './styledcomponents';
interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'document-text-outline',
  actionLabel,
  onActionPress,
  style,
}) => {
  const { theme } = useTheme();
  const renderIcon = () => (
    <View
      style={[
        iconFrameStyle,
        {
          backgroundColor: theme.dark ? 'rgba(0, 109, 119, 0.15)' : 'rgba(0, 109, 119, 0.05)',
          borderRadius: theme.borderRadius.round,
        },
      ]}
    >
      <Ionicons name={iconName} size={48} color={theme.colors.primary} />
    </View>
  );
  const renderMessages = () => (
    <>
      <Text style={[theme.textPresets.h3, titleStyle, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[theme.textPresets.bodyMedium, descriptionStyle, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>
    </>
  );
  const renderAction = () => (
    <Button label={actionLabel!} onPress={onActionPress!} variant="solid" style={actionButtonStyle} />
  );
  return (
    <View style={[containerStyle, style]}>
      {renderIcon()}
      {renderMessages()}
      {actionLabel && onActionPress && renderAction()}
    </View>
  );
};
export default EmptyState;
