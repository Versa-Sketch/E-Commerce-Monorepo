import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import type { BargainProduct } from '../../types/product';
import { ProductPhoto } from '../ProductPhoto';
import { ProbabilityBar } from '../ProbabilityBar';
import { formatCurrency } from '../../utils/currency';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createOfferComposerStyles } from './styles';

export interface OfferComposerPreset {
  label: string;
  price: number;
}

export interface OfferComposerProps {
  product: BargainProduct;
  min: number;
  max: number;
  initialPrice: number;
  step?: number;
  presets?: OfferComposerPreset[];
  /** The package never invents negotiation odds — the host supplies this, swappable for a real model later. */
  getProbability: (price: number) => number;
  onSend: (price: number) => void;
  sendLabel?: string;
}

/**
 * Sheet content only — no Modal/sheet wrapper, same convention as ProductPickerContent.
 * Used for both an opening offer and a counter offer; only the props differ.
 */
export const OfferComposer: React.FC<OfferComposerProps> = ({
  product,
  min,
  max,
  initialPrice,
  step = 50,
  presets,
  getProbability,
  onSend,
  sendLabel = 'Send offer in chat',
}) => {
  const theme = useBargainTheme();
  const styles = createOfferComposerStyles(theme);
  const [price, setPrice] = useState(() => clamp(initialPrice, min, max));

  const setClamped = (next: number) => setPrice(clamp(Math.round(next / step) * step, min, max));

  return (
    <View style={styles.container}>
      <View style={styles.productTag}>
        <ProductPhoto imageUrl={product.imageUrl} icon={product.icon} size={32} />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>Listed {formatCurrency(product.listedPrice)}</Text>
      </View>

      <View style={styles.stepperRow}>
        <Pressable
          style={styles.stepperButton}
          onPress={() => setClamped(price - step)}
          accessibilityLabel="Decrease offer"
        >
          <Minus size={16} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.price}>{formatCurrency(price)}</Text>
        <Pressable
          style={styles.stepperButton}
          onPress={() => setClamped(price + step)}
          accessibilityLabel="Increase offer"
        >
          <Plus size={16} color={theme.colors.text} />
        </Pressable>
      </View>

      <View style={styles.rangeRow}>
        <Text style={styles.rangeLabel}>{formatCurrency(min)}</Text>
        <Text style={styles.rangeLabel}>{formatCurrency(max)} listed</Text>
      </View>

      {presets && presets.length > 0 ? (
        <View style={styles.presetRow}>
          {presets.map((preset) => (
            <Pressable key={preset.label} style={styles.presetChip} onPress={() => setClamped(preset.price)}>
              <Text style={styles.presetLabel}>
                {preset.label} · {formatCurrency(preset.price)}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <ProbabilityBar probability={getProbability(price)} />

      <Pressable style={styles.sendButton} onPress={() => onSend(price)}>
        <Text style={styles.sendLabel}>{sendLabel} →</Text>
      </Pressable>
    </View>
  );
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
