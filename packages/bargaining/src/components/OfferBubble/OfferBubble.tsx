import React from 'react';
import { Text, View } from 'react-native';
import type { BargainProduct } from '../../types/product';
import type { BargainOfferActions } from '../../types/actions';
import { ProductPhoto } from '../ProductPhoto';
import { ProbabilityBar } from '../ProbabilityBar';
import { ActionRow } from '../ActionRow';
import { formatCurrency } from '../../utils/currency';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createOfferBubbleStyles } from './styles';

export interface OfferBubbleProps {
  product: BargainProduct;
  price: number;
  /** 0-100, supplied by the host. */
  probability: number;
  /** Visual treatment only — an opening offer vs. a seller's counter offer. */
  variant?: 'offer' | 'counter';
  /** True when the viewer made this offer — aligns right and tints the bubble. */
  isOwn: boolean;
  /** Short badge like "Good deal" — typically only used on counter offers. */
  dealTag?: string;
  /** Present to show Accept/Counter/Decline; omit to show the waiting state. */
  actions?: BargainOfferActions;
  waitingLabel?: string;
}

/** A priced message in the chat. Always carries its product so the price never floats without context. */
const OfferBubbleBase: React.FC<OfferBubbleProps> = ({
  product,
  price,
  probability,
  variant = 'offer',
  isOwn,
  dealTag,
  actions,
  waitingLabel,
}) => {
  const styles = createOfferBubbleStyles(useBargainTheme());
  const isCounter = variant === 'counter';

  const bubbleStyle = isCounter ? styles.bubbleCounter : isOwn ? styles.bubbleOwnDefault : styles.bubbleDefault;

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, bubbleStyle]}>
        <View style={[styles.productTag, isCounter && styles.productTagCounter]}>
          <ProductPhoto imageUrl={product.imageUrl} icon={product.icon} size={26} />
          <Text style={[styles.productName, isCounter && styles.productNameCounter]}>{product.name}</Text>
          {!isCounter && <Text style={styles.productPrice}>{formatCurrency(product.listedPrice)}</Text>}
        </View>

        <Text style={[styles.price, isCounter && styles.priceCounter]}>
          {isCounter ? 'Counter offer: ' : 'Offer: '}
          {formatCurrency(price)}
        </Text>

        {dealTag ? <Text style={styles.dealTag}>{dealTag}</Text> : null}

        <ProbabilityBar probability={probability} />

        <ActionRow actions={actions} waitingLabel={waitingLabel} />
      </View>
    </View>
  );
};

export const OfferBubble = React.memo(OfferBubbleBase);
