import { Shop } from '@/types/shared';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { formatDistance, formatEta, formatReviewCount } from '../../utils/shopFormatters';
import { getShopIconName, getShopPlaceholderPalette } from '../../utils/shopVisuals';
import {
  BANNER_HEIGHT,
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
  const { theme, isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const rating = parseFloat(shop.average_rating);
  const minOrder = parseFloat(shop.min_order);
  const placeholder = getShopPlaceholderPalette(shop);
  const reviewCountText = formatReviewCount(shop.review_count) ?? FALLBACK_REVIEW_COUNT_TEXT;
  const etaText = formatEta(shop) ?? FALLBACK_ETA_TEXT;
  const distanceText = formatDistance(shop) ?? FALLBACK_DISTANCE_TEXT;

  const apiImages = (shop.images ?? []).filter(Boolean);
  const fallbackUri = shop.image || shop.cover_image_url;
  const rawUris: string[] = apiImages.length > 0 ? apiImages : (fallbackUri ? [fallbackUri] : []);
  // Shuffle once per mount using Fisher-Yates
  const [imageUris] = useState(() => {
    const arr = [...rawUris];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const hasImages = imageUris.length > 0 && !imageError;
  const isCarousel = imageUris.length > 1;

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

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (carouselWidth === 0) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / carouselWidth);
    setActiveImageIndex(index);
  };

  const renderBanner = () => {
    if (!hasImages) {
      return (
        <Pressable onPress={onPress}>
          <View style={[bannerStyle, { backgroundColor: placeholder.background }]}>
            <Ionicons name={getShopIconName(shop)} size={40} color={placeholder.foreground} />
          </View>
        </Pressable>
      );
    }

    if (!isCarousel) {
      return (
        <Pressable onPress={onPress}>
          <View style={[bannerStyle, { backgroundColor: placeholder.background }]}>
            <Image
              source={{ uri: imageUris[0] }}
              style={{ width: '100%', height: BANNER_HEIGHT }}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable onPress={onPress}>
        <View
          style={{ width: '100%', height: BANNER_HEIGHT, backgroundColor: placeholder.background }}
          onLayout={(e) => {
            const w = Math.floor(e.nativeEvent.layout.width);
            if (w > 0 && w !== carouselWidth) setCarouselWidth(w);
          }}
        >
          {carouselWidth > 0 && (
            <ScrollView
              horizontal
              snapToInterval={carouselWidth}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={onScrollEnd}
              onScrollEndDrag={onScrollEnd}
              style={{ width: carouselWidth, height: BANNER_HEIGHT }}
            >
              {imageUris.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={{ width: carouselWidth, height: BANNER_HEIGHT }}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              ))}
            </ScrollView>
          )}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {imageUris.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === activeImageIndex ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === activeImageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View style={{ position: 'relative' }}>
        {renderBanner()}
        {!!primaryCategory && (
          <View
            pointerEvents="none"
            style={[categoryTagStyle, { backgroundColor: 'rgba(0, 0, 0, 0.55)' }]}
          >
            <Text numberOfLines={1} style={[categoryTagTextStyle, { fontFamily: theme.typography.fonts.medium }]}>
              {primaryCategory}
            </Text>
          </View>
        )}
        {!shop.is_open && (
          <View
            pointerEvents="none"
            style={[closedOverlayStyle, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]}
          >
            <Text style={[closedTextStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold }]}>CLOSED</Text>
          </View>
        )}
      </View>

      <Pressable onPress={onPress} style={infoContainerStyle}>
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
          <View style={ratingColumnStyle}>
            <View style={[ratingBadgeStyle, { backgroundColor: '#16A34A' }]}>
              <Ionicons name="star" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={[ratingTextStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold }]}>
                {!Number.isNaN(rating) && rating > 0 ? rating.toFixed(1) : '4.0'}
              </Text>
            </View>
            <Text style={[reviewCountTextStyle, { color: theme.colors.textSecondary }]}>By {reviewCountText}</Text>
          </View>
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
            <Ionicons name="time-outline" size={15} color="#F59E0B" />
            <Text style={[footerTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}>
              {etaText}
            </Text>
          </View>
          <View style={footerItemStyle}>
            <Ionicons name="location-outline" size={15} color="#16A34A" />
            <Text style={[footerTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}>
              {distanceText}
            </Text>
          </View>
          {!Number.isNaN(minOrder) && minOrder > 0 && (
            <View style={footerItemStyle}>
              <Ionicons name="receipt-outline" size={15} color="#8B5CF6" />
              <Text style={[footerTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}>
                Min ₹{minOrder.toFixed(0)}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};
export default ShopCard;
