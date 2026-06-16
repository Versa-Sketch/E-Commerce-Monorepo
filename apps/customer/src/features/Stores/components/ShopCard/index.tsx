import { Shop } from '@/types/shared';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Pressable, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { formatDistance, formatEta, formatReviewCount } from '../../utils/shopFormatters';
import { getShopIconName, getShopPlaceholderPalette } from '../../utils/shopVisuals';
import {
  bannerImageStyle,
  bannerStyle,
  categoryTagStyle,
  categoryTagTextStyle,
  chipStyle,
  chipsRowStyle,
  chipTextStyle,
  closedOverlayStyle,
  closedTextStyle,
  containerStyle,
  footerItemStyle,
  footerRowStyle,
  footerTextStyle,
  headerRowStyle,
  infoContainerStyle,
  ratingBadgeStyle,
  ratingColumnStyle,
  ratingTextStyle,
  reviewCountTextStyle,
  titleColumnStyle,
  titleRowStyle,
  titleTextStyle,
} from './styledcomponents';

// Placeholder values shown until the API consistently returns these fields for every shop.
const FALLBACK_ETA_TEXT = '20-30 mins';
const FALLBACK_DISTANCE_TEXT = '1.5 km';
const FALLBACK_REVIEW_COUNT_TEXT = '50+';
const MAX_VISIBLE_CATEGORY_CHIPS = 3;

interface ShopCardProps {
  shop: Shop;
  onPress: () => void;
  style?: ViewStyle;
}
export const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress, style }) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const rating = parseFloat(shop.average_rating);
  const minOrder = parseFloat(shop.min_order);
  const coverUri = shop.image || shop.cover_image_url;
  const showCover = !!coverUri && !imageError;
  const placeholder = getShopPlaceholderPalette(shop);
  const reviewCountText = formatReviewCount(shop.review_count) ?? FALLBACK_REVIEW_COUNT_TEXT;
  const etaText = formatEta(shop) ?? FALLBACK_ETA_TEXT;
  const distanceText = formatDistance(shop) ?? FALLBACK_DISTANCE_TEXT;

  const categoryNames: string[] = [];
  const seenCategories = new Set<string>();
  const addCategory = (name?: string) => {
    if (!name) return;
    const key = name.trim().toLowerCase();
    if (!key || seenCategories.has(key)) return;
    seenCategories.add(key);
    categoryNames.push(name.trim());
  };
  shop.shop_types.forEach((type) => addCategory(type.name));
  (shop.matched_categories ?? []).forEach((category) => addCategory(category.name));
  (shop.matched_subcategories ?? []).forEach((subcategory) => addCategory(subcategory.name));

  const visibleCategories = categoryNames.slice(0, MAX_VISIBLE_CATEGORY_CHIPS);
  const remainingCategoryCount = categoryNames.length - visibleCategories.length;
  const primaryCategory = categoryNames[0];

  return (
    <Pressable
      onPress={onPress}
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          shadowColor: 'rgba(0, 60, 70, 0.06)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 3,
        },
        style,
      ]}
    >
      <View style={[bannerStyle, { backgroundColor: placeholder.background }]}>
        {showCover ? (
          <Image
            source={{ uri: coverUri }}
            style={bannerImageStyle}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons name={getShopIconName(shop)} size={40} color={placeholder.foreground} />
        )}
        {!!primaryCategory && (
          <View style={[categoryTagStyle, { backgroundColor: 'rgba(0, 0, 0, 0.55)' }]}>
            <Text numberOfLines={1} style={[categoryTagTextStyle, { fontFamily: theme.typography.fonts.medium }]}>
              {primaryCategory}
            </Text>
          </View>
        )}
        {!shop.is_open && (
          <View style={[closedOverlayStyle, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]}>
            <Text style={[closedTextStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold }]}>CLOSED</Text>
          </View>
        )}
      </View>
      <View style={infoContainerStyle}>
        <View style={headerRowStyle}>
          <View style={titleColumnStyle}>
            <View style={titleRowStyle}>
              <Text
                numberOfLines={1}
                style={[titleTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}
              >
                {shop.name}
              </Text>
              {shop.is_verified && (
                <Ionicons name="checkmark-circle" size={15} color="#2B7DE9" style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>
          {!Number.isNaN(rating) && rating > 0 && (
            <View style={ratingColumnStyle}>
              <View style={[ratingBadgeStyle, { backgroundColor: 'rgba(34, 197, 94, 0.12)' }]}>
                <Ionicons name="star" size={12} color="#16A34A" style={{ marginRight: 3 }} />
                <Text style={[ratingTextStyle, { color: '#16A34A', fontFamily: theme.typography.fonts.semiBold }]}>
                  {rating.toFixed(1)}
                </Text>
              </View>
              <Text style={[reviewCountTextStyle, { color: theme.colors.textSecondary }]}>By {reviewCountText}</Text>
            </View>
          )}
        </View>
        {visibleCategories.length > 0 && (
          <View style={chipsRowStyle}>
            {visibleCategories.map((name) => (
              <View key={name} style={[chipStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
                <Text numberOfLines={1} style={[chipTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
                  {name}
                </Text>
              </View>
            ))}
            {remainingCategoryCount > 0 && (
              <View style={[chipStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
                <Text style={[chipTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
                  +{remainingCategoryCount} more
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={footerRowStyle}>
          <View style={footerItemStyle}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={[footerTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
              {etaText}
            </Text>
          </View>
          <View style={footerItemStyle}>
            <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={[footerTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
              {distanceText}
            </Text>
          </View>
          {!Number.isNaN(minOrder) && minOrder > 0 && (
            <View style={footerItemStyle}>
              <Ionicons name="receipt-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[footerTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
                Min ₹{minOrder.toFixed(0)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
export default ShopCard;
