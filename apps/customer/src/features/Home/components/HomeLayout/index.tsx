import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useCartStore } from '../../../../features/Cart/Providers/useCartStore';
import { useAddressStore } from '../../../../features/Addresses/Providers/useAddressStore';
import { useStoresStore } from '../../../../features/Stores/Providers/useStoresStore';
import { locationStore } from '../../../../stores/LocationStore';
import { API_STATUS } from '../../../../Common/Constants';
import { MOCK_PRODUCTS } from '../../../../constants';
import {
  SEARCH_PLACEHOLDERS,
  PLACEHOLDER_ROTATE_INTERVAL,
  BANNER_AUTOPLAY_INTERVAL,
  FLOATING_SEARCH_SCROLL_THRESHOLD,
  FLOATING_CART_SHIFT_Y,
  TAB_BAR_ANIMATION_DURATION,
  SCREEN_DIMENSIONS,
} from '../../Constants';
import { StaggeredItem, StaggeredSearchResult } from '../../utils/animations';

// Import all components
import HomeHeader from '../HomeHeader';
import BannerCarousel from '../BannerCarousel';
import CategoriesSection from '../CategoriesSection';
import SearchBar from '../SearchBar';
import SearchOverlay from '../SearchOverlay';
import FloatingCart from '../FloatingCart';
import CartSheet from '../CartSheet';
import ShopsSection from '../ShopsSection';
import AddressSheet from '../AddressSheet';
import CategoriesBottomSheet from '../CategoriesBottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = SCREEN_DIMENSIONS;

export const HomeLayout = observer(function HomeLayout() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const authStore = useAuthStore();
  const storesStore = useStoresStore();
  const cartStore = useCartStore();
  const addressStore = useAddressStore();

  // State
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

  // Refs
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

  const sheetRef = useRef<BottomSheetModal>(null);
  const cartSheetRef = useRef<BottomSheetModal>(null);
  const addressSheetRef = useRef<BottomSheetModal>(null);

  // Animated values
  const placeholderOpacity = useSharedValue(1);
  const placeholderTranslateY = useSharedValue(0);
  const searchSlideX = useSharedValue(-SCREEN_WIDTH);
  const floatingSearchVisible = useSharedValue(0);
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  const isTabBarVisible = storesStore.isTabBarVisible;

  // Animated styles
  const floatingCartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isTabBarVisible ? 0 : FLOATING_CART_SHIFT_Y, {
            duration: TAB_BAR_ANIMATION_DURATION,
          }),
        },
      ],
    };
  }, [isTabBarVisible]);

  const searchSlideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchSlideX.value }],
  }));

  const floatingSearchAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: floatingSearchVisible.value,
      transform: [
        {
          translateY: (1 - floatingSearchVisible.value) * -60,
        },
      ],
    };
  });

  const floatingSearchSpacerStyle = useAnimatedStyle(() => {
    return {
      height: floatingSearchVisible.value * 64,
      opacity: floatingSearchVisible.value,
      overflow: 'hidden',
    };
  });

  // Snapshot values
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

  // Slide-in animation triggers once the overlay is mounted
  useEffect(() => {
    if (isSearchActive) {
      searchSlideX.value = SCREEN_WIDTH;
      searchSlideX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isSearchActive]);

  // Intercept Android back button while search overlay is open
  useEffect(() => {
    if (!isSearchActive) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      deactivateSearch();
      return true;
    });
    return () => sub.remove();
  }, [isSearchActive]);

  // Handlers
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
        if (storesStore.isTabBarVisible) {
          storesStore.setTabBarVisible(false);
        }
      } else if (diff < 0) {
        if (!storesStore.isTabBarVisible) {
          storesStore.setTabBarVisible(true);
        }
      }

      const floatingSearchThreshold =
        gradientHeaderHeight.current > 0
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
      if (nextBarStyle !== statusBarStyle) {
        setStatusBarStyle(nextBarStyle);
      }

      lastScrollY.current = currentY;
    }

    if (currentY <= 0 && !storesStore.isTabBarVisible) {
      storesStore.setTabBarVisible(true);
    }
  };

  const locParams = locationStore.location
    ? { lat: locationStore.location.latitude, lng: locationStore.location.longitude }
    : {};

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      const targetId = 'all';
      if (!loadedCategories.current.has(targetId)) setCategoryLoading(true);
      setSelectedCategoryState(targetId);
      storesStore.fetchShops({ ...locParams });
    } else {
      if (!loadedCategories.current.has(categoryId)) setCategoryLoading(true);
      setSelectedCategoryState(categoryId);
      const isParent = storesStore.globalCategories.some(
        (cat) => cat.id === categoryId,
      );
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

  // Effects
  useEffect(() => {
    storesStore.setTabBarVisible(true);
    storesStore.fetchGlobalCategories();
    storesStore.fetchFeaturedShops();
    storesStore.fetchShops({ ...locParams });
    cartStore.hydrateAllCarts();
    addressStore.fetchAddresses();
    return () => {
      storesStore.setTabBarVisible(true);
    };
  }, []);

  useEffect(() => {
    if (
      selectedAddressId &&
      addressStore.addresses.some((a) => a.id === selectedAddressId)
    )
      return;
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
      storesStore
        .searchShops({ q: query })
        .finally(() => setIsSearchPending(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [storesStore.filters.searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isBannerDragging.current) return;
      const nextIndex = (activeBannerIndex + 1) % 3;
      bannerScrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setActiveBannerIndex(nextIndex);
    }, BANNER_AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [activeBannerIndex]);

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
    if (
      categoryLoading &&
      (storesStore.shopsStatus === API_STATUS.SUCCESS ||
        storesStore.shopsStatus === API_STATUS.ERROR)
    ) {
      setCategoryLoading(false);
      loadedCategories.current.add(selectedCategory);
    }
  }, [storesStore.shopsStatus, categoryLoading, selectedCategory]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const activeAddress = addressStore.addresses.find((a) => a.id === selectedAddressId);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={statusBarStyle} />
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Top section: gradient spans header + search bar + banner */}
        <View style={{ backgroundColor: 'transparent' }}>
          <LinearGradient
            colors={['#16A34A', '#16A34A', '#4ADE80', '#BBF7D0', 'rgba(187,247,208,0)']}
            locations={[0, 0.18, 0.48, 0.72, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <HomeHeader
            selectedAddressId={selectedAddressId}
            activeAddress={activeAddress}
            usingCurrentLocation={usingCurrentLocation}
            onAddressPress={() => addressSheetRef.current?.present()}
          />

          {/* Search Bar - overlaps the gradient fade */}
          <View style={{ marginTop: -24 }}>
            <SearchBar
              placeholderIndex={placeholderIndex}
              placeholderOpacity={placeholderOpacity}
              placeholderTranslateY={placeholderTranslateY}
              onPress={activateSearch}
            />
          </View>

          {/* Banner Carousel */}
          <BannerCarousel
            activeBannerIndex={activeBannerIndex}
            onBannerIndexChange={setActiveBannerIndex}
            isBannerDragging={isBannerDragging}
          />
        </View>

        {/* Categories Section */}
        <View>
          <CategoriesSection
            categories={storesStore.globalCategories}
            selectedCategory={selectedCategory}
            categoryLoading={categoryLoading}
            isLoading={
              storesStore.globalCategoriesStatus === API_STATUS.FETCHING &&
              storesStore.globalCategories.length === 0
            }
            isError={
              storesStore.globalCategoriesStatus === API_STATUS.ERROR &&
              storesStore.globalCategories.length === 0
            }
            onCategorySelect={handleCategorySelect}
            onSeeAllPress={() => {
              setIsCloseBtnVisible(true);
              sheetRef.current?.present();
            }}
            onRetry={() => storesStore.fetchGlobalCategories()}
          />
        </View>

        {/* Shops Section */}
        <ShopsSection
          shops={storesStore.shops}
          featuredShops={storesStore.featuredShops}
          searchQuery={storesStore.filters.searchQuery}
          isLoading={categoryLoading || (storesStore.shopsStatus === API_STATUS.FETCHING && storesStore.shops.length === 0)}
          isError={storesStore.shopsStatus === API_STATUS.ERROR && storesStore.shops.length === 0}
          onShopPress={(shopId, query) => {
            router.push(
              `/customer/store/${shopId}?q=${encodeURIComponent(query)}`,
            );
          }}
          onFeaturedShopPress={(shopId) => {
            router.push(`/customer/store/${shopId}`);
          }}
          onRetry={() => {
            storesStore.fetchFeaturedShops();
            storesStore.fetchShops({ ...locParams });
          }}
        />
      </ScrollView>

      {/* Search Overlay — slides in from the left */}
      {isSearchActive && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
            },
            searchSlideAnimatedStyle,
          ]}
        >
          <SearchOverlay
            isSearchActive={isSearchActive}
            query={storesStore.filters.searchQuery}
            recentSearches={recentSearches}
            searchResults={storesStore.searchResults}
            isSearchPending={isSearchPending}
            isSearchError={storesStore.searchResultsStatus === API_STATUS.ERROR}
            onRecentSearchPress={(query) => storesStore.setSearchQuery(query)}
            onTrendingSearchPress={(query) => storesStore.setSearchQuery(query)}
            onResultPress={(shopId) => {
              deactivateSearch();
              router.push(`/customer/store/${shopId}?q=${encodeURIComponent(storesStore.filters.searchQuery)}`);
            }}
            onClearRecent={() => setRecentSearches([])}
            onRemoveRecent={(item) => setRecentSearches((prev) => prev.filter((s) => s !== item))}
            onChangeText={(txt) => storesStore.setSearchQuery(txt)}
            onRetry={(query) => storesStore.searchShops({ q: query })}
            onClose={deactivateSearch}
          />
        </Animated.View>
      )}

      {/* Floating Cart */}
      {cartStore.totalItemCount > 0 && (
        <FloatingCart
          totalItemCount={cartStore.totalItemCount}
          onViewCartsPress={() => {
            setIsCartCloseBtnVisible(true);
            cartSheetRef.current?.present();
          }}
          onCheckoutPress={() => router.push('/customer/cart')}
          floatingCartAnimatedStyle={floatingCartAnimatedStyle}
        />
      )}

      {/* Bottom Sheets */}
      <CategoriesBottomSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        categories={storesStore.globalCategories.slice(10)}
        selectedCategory={selectedCategory}
        isCloseBtnVisible={isCloseBtnVisible}
        onCategorySelect={handleCategorySelect}
        onClose={() => setIsCloseBtnVisible(false)}
        renderBackdrop={renderBackdrop}
        onSheetChange={(index) => {
          if (index === -1) {
            setIsCloseBtnVisible(false);
          } else {
            setIsCloseBtnVisible(true);
          }
        }}
      />

      <CartSheet
        cartSheetRef={cartSheetRef}
        isCartCloseBtnVisible={isCartCloseBtnVisible}
        cartSnapPoints={cartSnapPoints}
        cartGroups={cartStore.groupedByStore}
        totalItems={cartStore.totalItemCount}
        grandTotal={cartStore.totalItemCount > 0
          ? cartStore.groupedByStore.reduce(
              (sum, g) => sum + cartStore.getShopTotals(g.storeId).grandTotal,
              0,
            )
          : 0}
        onClose={() => setIsCartCloseBtnVisible(false)}
        onGoToCart={(storeId) => {
          setIsCartCloseBtnVisible(false);
          cartSheetRef.current?.dismiss();
          if (storeId) {
            router.push({ pathname: '/customer/cart', params: { shopId: storeId } });
          } else {
            router.push('/customer/cart');
          }
        }}
        onClearAll={() => {
          cartStore.clearAllCarts();
          setIsCartCloseBtnVisible(false);
          cartSheetRef.current?.dismiss();
        }}
        onGetShopItemCount={(storeId) => cartStore.getShopItemCount(storeId)}
        onGetShopTotal={(storeId) => cartStore.getShopTotals(storeId).grandTotal}
      />

      <AddressSheet
        addressSheetRef={addressSheetRef}
        snapPoints={addressSnapPoints}
        addresses={addressStore.addresses}
        selectedAddressId={selectedAddressId}
        isLocating={isLocating}
        onAddressSelect={handleAddressSelect}
        onUseCurrentLocation={handleUseCurrentLocation}
        onAddNewAddress={handleAddNewAddress}
        renderBackdrop={renderBackdrop}
      />
    </View>
  );
});

export default HomeLayout;
