import { useRouter } from 'expo-router';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Dimensions, ScrollView } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useCartStore } from '../../../../features/Cart/Providers/useCartStore';
import { useAddressStore } from '../../../../features/Addresses/Providers/useAddressStore';
import { useStoresStore } from '../../../../features/Stores/Providers/useStoresStore';
import { useReorderStore } from '../../../../features/Reorder/Providers/useReorderStore';
import { locationStore } from '../../../../stores/LocationStore';
import { API_STATUS } from '../../../../Common/Constants';
import type { FrequentItem } from '../../../../features/Reorder/types';
import type { Product } from '../../../../types/shared';
import {
  SEARCH_PLACEHOLDERS,
  PLACEHOLDER_ROTATE_INTERVAL,
  FLOATING_CART_SHIFT_Y,
  TAB_BAR_ANIMATION_DURATION,
  SCREEN_DIMENSIONS,
  FLOATING_SEARCH_SCROLL_THRESHOLD,
} from '../../Constants';
import { HomeLayoutView } from './HomeLayoutView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = SCREEN_DIMENSIONS;

export const HomeLayoutContainer = observer(function HomeLayoutContainer() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const authStore = useAuthStore();
  const storesStore = useStoresStore();
  const cartStore = useCartStore();
  const reorderStore = useReorderStore();
  const cartGroups = toJS(cartStore.groupedByStore);
  const topFrequentItems = toJS(reorderStore.frequentItems).slice(0, 5);
  const totalItems = cartStore.totalItemCount;
  const grandTotal = cartStore.totalItemCount > 0
    ? cartStore.groupedByStore.reduce((sum, g) => sum + cartStore.getShopTotals(g.storeId).grandTotal, 0)
    : 0;
  const addressStore = useAddressStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Organic Tomatoes',
    'Cotton Tee',
    'Crocin',
  ]);
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState<'light-content' | 'dark-content'>('light-content');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategoryState] = useState<string>('all');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isCloseBtnVisible, setIsCloseBtnVisible] = useState(false);
  const [isCartCloseBtnVisible, setIsCartCloseBtnVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollY = useRef(0);
  const gradientHeaderHeight = useRef(0);
  const isBannerDragging = useRef(false);
  const categoryLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const hasInitializedUnderline = useRef(false);
  const bannerScrollRef = useRef<ScrollView>(null);
  const categoriesScrollRef = useRef<ScrollView>(null);
  const categoriesScrollOffset = useRef(0);
  const categoriesScrollViewWidth = useRef(0);
  const loadedCategories = useRef<Set<string>>(new Set(['all']));
  const cartSwipeableRefs = useRef<Map<string, any>>(new Map());
  const cartProgrammaticOpen = useRef<Set<string>>(new Set());

  const sheetRef = useRef<BottomSheetModal>(null) as React.RefObject<BottomSheetModal>;
  const cartSheetRef = useRef<BottomSheetModal>(null) as React.RefObject<BottomSheetModal>;
  const addressSheetRef = useRef<BottomSheetModal>(null) as React.RefObject<BottomSheetModal>;

  const placeholderOpacity = useSharedValue(1);
  const placeholderTranslateY = useSharedValue(0);
  const searchSlideX = useSharedValue(-SCREEN_WIDTH);
  const floatingSearchVisible = useSharedValue(0);
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  const breathingOpacity = useSharedValue(0.35);
  const cloud1X = useSharedValue(-80);
  const cloud2X = useSharedValue(SCREEN_WIDTH + 20);
  const leaf1Y = useSharedValue(0);
  const leaf1X = useSharedValue(0);
  const leaf1Rot = useSharedValue(0);
  const leaf2Y = useSharedValue(0);
  const leaf2X = useSharedValue(0);
  const leaf2Rot = useSharedValue(0);
  const leaf3Y = useSharedValue(0);
  const leaf3X = useSharedValue(0);
  const leaf3Rot = useSharedValue(0);
  const pinY = useSharedValue(0);
  const scooterY = useSharedValue(0);
  const scooterRot = useSharedValue(0);
  const particle1Y = useSharedValue(200);
  const particle1Opacity = useSharedValue(0.15);
  const particle2Y = useSharedValue(230);
  const particle2Opacity = useSharedValue(0.1);
  const particle3Y = useSharedValue(180);
  const particle3Opacity = useSharedValue(0.05);

  const isTabBarVisible = storesStore.isTabBarVisible;

  const breathingStyle = useAnimatedStyle(() => ({ opacity: breathingOpacity.value }));
  const cloud1Style = useAnimatedStyle(() => ({ transform: [{ translateX: cloud1X.value }] }));
  const cloud2Style = useAnimatedStyle(() => ({ transform: [{ translateX: cloud2X.value }] }));
  const leaf1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: leaf1Y.value }, { translateX: leaf1X.value }, { rotate: `${leaf1Rot.value}deg` }],
  }));
  const leaf2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: leaf2Y.value }, { translateX: leaf2X.value }, { rotate: `${leaf2Rot.value}deg` }],
  }));
  const leaf3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: leaf3Y.value }, { translateX: leaf3X.value }, { rotate: `${leaf3Rot.value}deg` }],
  }));
  const pinStyle = useAnimatedStyle(() => ({ transform: [{ translateY: pinY.value }] }));
  const scooterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scooterY.value }, { rotate: `${scooterRot.value}deg` }],
  }));
  const particle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle1Y.value }],
    opacity: particle1Opacity.value,
  }));
  const particle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle2Y.value }],
    opacity: particle2Opacity.value,
  }));
  const particle3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle3Y.value }],
    opacity: particle3Opacity.value,
  }));
  const floatingCartAnimatedStyle = useAnimatedStyle(() => ({
    bottom: insets.bottom + 64,
    transform: [{
      translateY: withTiming(isTabBarVisible ? 0 : FLOATING_CART_SHIFT_Y, {
        duration: TAB_BAR_ANIMATION_DURATION,
      }),
    }],
  }), [isTabBarVisible, insets.bottom]);
  const searchSlideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchSlideX.value }],
  }));

  const snapPoints = useMemo(() => ['75%'], []);
  const cartSnapPoints = useMemo(() => {
    const groupCount = cartStore.groupedByStore.length;
    const overhead = 239 + insets.bottom;
    const rowHeight = 82;
    const contentHeight = groupCount === 0
      ? SCREEN_HEIGHT * 0.45
      : overhead + groupCount * rowHeight;
    const maxHeight = SCREEN_HEIGHT * 0.80;
    return [Math.min(contentHeight, maxHeight)];
  }, [cartStore.groupedByStore.length, insets.bottom]);
  const addressSnapPoints = useMemo(() => ['62%'], []);

  const locParams = locationStore.location
    ? { lat: locationStore.location.latitude, lng: locationStore.location.longitude }
    : {};

  useEffect(() => {
    if (isSearchActive) {
      searchSlideX.value = SCREEN_WIDTH;
      searchSlideX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [isSearchActive]);

  useEffect(() => {
    if (!isSearchActive) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      deactivateSearch();
      return true;
    });
    return () => sub.remove();
  }, [isSearchActive]);

  useEffect(() => {
    storesStore.setTabBarVisible(true);
    storesStore.fetchGlobalCategories();
    storesStore.fetchFeaturedShops();
    storesStore.fetchShops({ ...locParams });
    cartStore.hydrateAllCarts();
    addressStore.fetchAddresses();
    reorderStore.fetchFrequentItems();
    return () => { storesStore.setTabBarVisible(true); };
  }, []);

  useEffect(() => {
    if (selectedAddressId && addressStore.addresses.some((a) => a.id === selectedAddressId)) return;
    const fallback = addressStore.defaultAddress ?? addressStore.addresses[0];
    setSelectedAddressId(fallback ? fallback.id : null);
  }, [addressStore.addresses.length]);

  useEffect(() => {
    const query = storesStore.filters.searchQuery;
    if (!query.trim()) {
      setIsSearchPending(false);
      storesStore.searchShops({ q: '' });
      return;
    }
    setIsSearchPending(true);
    const timer = setTimeout(() => {
      storesStore.searchShops({ q: query }).finally(() => setIsSearchPending(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [storesStore.filters.searchQuery]);

  useEffect(() => {
    breathingOpacity.value = withRepeat(withTiming(0.65, { duration: 5500, easing: Easing.inOut(Easing.ease) }), -1, true);
    cloud1X.value = withRepeat(withTiming(SCREEN_WIDTH + 80, { duration: 25000, easing: Easing.linear }), -1, false);
    cloud2X.value = withRepeat(withTiming(-90, { duration: 32000, easing: Easing.linear }), -1, false);
    leaf1Y.value = withRepeat(withTiming(16, { duration: 4200, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf1X.value = withRepeat(withTiming(12, { duration: 3500, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf1Rot.value = withRepeat(withTiming(25, { duration: 5000, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf2Y.value = withRepeat(withTiming(-12, { duration: 4800, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf2X.value = withRepeat(withTiming(-8, { duration: 3800, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf2Rot.value = withRepeat(withTiming(-20, { duration: 4600, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf3Y.value = withRepeat(withTiming(18, { duration: 5200, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf3X.value = withRepeat(withTiming(14, { duration: 4400, easing: Easing.inOut(Easing.ease) }), -1, true);
    leaf3Rot.value = withRepeat(withTiming(30, { duration: 5800, easing: Easing.inOut(Easing.ease) }), -1, true);
    pinY.value = withRepeat(withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
    scooterY.value = withRepeat(withTiming(-4, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
    scooterRot.value = withRepeat(withTiming(1.5, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
    particle1Y.value = withRepeat(withTiming(40, { duration: 7500, easing: Easing.linear }), -1, false);
    particle1Opacity.value = withRepeat(withSequence(withTiming(0.8, { duration: 3750 }), withTiming(0, { duration: 3750 })), -1, false);
    particle2Y.value = withRepeat(withTiming(50, { duration: 9000, easing: Easing.linear }), -1, false);
    particle2Opacity.value = withRepeat(withSequence(withTiming(0.6, { duration: 4500 }), withTiming(0, { duration: 4500 })), -1, false);
    particle3Y.value = withRepeat(withTiming(30, { duration: 6500, easing: Easing.linear }), -1, false);
    particle3Opacity.value = withRepeat(withSequence(withTiming(0.7, { duration: 3250 }), withTiming(0, { duration: 3250 })), -1, false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      placeholderOpacity.value = withTiming(0, { duration: 400 });
      placeholderTranslateY.value = withTiming(-10, { duration: 400 });
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        placeholderTranslateY.value = 10;
        placeholderOpacity.value = withTiming(1, { duration: 400 });
        placeholderTranslateY.value = withTiming(0, { duration: 400 });
      }, 400);
    }, PLACEHOLDER_ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (categoryLoading && (storesStore.shopsStatus === API_STATUS.SUCCESS || storesStore.shopsStatus === API_STATUS.ERROR)) {
      setCategoryLoading(false);
      loadedCategories.current.add(selectedCategory);
    }
  }, [storesStore.shopsStatus, categoryLoading, selectedCategory]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const activateSearch = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setShowFloatingSearch(false);
    floatingSearchVisible.value = withTiming(0, { duration: 150 });
    setIsSearchActive(true);
  };

  const deactivateSearch = () => {
    storesStore.setSearchQuery('');
    searchSlideX.value = withTiming(SCREEN_WIDTH, {
      duration: 280,
      easing: Easing.in(Easing.cubic),
    }, (finished) => {
      if (finished) runOnJS(setIsSearchActive)(false);
    });
  };

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) > 10) {
      if (diff > 0 && currentY > 50) {
        if (storesStore.isTabBarVisible) storesStore.setTabBarVisible(false);
      } else if (diff < 0) {
        if (!storesStore.isTabBarVisible) storesStore.setTabBarVisible(true);
      }

      const floatingSearchThreshold = gradientHeaderHeight.current > 0
        ? gradientHeaderHeight.current
        : FLOATING_SEARCH_SCROLL_THRESHOLD;

      const nextShowFloatingSearch = currentY > floatingSearchThreshold;
      if (nextShowFloatingSearch !== showFloatingSearch) {
        setShowFloatingSearch(nextShowFloatingSearch);
        floatingSearchVisible.value = withTiming(nextShowFloatingSearch ? 1 : 0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      }

      const nextBarStyle = currentY > floatingSearchThreshold
        ? (isDark ? 'light-content' : 'dark-content')
        : 'light-content';
      if (nextBarStyle !== statusBarStyle) setStatusBarStyle(nextBarStyle);

      lastScrollY.current = currentY;
    }

    if (currentY <= 0 && !storesStore.isTabBarVisible) storesStore.setTabBarVisible(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      const targetId = 'all';
      if (!loadedCategories.current.has(targetId)) setCategoryLoading(true);
      setSelectedCategoryState(targetId);
      storesStore.fetchShops({ ...locParams });
    } else {
      if (!loadedCategories.current.has(categoryId)) setCategoryLoading(true);
      setSelectedCategoryState(categoryId);
      const isParent = storesStore.globalCategories.some((cat) => cat.id === categoryId);
      if (isParent) {
        storesStore.fetchShops({ ...locParams, category_id: categoryId });
      } else {
        storesStore.fetchShops({ ...locParams, subcategory_id: categoryId });
      }
    }
  };

  const handleAddressSelect = (addr: any) => {
    setUsingCurrentLocation(false);
    setSelectedAddressId(addr.id);
    addressSheetRef.current?.dismiss();
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      await locationStore.refreshLocation();
      if (locationStore.location) {
        setUsingCurrentLocation(true);
        setSelectedAddressId(null);
        addressSheetRef.current?.dismiss();
      } else {
        Alert.alert('Location unavailable', 'Could not detect your location. Please try again or select a saved address.');
      }
    } catch {
      Alert.alert('Location error', 'Failed to get your location. Please check permissions and try again.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleAddNewAddress = () => {
    addressSheetRef.current?.dismiss();
    router.push('/customer/addresses/form');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      storesStore.fetchGlobalCategories(),
      storesStore.fetchFeaturedShops(),
      storesStore.fetchShops({ ...locParams }),
    ]).finally(() => setRefreshing(false));
  };

  const handleSeeAllCategories = () => {
    setIsCloseBtnVisible(true);
    sheetRef.current?.present();
  };

  const handleCategoriesSheetChange = (index: number) => {
    if (index === -1) setIsCloseBtnVisible(false);
    else setIsCloseBtnVisible(true);
  };

  const handleCloseCategoriesSheet = () => setIsCloseBtnVisible(false);

  const handleOpenCartSheet = () => {
    setIsCartCloseBtnVisible(true);
    cartSheetRef.current?.present();
  };

  const handleCloseCartSheet = () => setIsCartCloseBtnVisible(false);

  const handleGoToCart = (storeId?: string) => {
    setIsCartCloseBtnVisible(false);
    cartSheetRef.current?.dismiss();
    if (storeId) {
      router.push({ pathname: '/customer/cart', params: { shopId: storeId } });
    } else {
      router.push('/customer/cart');
    }
  };

  const handleCheckoutPress = () => router.push('/customer/cart');

  const handleShopPress = (shopId: string, query: string) => {
    router.push(`/customer/store/${shopId}?q=${encodeURIComponent(query)}`);
  };

  const handleFeaturedShopPress = (shopId: string) => {
    router.push(`/customer/store/${shopId}`);
  };

  const handleSearchResultPress = (shopId: string) => {
    deactivateSearch();
    router.push(`/customer/store/${shopId}?q=${encodeURIComponent(storesStore.filters.searchQuery)}`);
  };

  const handleClearAllCarts = () => {
    const unlockedGroups = cartGroups.filter(
      (g) => !cartStore.shopCarts.get(g.storeId)?.active_bargain_session_id
    );
    if (unlockedGroups.length === 0) return;
    unlockedGroups.forEach((g) => cartStore.clearShopCart(g.storeId));
    if (unlockedGroups.length === cartGroups.length) {
      setIsCartCloseBtnVisible(false);
      cartSheetRef.current?.dismiss();
    }
  };

  const buildFrequentProduct = (item: FrequentItem): Product => ({
    id: item.product_id,
    storeId: item.shop_id,
    storeName: item.shop_name,
    name: item.product_name,
    description: '',
    imageUrl: item.product_image,
    price: parseFloat(item.mrp),
    discountPrice: parseFloat(item.selling_price),
    gstPercent: 0,
    inStock: item.is_in_stock,
    stockCount: item.available_stock,
    category: '',
    isBargainable: false,
    rating: 0,
    variantId: item.variant_id,
    variantName: item.variant_name,
  });

  const handleAddFrequent = (item: FrequentItem) => {
    if (!item.is_in_stock) return;
    const product = buildFrequentProduct(item);
    const existing = cartStore.items.find((i) => i.product.variantId === item.variant_id);
    cartStore.setQuantity(product, (existing?.quantity ?? 0) + 1);
  };

  const handleDecreaseFrequent = (item: FrequentItem) => {
    const existing = cartStore.items.find((i) => i.product.variantId === item.variant_id);
    if (!existing) return;
    cartStore.setQuantity(buildFrequentProduct(item), existing.quantity - 1);
  };

  const getFrequentItemCartQty = (item: FrequentItem): number =>
    cartStore.items.find((i) => i.product.variantId === item.variant_id)?.quantity ?? 0;

  const handleGoToReorder = () => router.push('/(tabs)/reorder');

  const activeAddress = addressStore.addresses.find((a) => a.id === selectedAddressId);

  return (
    <HomeLayoutView
      theme={theme}
      isDark={isDark}
      insets={insets}
      statusBarStyle={statusBarStyle}
      scrollViewRef={scrollViewRef}
      onScroll={handleScroll}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      breathingStyle={breathingStyle}
      cloud1Style={cloud1Style}
      cloud2Style={cloud2Style}
      leaf1Style={leaf1Style}
      leaf2Style={leaf2Style}
      leaf3Style={leaf3Style}
      pinStyle={pinStyle}
      scooterStyle={scooterStyle}
      particle1Style={particle1Style}
      particle2Style={particle2Style}
      particle3Style={particle3Style}
      searchSlideAnimatedStyle={searchSlideAnimatedStyle}
      floatingCartAnimatedStyle={floatingCartAnimatedStyle}
      placeholderOpacity={placeholderOpacity}
      placeholderTranslateY={placeholderTranslateY}
      placeholderIndex={placeholderIndex}
      isSearchActive={isSearchActive}
      isSearchPending={isSearchPending}
      searchQuery={storesStore.filters.searchQuery}
      recentSearches={recentSearches}
      searchResults={storesStore.searchResults}
      isSearchError={storesStore.searchResultsStatus === API_STATUS.ERROR}
      onActivateSearch={activateSearch}
      onDeactivateSearch={deactivateSearch}
      onSearchQueryChange={(txt) => storesStore.setSearchQuery(txt)}
      onRecentSearchPress={(query) => storesStore.setSearchQuery(query)}
      onClearRecentSearches={() => setRecentSearches([])}
      onRemoveRecentSearch={(item) => setRecentSearches((prev) => prev.filter((s) => s !== item))}
      onSearchResultPress={handleSearchResultPress}
      onSearchRetry={(query) => storesStore.searchShops({ q: query })}
      selectedAddressId={selectedAddressId}
      activeAddress={activeAddress}
      usingCurrentLocation={usingCurrentLocation}
      isLocating={isLocating}
      addresses={addressStore.addresses}
      addressSheetRef={addressSheetRef}
      addressSnapPoints={addressSnapPoints}
      renderBackdrop={renderBackdrop}
      onAddressPress={() => addressSheetRef.current?.present()}
      onAddressSelect={handleAddressSelect}
      onUseCurrentLocation={handleUseCurrentLocation}
      onAddNewAddress={handleAddNewAddress}
      categories={storesStore.globalCategories}
      selectedCategory={selectedCategory}
      categoryLoading={categoryLoading}
      globalCategoriesStatus={storesStore.globalCategoriesStatus}
      isCloseBtnVisible={isCloseBtnVisible}
      sheetRef={sheetRef}
      snapPoints={snapPoints}
      onCategorySelect={handleCategorySelect}
      onSeeAllCategories={handleSeeAllCategories}
      onRetryCategories={() => storesStore.fetchGlobalCategories()}
      onCategoriesSheetChange={handleCategoriesSheetChange}
      onCloseCategoriesSheet={handleCloseCategoriesSheet}
      shops={storesStore.shops}
      featuredShops={storesStore.featuredShops}
      shopsStatus={storesStore.shopsStatus}
      onShopPress={handleShopPress}
      onFeaturedShopPress={handleFeaturedShopPress}
      onRetryShops={() => {
        storesStore.fetchFeaturedShops();
        storesStore.fetchShops({ ...locParams });
      }}
      totalItemCount={cartStore.totalItemCount}
      onOpenCartSheet={handleOpenCartSheet}
      onCheckoutPress={handleCheckoutPress}
      cartGroups={cartGroups}
      totalItems={totalItems}
      grandTotal={grandTotal}
      cartSheetRef={cartSheetRef}
      cartSnapPoints={cartSnapPoints}
      isCartCloseBtnVisible={isCartCloseBtnVisible}
      onCloseCartSheet={handleCloseCartSheet}
      onGoToCart={handleGoToCart}
      onClearAllCarts={handleClearAllCarts}
      onDeleteCart={(storeId) => cartStore.clearShopCart(storeId)}
      hasActiveBargainForShop={(storeId) => !!cartStore.shopCarts.get(storeId)?.active_bargain_session_id}
      onGetShopItemCount={(storeId) => cartStore.getShopItemCount(storeId)}
      onGetShopTotal={(storeId) => cartStore.getShopTotals(storeId).grandTotal}
      frequentItems={topFrequentItems}
      onAddFrequent={handleAddFrequent}
      onDecreaseFrequent={handleDecreaseFrequent}
      getFrequentItemCartQty={getFrequentItemCartQty}
      onGoToReorder={handleGoToReorder}
    />
  );
});

export default HomeLayoutContainer;
