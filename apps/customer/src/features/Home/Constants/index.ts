import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AddressType } from '../../../types/shared';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Cart & Swipe constants
export const CART_DELETE_ACTION_WIDTH = 110;

// Search constants
export const SEARCH_OVERLAY_TOP_OFFSET = 76;
export const FLOATING_SEARCH_SCROLL_THRESHOLD = 160;

// Banner carousel constants
export const BANNER_AUTOPLAY_INTERVAL = 4000; // 4 seconds

// Search placeholder constants
export const SEARCH_PLACEHOLDERS = [
  "Search for 'Milk'",
  "Search for 'Bread'",
  "Search for 'Vegetables'",
  "Search for 'Medicines'",
  "Search for 'Snacks'",
];
export const PLACEHOLDER_ROTATE_INTERVAL = 3000;

// Home banner images
export const HOME_BANNERS = [
  'https://img.magnific.com/free-psd/food-menu-restaurant-facebook-cover-banner-template_120329-4875.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.magnific.com/premium-vector/food-restaurant-menu-social-media-marketing-web-banner-template-design_673898-382.jpg?semt=ais_hybrid&w=740&q=80',
  'https://static.vecteezy.com/system/resources/thumbnails/040/537/735/small/fast-food-or-restaurant-business-promotion-social-media-marketing-web-banner-template-with-logo-and-icon-pizza-burger-or-healthy-food-business-promotional-flyer-design-layout-vector.jpg',
];

// Address icon mapping
export const ADDRESS_ICON_BY_TYPE: Record<
  AddressType,
  keyof typeof Ionicons.glyphMap
> = {
  HOME: 'home-outline',
  WORK: 'briefcase-outline',
  SHOP: 'storefront-outline',
  OTHER: 'location-outline',
};

// Animation durations
export const TAB_BAR_ANIMATION_DURATION = 350;
export const FLOATING_CART_SHIFT_Y = 60;

// Dimensions
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
