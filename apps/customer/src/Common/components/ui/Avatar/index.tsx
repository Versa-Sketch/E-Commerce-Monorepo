import React, { useState } from 'react';
import { Image, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { containerStyle, getInitialsStyle } from './styledcomponents';
interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}
const getInitials = (text: string): string => {
  if (!text) return '';
  const parts = text.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = '',
  size = 40,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);
  const showFallback = !uri || hasError;
  const handleError = () => setHasError(true);
  const renderImage = () => (
    <Image
      source={{ uri }}
      onError={handleError}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
  const renderInitials = () => (
    <Text style={getInitialsStyle(size, theme.colors.primary)}>
      {initials}
    </Text>
  );
  return (
    <View
      style={[
        containerStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? theme.colors.surfaceSecondary : '#F0F4F4',
          borderColor: theme.colors.border,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {showFallback ? renderInitials() : renderImage()}
    </View>
  );
};
export default Avatar;
