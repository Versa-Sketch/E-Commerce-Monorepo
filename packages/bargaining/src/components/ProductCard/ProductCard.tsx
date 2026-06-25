import React from 'react';
import { Text, View } from 'react-native';
import type { BargainProduct } from '../../types/product';
import { ProductPhoto } from '../ProductPhoto';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { formatCurrency } from '../../utils/currency';
import { createProductCardStyles } from './styles';

export interface ProductCardProps {
  product: BargainProduct;
  isOwn: boolean;
}

/** The "product attached to chat" message — the starting point of a bargain. */
const ProductCardBase: React.FC<ProductCardProps> = ({ product, isOwn }) => {
  const styles = createProductCardStyles(useBargainTheme());
  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={styles.card}>
        <ProductPhoto imageUrl={product.imageUrl} icon={product.icon} size={40} />
        <View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>Listed {formatCurrency(product.listedPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

export const ProductCard = React.memo(ProductCardBase);
