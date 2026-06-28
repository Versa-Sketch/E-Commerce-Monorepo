import React from 'react';
import { Pressable, Text } from 'react-native';
import type { BargainProduct } from '../../types/product';
import { ProductPhoto } from '../ProductPhoto';
import { formatCurrency } from '../../utils/currency';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createProductPickerTileStyles } from './styles';

export interface ProductPickerTileProps {
  product: BargainProduct;
  onPress: (product: BargainProduct) => void;
}

export const ProductPickerTile: React.FC<ProductPickerTileProps> = ({ product, onPress }) => {
  const styles = createProductPickerTileStyles(useBargainTheme());
  return (
    <Pressable style={styles.tile} onPress={() => onPress(product)}>
      <ProductPhoto imageUrl={product.imageUrl} icon={product.icon} size={44} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{formatCurrency(product.listedPrice)}</Text>
    </Pressable>
  );
};
