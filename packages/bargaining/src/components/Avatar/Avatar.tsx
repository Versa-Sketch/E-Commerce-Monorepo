import React from 'react';
import { Image, Text, View } from 'react-native';
import { Store } from 'lucide-react-native';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createAvatarStyles } from './styles';

export interface AvatarProps {
  imageUrl?: string;
  /** Shown when there is no image — e.g. customer-side avatar for the seller. */
  showStoreIcon?: boolean;
  /** Shown when there is no image and showStoreIcon is false — e.g. "AK" for a customer name. */
  initials?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ imageUrl, showStoreIcon, initials, size = 36 }) => {
  const theme = useBargainTheme();
  const styles = createAvatarStyles(theme);
  const radius = size / 2;

  let content: React.ReactNode;
  if (imageUrl) {
    content = <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />;
  } else if (showStoreIcon) {
    content = <Store size={Math.round(size * 0.45)} color={theme.colors.primaryDark} />;
  } else {
    content = <Text style={[styles.initials, { fontSize: Math.round(size * 0.32) }]}>{initials ?? ''}</Text>;
  }

  return <View style={[styles.circle, { width: size, height: size, borderRadius: radius }]}>{content}</View>;
};
