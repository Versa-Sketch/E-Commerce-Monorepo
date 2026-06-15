import { Store } from '@/types/shared';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  badgeStyle,
  badgesWrapperStyle,
  badgeTextStyle,
  closedOverlayStyle,
  closedTextStyle,
  containerStyle,
  coverImageStyle,
  imageContainerStyle,
  infoContainerStyle,
  logoAvatarStyle,
  ratingRowStyle,
  starIconStyle,
  statusDotStyle,
  titleRowStyle,
} from './styledcomponents';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface StoreCardProps {
  store: Store;
  onPress: () => void;
  style?: ViewStyle;
}
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80';
export const StoreCard: React.FC<StoreCardProps> = ({ store, onPress, style }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 10, stiffness: 200 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 10, stiffness: 200 }); };
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const deliveryLabel = store.deliveryFee === 0 ? 'Free delivery' : `₹${store.deliveryFee} delivery`;
  const deliveryColor = store.deliveryFee === 0 ? theme.colors.accent : theme.colors.textSecondary;
  // Render helpers
  const renderCoverImage = () => (
    <Image source={{ uri: store.coverUrl || DEFAULT_COVER }} style={coverImageStyle} resizeMode="cover" />
  );
  const renderBadges = () => (
    <View style={badgesWrapperStyle}>
      {store.isOpen ? (
        <View style={[badgeStyle, { backgroundColor: '#E8F8F0' }]}>
          <View style={[statusDotStyle, { backgroundColor: theme.colors.success }]} />
          <Text style={[badgeTextStyle, { color: theme.colors.success, fontFamily: theme.typography.fonts.bold }]}>OPEN</Text>
        </View>
      ) : (
        <View style={[badgeStyle, { backgroundColor: '#FEECEC' }]}>
          <Text style={[badgeTextStyle, { color: theme.colors.error, fontFamily: theme.typography.fonts.bold }]}>CLOSED</Text>
        </View>
      )}
      {store.deliveryFee === 0 && (
        <View style={[badgeStyle, { backgroundColor: 'rgba(0, 109, 119, 0.08)', marginLeft: 6 }]}>
          <Text style={[badgeTextStyle, { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold }]}>FREE DEL</Text>
        </View>
      )}
      {store.rating >= 4.5 && (
        <View style={[badgeStyle, { backgroundColor: '#FBEBE4', marginLeft: 6 }]}>
          <Ionicons name="flame" size={10} color={theme.colors.accent} style={{ marginRight: 2 }} />
          <Text style={[badgeTextStyle, { color: theme.colors.accent, fontFamily: theme.typography.fonts.bold }]}>POPULAR</Text>
        </View>
      )}
    </View>
  );
  const renderClosedOverlay = () => (
    <View style={closedOverlayStyle}>
      <Text style={[closedTextStyle, { fontFamily: theme.typography.fonts.bold }]}>CLOSED</Text>
    </View>
  );
  const renderStoreInfo = () => (
    <View style={[infoContainerStyle, { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 16 }]}>
      <View style={titleRowStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 }}>
          <Text numberOfLines={1} style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 17 }]}>
            {store.name}
          </Text>
          <Ionicons name="checkmark-circle" size={15} color="#2B7DE9" style={{ marginLeft: 4, marginTop: 1 }} />
        </View>
        <View style={ratingRowStyle}>
          <Ionicons name="star" size={14} color="#C97C5D" style={starIconStyle} />
          <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
            {store.rating}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={[theme.textPresets.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xxs, fontSize: 13 }]}>
        {store.category.toUpperCase().replace('_', ' ')} • {store.address.split(',')[1] || store.address}
      </Text>
      <Text style={[theme.textPresets.caption, { color: theme.colors.textSecondary, fontSize: 13, marginTop: 4 }]}>
        <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fonts.medium }}>{store.deliveryEta} mins</Text>
        {' • '}
        {typeof store.distance === 'number' ? store.distance.toFixed(1) : store.distance} km away
        {' • '}
        <Text style={{ color: deliveryColor, fontFamily: store.deliveryFee === 0 ? theme.typography.fonts.bold : theme.typography.fonts.regular }}>
          {deliveryLabel}
        </Text>
      </Text>
    </View>
  );
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.xl,
          shadowColor: 'rgba(0, 60, 70, 0.06)',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 16,
          elevation: 4,
        },
        animatedStyle,
        style,
      ]}
    >
      <View style={[imageContainerStyle, { borderTopLeftRadius: theme.borderRadius.xl, borderTopRightRadius: theme.borderRadius.xl }]}>
        {renderCoverImage()}
        {renderBadges()}
        <Image source={{ uri: store.logoUrl }} style={[logoAvatarStyle, { borderColor: theme.colors.surface }]} />
        {!store.isOpen && renderClosedOverlay()}
      </View>
      {renderStoreInfo()}
    </AnimatedPressable>
  );
};
export default StoreCard;
