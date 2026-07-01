import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { useOfferSheet } from './context';
import {
  itemDetailsStyle,
  itemImageStyle,
  itemListStyle,
  itemPriceStyle,
  itemRowStyle,
  lockedBadgeIconStyle,
  lockedBadgeStyle,
  sectionLabelStyle,
} from './styledcomponents';

export function ItemList() {
  const { theme } = useTheme();
  const { items, selectedItemId, handleSelectItem } = useOfferSheet();

  return (
    <>
      <Text
        style={[theme.textPresets.label, sectionLabelStyle, { color: theme.colors.textSecondary }]}
      >
        Select an item from your cart
      </Text>
      <View style={itemListStyle}>
        {items.map((item) => {
          const selected = item.cart_item_id === selectedItemId;
          const locked = !!item.is_locked;
          return (
            <Pressable
              key={item.cart_item_id}
              onPress={() => handleSelectItem(item)}
              disabled={locked}
            >
              <View
                style={[
                  itemRowStyle,
                  {
                    borderRadius: theme.borderRadius.md,
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                    borderWidth: selected ? 2 : 1,
                    backgroundColor: theme.colors.surface,
                    opacity: locked ? 0.55 : 1,
                  },
                ]}
              >
                {item.product_image ? (
                  <Image
                    source={{ uri: item.product_image }}
                    style={[itemImageStyle, { borderRadius: theme.borderRadius.sm }]}
                  />
                ) : null}
                <View style={itemDetailsStyle}>
                  <Text
                    numberOfLines={1}
                    style={[
                      theme.textPresets.bodySmall,
                      { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold },
                    ]}
                  >
                    {item.product_name}
                  </Text>
                  <Text
                    style={[
                      theme.textPresets.caption,
                      itemPriceStyle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    ₹{item.selling_price} · qty {item.quantity}
                  </Text>
                  {locked && (
                    <View
                      style={[
                        lockedBadgeStyle,
                        {
                          backgroundColor: theme.dark
                            ? 'rgba(250, 199, 117, 0.15)'
                            : 'rgba(186, 117, 23, 0.1)',
                        },
                      ]}
                    >
                      <Ionicons
                        name="lock-closed"
                        size={11}
                        color={theme.colors.warning}
                        style={lockedBadgeIconStyle}
                      />
                      <Text
                        style={[theme.textPresets.caption, { color: theme.colors.warning, fontSize: 10 }]}
                      >
                        Already under negotiation
                      </Text>
                    </View>
                  )}
                </View>
                {locked ? (
                  <Ionicons name="lock-closed" size={18} color={theme.colors.textMuted} />
                ) : (
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={selected ? theme.colors.primary : theme.colors.textMuted}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
