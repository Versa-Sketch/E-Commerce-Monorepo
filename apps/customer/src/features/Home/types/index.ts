import Animated from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Swipeable } from "react-native-gesture-handler";
import { AddressApi } from "../../../types/shared";

// Staggered animation components
export interface StaggeredItemProps {
  index: number;
  children: React.ReactNode;
}

// Search Bar Props
export interface SearchBarProps {
  isSearchActive: boolean;
  value: string;
  placeholderIndex: number;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholderOpacity: any;
  placeholderTranslateY: any;
  searchProgress: any;
}

// Banner Carousel Props
export interface BannerCarouselProps {
  activeBannerIndex: number;
  onBannerIndexChange: (index: number) => void;
  isBannerDragging: React.MutableRefObject<boolean>;
}

// Categories Section Props
export interface CategoriesSectionProps {
  selectedCategory: string;
  categoryLoading: boolean;
  onCategorySelect: (categoryId: string) => void;
  onSeeAllPress: () => void;
}

// Search Overlay Props
export interface SearchOverlayProps {
  isSearchActive: boolean;
  query: string;
  recentSearches: string[];
  searchResults: any[];
  isSearchPending: boolean;
  onRecentSearchPress: (query: string) => void;
  onTrendingSearchPress: (query: string) => void;
  onResultPress: (shop: any) => void;
  onClearRecent: () => void;
}

// Floating Cart Props
export interface FloatingCartProps {
  totalItemCount: number;
  onViewCartsPress: () => void;
  onCheckoutPress: () => void;
  floatingCartAnimatedStyle: any;
}

// Cart Sheet Props
export interface CartSheetProps {
  cartSheetRef: React.RefObject<BottomSheetModal>;
  isCartCloseBtnVisible: boolean;
  cartSnapPoints: number[];
  onCheckoutPress: (storeId?: string) => void;
  onClosePress: () => void;
}

// Shops Section Props
export interface ShopsSectionProps {
  onShopPress: (shopId: string) => void;
  onRetry: () => void;
}

// Address Sheet Props
export interface AddressSheetProps {
  addressSheetRef: React.RefObject<BottomSheetModal>;
  selectedAddressId: string | null;
  addresses: AddressApi[];
  usingCurrentLocation: boolean;
  isLocating: boolean;
  onAddressSelect: (address: AddressApi) => void;
  onUseCurrentLocation: () => void;
  onAddNewAddress: () => void;
}

// Home Header Props
export interface HomeHeaderProps {
  selectedAddressId: string | null;
  activeAddress: AddressApi | undefined;
  usingCurrentLocation: boolean;
  onAddressPress: () => void;
  onProfilePress: () => void;
}

// Categories Bottom Sheet Props
export interface CategoriesBottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal>;
  remainingCategories: any[];
  selectedCategory: string;
  isCloseBtnVisible: boolean;
  onCategorySelect: (categoryId: string) => void;
  onClose: () => void;
}

// Cart group type (from cart store)
export interface CartGroup {
  storeId: string;
  storeName: string;
  items: any[];
}

// Animated Style Types
export interface AnimatedStyles {
  headerAnimatedStyle: any;
  categoriesAnimatedStyle: any;
  searchBarAnimatedStyle: any;
  searchBarOuterAnimatedStyle: any;
  searchBarInnerAnimatedStyle: any;
  cardsAnimatedStyle: any;
  dimmerAnimatedStyle: any;
  floatingSearchAnimatedStyle: any;
  floatingSearchSpacerStyle: any;
  placeholderAnimatedStyle: any;
  floatingCartAnimatedStyle: any;
  underlineAnimatedStyle: any;
}

// Home Screen State Type
export interface HomeScreenState {
  selectedAddressId: string | null;
  usingCurrentLocation: boolean;
  isLocating: boolean;
  isSearchActive: boolean;
  recentSearches: string[];
  isSearchPending: boolean;
  placeholderIndex: number;
  showFloatingSearch: boolean;
  statusBarStyle: "light-content" | "dark-content";
  activeBannerIndex: number;
  selectedCategory: string;
  categoryLoading: boolean;
  isCloseBtnVisible: boolean;
  isCartCloseBtnVisible: boolean;
  refreshing: boolean;
}
