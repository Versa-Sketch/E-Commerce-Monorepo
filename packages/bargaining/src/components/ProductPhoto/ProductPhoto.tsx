import React from 'react';
import { Image, View } from 'react-native';
import { Headphones, Watch, Footprints, Volume2, Package } from 'lucide-react-native';
import type { BargainProductIcon } from '../../types/product';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createProductPhotoStyles } from './styles';

const ICONS: Record<BargainProductIcon, typeof Package> = {
  headphones: Headphones,
  watch: Watch,
  footwear: Footprints,
  speaker: Volume2,
  generic: Package,
};

export interface ProductPhotoProps {
  imageUrl?: string;
  icon?: BargainProductIcon;
  size?: number;
}

/**
 * Real product photo when imageUrl is available; otherwise a tinted icon tile
 * so the layout already looks right before the catalogue wires up real images.
 */
export const ProductPhoto: React.FC<ProductPhotoProps> = ({ imageUrl, icon = 'generic', size = 44 }) => {
  const theme = useBargainTheme();
  const styles = createProductPhotoStyles(theme);
  const radius = Math.round(size * 0.27);
  const Icon = ICONS[icon];

  if (imageUrl) {
    return (
      <View style={[styles.tile, { width: size, height: size, borderRadius: radius }]}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: radius }]}>
      <Icon size={Math.round(size * 0.45)} color={theme.colors.primaryDark} />
    </View>
  );
};
