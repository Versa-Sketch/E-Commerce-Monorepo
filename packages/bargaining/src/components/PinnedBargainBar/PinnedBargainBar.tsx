import React from 'react';
import { Text, View } from 'react-native';
import type { BargainProduct } from '../../types/product';
import { ProductPhoto } from '../ProductPhoto';
import { useCountdown } from '../../hooks/useCountdown';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createPinnedBargainBarStyles } from './styles';

export interface PinnedBargainBarProps {
  product: BargainProduct;
  /** e.g. "Your offer ₹3,800 → countered ₹4,300" */
  summary: string;
  /** Epoch ms. Omit once the bargain is resolved — the countdown badge then hides itself. */
  expiresAt?: number;
}

/** Always-visible glance at the active bargain, so scrolling the thread never loses the price. */
export const PinnedBargainBar: React.FC<PinnedBargainBarProps> = ({ product, summary, expiresAt }) => {
  const styles = createPinnedBargainBarStyles(useBargainTheme());
  const { label, isExpired } = useCountdown(expiresAt);

  return (
    <View style={styles.row}>
      <ProductPhoto imageUrl={product.imageUrl} icon={product.icon} size={28} />
      <Text style={styles.text} numberOfLines={1}>
        {summary}
      </Text>
      {expiresAt && !isExpired ? <Text style={styles.badge}>{label}</Text> : null}
    </View>
  );
};
