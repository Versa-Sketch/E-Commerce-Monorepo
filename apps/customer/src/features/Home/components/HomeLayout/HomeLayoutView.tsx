import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FrequentItem } from '../../../../features/Reorder/types';
import { FrequentItemCard } from '../../../../features/Reorder/components/FrequentItemCard';
import Animated from 'react-native-reanimated';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { SharedValue } from 'react-native-reanimated';
import type { EdgeInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SCREEN_DIMENSIONS } from '../../Constants';
import HomeHeader from '../HomeHeader';
import CategoriesSection from '../CategoriesSection';
import SearchBar from '../SearchBar';
import SearchOverlay from '../SearchOverlay';
import FloatingCart from '../FloatingCart';
import CartSheet from '../CartSheet';
import ShopsSection from '../ShopsSection';
import AddressSheet from '../AddressSheet';
import CategoriesBottomSheet from '../CategoriesBottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = SCREEN_DIMENSIONS;

const AnimatedCloud = ({ style, opacity }: { style: any; opacity: number }) => (
  <Animated.View style={[{ position: 'absolute', pointerEvents: 'none' }, style]}>
    <Svg width="72" height="40" viewBox="0 0 50 30" fill="none">
      <Path
        d="M10 20a8 8 0 0 1 8-8h1a10 10 0 0 1 19-3 6 6 0 0 1 2 11h-30z"
        fill={`rgba(255, 255, 255, ${opacity})`}
      />
    </Svg>
  </Animated.View>
);

const AnimatedLeaf = ({ style, color, size }: { style: any; color: string; size: number }) => (
  <Animated.View style={[{ position: 'absolute', pointerEvents: 'none' }, style]}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 3c-2.3 0-4.6.9-6.4 2.6L4.2 12c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0l6.4-6.4C13.4 5.1 15.7 4.2 18 4.2c.4 0 .8 0 1.1-.1-.1.3-.1.7-.1 1.1 0 2.3-.9 4.6-2.6 6.4l-6.4 6.4c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0l6.4-6.4c1.7-1.7 2.6-4 2.6-6.4 0-1.8-.5-3.5-1.5-4.8C18.4 3.2 17.7 3 17 3z"
        fill={color}
      />
    </Svg>
  </Animated.View>
);

const AnimatedLocationPin = ({ style }: { style: any }) => (
  <Animated.View style={[{ position: 'absolute', pointerEvents: 'none' }, style]}>
    <Svg width="22" height="30" viewBox="0 0 24 30" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="#FF3B30"
      />
    </Svg>
  </Animated.View>
);

const AnimatedScooter = ({ style }: { style: any }) => (
  <Animated.View style={[{ position: 'absolute', pointerEvents: 'none' }, style]}>
    <Svg width="48" height="40" viewBox="0 0 64 64" fill="none">
      <Path
        d="M18 44c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm30 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm-8.3-9.5c.2-.5.5-.9.9-1.2l6.2-4.5c.6-.4.8-1.2.4-1.8-.4-.6-1.2-.8-1.8-.4l-6.2 4.5c-.8.6-1.3 1.5-1.5 2.5l-1.8 8.1H24.8c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h11.9c.7 0 1.3-.5 1.5-1.2l1.5-6.8 5 4.8c.4.4 1 .5 1.5.2l6-3.5c.7-.4.9-1.2.5-1.9s-1.2-.9-1.9-.5l-5.1 3-4.3-4.1zM34 22c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM14 36c0-1.1.9-2 2-2h12v-4H16c-3.3 0-6 2.7-6 6v4h4v-4z"
        fill="#16A34A"
      />
    </Svg>
  </Animated.View>
);

interface BuyAgainSectionProps {
  items: FrequentItem[];
  onAdd: (item: FrequentItem) => void;
  onDecrease: (item: FrequentItem) => void;
  getQty: (item: FrequentItem) => number;
  onSeeAll: () => void;
  theme: any;
}

const BuyAgainSection = ({ items, onAdd, onDecrease, getQty, onSeeAll, theme }: BuyAgainSectionProps) => {
  if (items.length === 0) return null;
  return (
    <View style={{ paddingTop: 20, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={{ fontSize: 15, fontFamily: theme.typography.fonts.bold, color: theme.colors.textPrimary }}>
          Buy Again
        </Text>
        <Pressable
          onPress={onSeeAll}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, gap: 3 }}
        >
          <Text style={{ fontSize: 12, fontFamily: theme.typography.fonts.semiBold, color: '#15803D' }}>
            See all
          </Text>
          <Ionicons name="chevron-forward" size={13} color="#15803D" />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {items.map((item) => (
          <FrequentItemCard
            key={item.variant_id}
            item={item}
            cartQuantity={getQty(item)}
            onAdd={onAdd}
            onDecrease={onDecrease}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface CartGroup {
  storeId: string;
  storeName: string;
  items: any[];
}

export interface HomeLayoutViewProps {
  theme: any;
  isDark: boolean;
  insets: EdgeInsets;

  statusBarStyle: 'light-content' | 'dark-content';

  scrollViewRef: React.RefObject<ScrollView | null>;
  onScroll: (event: any) => void;
  refreshing: boolean;
  onRefresh: () => void;

  breathingStyle: any;
  cloud1Style: any;
  cloud2Style: any;
  leaf1Style: any;
  leaf2Style: any;
  leaf3Style: any;
  pinStyle: any;
  scooterStyle: any;
  particle1Style: any;
  particle2Style: any;
  particle3Style: any;
  searchSlideAnimatedStyle: any;
  floatingCartAnimatedStyle: any;

  placeholderOpacity: SharedValue<number>;
  placeholderTranslateY: SharedValue<number>;
  placeholderIndex: number;

  isSearchActive: boolean;
  isSearchPending: boolean;
  searchQuery: string;
  recentSearches: string[];
  searchResults: any[];
  isSearchError: boolean;
  onActivateSearch: () => void;
  onDeactivateSearch: () => void;
  onSearchQueryChange: (text: string) => void;
  onRecentSearchPress: (query: string) => void;
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (item: string) => void;
  onSearchResultPress: (shopId: string) => void;
  onSearchRetry: (query: string) => void;

  selectedAddressId: string | null;
  activeAddress: any;
  usingCurrentLocation: boolean;
  isLocating: boolean;
  addresses: any[];
  addressSheetRef: React.RefObject<BottomSheetModal>;
  addressSnapPoints: string[];
  renderBackdrop: (props: any) => React.ReactElement;
  onAddressPress: () => void;
  onAddressSelect: (addr: any) => void;
  onUseCurrentLocation: () => void;
  onAddNewAddress: () => void;

  categories: any[];
  selectedCategory: string;
  categoryLoading: boolean;
  globalCategoriesStatus: string;
  isCloseBtnVisible: boolean;
  sheetRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
  onCategorySelect: (id: string) => void;
  onSeeAllCategories: () => void;
  onRetryCategories: () => void;
  onCategoriesSheetChange: (index: number) => void;
  onCloseCategoriesSheet: () => void;

  shops: any[];
  featuredShops: any[];
  shopsStatus: string;
  onShopPress: (shopId: string, query: string) => void;
  onFeaturedShopPress: (shopId: string) => void;
  onRetryShops: () => void;

  totalItemCount: number;
  onOpenCartSheet: () => void;
  onCheckoutPress: () => void;

  cartGroups: CartGroup[];
  totalItems: number;
  grandTotal: number;
  cartSheetRef: React.RefObject<BottomSheetModal>;
  cartSnapPoints: number[];
  isCartCloseBtnVisible: boolean;
  onCloseCartSheet: () => void;
  onGoToCart: (storeId?: string) => void;
  onClearAllCarts: () => void;
  onDeleteCart: (storeId: string) => void;
  hasActiveBargainForShop: (storeId: string) => boolean;
  onGetShopItemCount: (storeId: string) => number;
  onGetShopTotal: (storeId: string) => number;

  frequentItems: FrequentItem[];
  onAddFrequent: (item: FrequentItem) => void;
  onDecreaseFrequent: (item: FrequentItem) => void;
  getFrequentItemCartQty: (item: FrequentItem) => number;
  onGoToReorder: () => void;
}

export function HomeLayoutView({
  theme,
  isDark,
  insets,
  statusBarStyle,
  scrollViewRef,
  onScroll,
  refreshing,
  onRefresh,
  breathingStyle,
  cloud1Style,
  cloud2Style,
  leaf1Style,
  leaf2Style,
  leaf3Style,
  pinStyle,
  scooterStyle,
  particle1Style,
  particle2Style,
  particle3Style,
  searchSlideAnimatedStyle,
  floatingCartAnimatedStyle,
  placeholderOpacity,
  placeholderTranslateY,
  placeholderIndex,
  isSearchActive,
  isSearchPending,
  searchQuery,
  recentSearches,
  searchResults,
  isSearchError,
  onActivateSearch,
  onDeactivateSearch,
  onSearchQueryChange,
  onRecentSearchPress,
  onClearRecentSearches,
  onRemoveRecentSearch,
  onSearchResultPress,
  onSearchRetry,
  selectedAddressId,
  activeAddress,
  usingCurrentLocation,
  isLocating,
  addresses,
  addressSheetRef,
  addressSnapPoints,
  renderBackdrop,
  onAddressPress,
  onAddressSelect,
  onUseCurrentLocation,
  onAddNewAddress,
  categories,
  selectedCategory,
  categoryLoading,
  globalCategoriesStatus,
  isCloseBtnVisible,
  sheetRef,
  snapPoints,
  onCategorySelect,
  onSeeAllCategories,
  onRetryCategories,
  onCategoriesSheetChange,
  onCloseCategoriesSheet,
  shops,
  featuredShops,
  shopsStatus,
  onShopPress,
  onFeaturedShopPress,
  onRetryShops,
  totalItemCount,
  onOpenCartSheet,
  onCheckoutPress,
  cartGroups,
  totalItems,
  grandTotal,
  cartSheetRef,
  cartSnapPoints,
  isCartCloseBtnVisible,
  onCloseCartSheet,
  onGoToCart,
  onClearAllCarts,
  onDeleteCart,
  hasActiveBargainForShop,
  onGetShopItemCount,
  onGetShopTotal,
  frequentItems,
  onAddFrequent,
  onDecreaseFrequent,
  getFrequentItemCartQty,
  onGoToReorder,
}: HomeLayoutViewProps) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={statusBarStyle} />
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={{ height: 280 + insets.top, overflow: 'visible', position: 'relative' }}>
          <Image
            source={require('../../../../../assets/images/header.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />

          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
              breathingStyle,
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['rgba(22,163,74,0.3)', 'rgba(34,197,94,0.15)', 'rgba(255,255,255,0)']}
              style={{ flex: 1 }}
            />
          </Animated.View>

          <AnimatedCloud style={[cloud1Style, { top: insets.top + 10, left: 0 }]} opacity={0.35} />
          <AnimatedCloud style={[cloud2Style, { top: insets.top + 30, right: 0 }]} opacity={0.25} />

          <AnimatedLeaf style={[leaf1Style, { top: insets.top + 50, left: 30 }]} color="#22C55E" size={16} />
          <AnimatedLeaf style={[leaf2Style, { top: insets.top + 90, right: 40 }]} color="#16A34A" size={20} />
          <AnimatedLeaf style={[leaf3Style, { top: insets.top + 140, left: 80 }]} color="#DCFCE7" size={14} />

          <Animated.View style={[{ position: 'absolute', left: 60, width: 6, height: 6, borderRadius: 3, backgroundColor: '#DCFCE7' }, particle1Style]} />
          <Animated.View style={[{ position: 'absolute', right: 80, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BBF7D0' }, particle2Style]} />
          <Animated.View style={[{ position: 'absolute', left: SCREEN_WIDTH * 0.45, width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFFFFF' }, particle3Style]} />

          <AnimatedScooter style={[scooterStyle, { bottom: 54, left: 30 }]} />
          <AnimatedLocationPin style={[pinStyle, { bottom: 100, right: 80 }]} />

          <HomeHeader
            selectedAddressId={selectedAddressId}
            activeAddress={activeAddress}
            usingCurrentLocation={usingCurrentLocation}
            onAddressPress={onAddressPress}
          />

          <View style={{ position: 'absolute', bottom: -15, left: 0, right: 0, zIndex: 10 }}>
            <SearchBar
              placeholderIndex={placeholderIndex}
              placeholderOpacity={placeholderOpacity}
              placeholderTranslateY={placeholderTranslateY}
              onPress={onActivateSearch}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            paddingTop: 24,
            minHeight: SCREEN_HEIGHT - (280 + insets.top),
          }}
        >
          <View>
            <CategoriesSection
              categories={categories}
              selectedCategory={selectedCategory}
              categoryLoading={categoryLoading}
              isLoading={globalCategoriesStatus === 'FETCHING' && categories.length === 0}
              isError={globalCategoriesStatus === 'ERROR' && categories.length === 0}
              onCategorySelect={onCategorySelect}
              onSeeAllPress={onSeeAllCategories}
              onRetry={onRetryCategories}
            />
          </View>

          <BuyAgainSection
            items={frequentItems}
            onAdd={onAddFrequent}
            onDecrease={onDecreaseFrequent}
            getQty={getFrequentItemCartQty}
            onSeeAll={onGoToReorder}
            theme={theme}
          />

          <ShopsSection
            shops={shops}
            featuredShops={featuredShops}
            searchQuery={searchQuery}
            isLoading={categoryLoading || (shopsStatus === 'FETCHING' && shops.length === 0)}
            isError={shopsStatus === 'ERROR' && shops.length === 0}
            onShopPress={onShopPress}
            onFeaturedShopPress={onFeaturedShopPress}
            onRetry={onRetryShops}
          />
        </View>
      </ScrollView>

      {isSearchActive && (
        <Animated.View
          style={[
            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
            searchSlideAnimatedStyle,
          ]}
        >
          <SearchOverlay
            isSearchActive={isSearchActive}
            query={searchQuery}
            recentSearches={recentSearches}
            searchResults={searchResults}
            isSearchPending={isSearchPending}
            isSearchError={isSearchError}
            onRecentSearchPress={onRecentSearchPress}
            onTrendingSearchPress={onRecentSearchPress}
            onResultPress={onSearchResultPress}
            onClearRecent={onClearRecentSearches}
            onRemoveRecent={onRemoveRecentSearch}
            onChangeText={onSearchQueryChange}
            onRetry={onSearchRetry}
            onClose={onDeactivateSearch}
          />
        </Animated.View>
      )}

      {totalItemCount > 0 && (
        <FloatingCart
          totalItemCount={totalItemCount}
          onViewCartsPress={onOpenCartSheet}
          onCheckoutPress={onCheckoutPress}
          floatingCartAnimatedStyle={floatingCartAnimatedStyle}
        />
      )}

      <CategoriesBottomSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        categories={categories.slice(10)}
        selectedCategory={selectedCategory}
        isCloseBtnVisible={isCloseBtnVisible}
        onCategorySelect={onCategorySelect}
        onClose={onCloseCategoriesSheet}
        renderBackdrop={renderBackdrop}
        onSheetChange={onCategoriesSheetChange}
      />

      <CartSheet
        cartSheetRef={cartSheetRef}
        isCartCloseBtnVisible={isCartCloseBtnVisible}
        cartSnapPoints={cartSnapPoints}
        cartGroups={cartGroups}
        totalItems={totalItems}
        grandTotal={grandTotal}
        onClose={onCloseCartSheet}
        onGoToCart={onGoToCart}
        onClearAll={onClearAllCarts}
        onDeleteCart={onDeleteCart}
        hasActiveBargainForShop={hasActiveBargainForShop}
        onGetShopItemCount={onGetShopItemCount}
        onGetShopTotal={onGetShopTotal}
      />

      <AddressSheet
        addressSheetRef={addressSheetRef}
        snapPoints={addressSnapPoints}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        isLocating={isLocating}
        onAddressSelect={onAddressSelect}
        onUseCurrentLocation={onUseCurrentLocation}
        onAddNewAddress={onAddNewAddress}
        renderBackdrop={renderBackdrop}
      />
    </View>
  );
}

export default HomeLayoutView;
