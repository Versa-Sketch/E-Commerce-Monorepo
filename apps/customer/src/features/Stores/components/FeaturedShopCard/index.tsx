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
  closedOverlayStyle,
  closedTextStyle,
  containerStyle,
  dotStyle,
  footerRowStyle,
  infoStyle,
  metaTextStyle,
  ratingBadgeStyle,
  ratingTextStyle,
  subtitleTextStyle,
  titleRowStyle,
  titleTextStyle,
} from './styledcomponents';
interface FeaturedShopCardProps {
  shop: Shop;
  onPress: () => void;
  style?: ViewStyle;
}
export const FeaturedShopCard: React.FC<FeaturedShopCardProps> = ({ shop, onPress, style }) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const rating = parseFloat(shop.average_rating);
  const showCover = !!shop.cover_image_url && !imageError;
  const placeholder = getShopPlaceholderPalette(shop);
  const reviewCountText = formatReviewCount(shop.review_count);
  const etaText = formatEta(shop);
  const distanceText = formatDistance(shop);
  const cuisineText = shop.shop_types.map((type) => type.name).join(', ');
  const footerParts = [etaText, distanceText].filter(Boolean) as string[];
  return (
    <Pressable
      onPress={onPress}
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
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
            source={{ uri: shop.cover_image_url }}
            style={bannerImageStyle}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons name={getShopIconName(shop)} size={40} color={placeholder.foreground} />
        )}
        {!Number.isNaN(rating) && rating > 0 && (
          <View style={[ratingBadgeStyle, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="star" size={11} color={theme.colors.warning} style={{ marginRight: 3 }} />
            <Text style={[ratingTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
              {rating.toFixed(1)}
            </Text>
            {reviewCountText && (
              <Text style={[ratingTextStyle, { color: theme.colors.textSecondary, marginLeft: 3 }]}>
                ({reviewCountText})
              </Text>
            )}
          </View>
        )}
        {!shop.is_open && (
          <View style={[closedOverlayStyle, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]}>
            <Text style={[closedTextStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold }]}>CLOSED</Text>
          </View>
        )}
      </View>
      <View style={infoStyle}>
        <View style={titleRowStyle}>
          <Text numberOfLines={1} style={[titleTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, flexShrink: 1 }]}>
            {shop.name}
          </Text>
          {shop.is_verified && (
            <Ionicons name="checkmark-circle" size={13} color="#2B7DE9" style={{ marginLeft: 4 }} />
          )}
        </View>
        {!!cuisineText && (
          <Text numberOfLines={1} style={[subtitleTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
            {cuisineText}
          </Text>
        )}
        {footerParts.length > 0 && (
          <View style={footerRowStyle}>
            {footerParts.map((part, index) => (
              <React.Fragment key={part}>
                {index > 0 && <Text style={[dotStyle, { color: theme.colors.textSecondary }]}>•</Text>}
                <Text style={[metaTextStyle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>{part}</Text>
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};
export default FeaturedShopCard;
