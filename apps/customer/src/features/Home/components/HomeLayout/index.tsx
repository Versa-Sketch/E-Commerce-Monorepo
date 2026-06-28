import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { toJS } from 'mobx';
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
  Image,
} from 'react-native';
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
import Svg, { Path } from 'react-native-svg';
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
import CategoriesSection from '../CategoriesSection';
import SearchBar from '../SearchBar';
import SearchOverlay from '../SearchOverlay';
import FloatingCart from '../FloatingCart';
import CartSheet from '../CartSheet';
import ShopsSection from '../ShopsSection';
import AddressSheet from '../AddressSheet';
import CategoriesBottomSheet from '../CategoriesBottomSheet';

// Animated Vector Illustration components
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

  const sheetRef = useRef<BottomSheetModal>(null) as React.RefObject<BottomSheetModal>;
  const cartSheetRef = useRef<BottomSheetModal>(null) as React.RefObject<BottomSheetModal>;
  const addressSheetRef = useRef<BottomSheetModal>(null) as React.RefObject<BottomSheetModal>;

  // Animated values
  const placeholderOpacity = useSharedValue(1);
  const placeholderTranslateY = useSharedValue(0);
  const searchSlideX = useSharedValue(-SCREEN_WIDTH);
  const floatingSearchVisible = useSharedValue(0);
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  // Hero section animation values
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

  // Animated styles
  const breathingStyle = useAnimatedStyle(() => ({
    opacity: breathingOpacity.value,
  }));

  const cloud1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud1X.value }],
  }));

  const cloud2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud2X.value }],
  }));

  const leaf1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: leaf1Y.value },
      { translateX: leaf1X.value },
      { rotate: `${leaf1Rot.value}deg` },
    ],
  }));

  const leaf2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: leaf2Y.value },
      { translateX: leaf2X.value },
      { rotate: `${leaf2Rot.value}deg` },
    ],
  }));

  const leaf3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: leaf3Y.value },
      { translateX: leaf3X.value },
      { rotate: `${leaf3Rot.value}deg` },
    ],
  }));

  const pinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pinY.value }],
  }));

  const scooterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: scooterY.value },
      { rotate: `${scooterRot.value}deg` },
    ],
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

  const floatingCartAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: insets.bottom + 64,
      transform: [
        {
          translateY: withTiming(isTabBarVisible ? 0 : FLOATING_CART_SHIFT_Y, {
            duration: TAB_BAR_ANIMATION_DURATION,
          }),
        },
      ],
    };
  }, [isTabBarVisible, insets.bottom]);

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
    // 1. Shifting colors/gradient breathing
    breathingOpacity.value = withRepeat(
      withTiming(0.65, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // 2. Clouds horizontal moving
    cloud1X.value = withRepeat(
      withTiming(SCREEN_WIDTH + 80, { duration: 25000, easing: Easing.linear }),
      -1,
      false
    );
    cloud2X.value = withRepeat(
      withTiming(-90, { duration: 32000, easing: Easing.linear }),
      -1,
      false
    );

    // 3. Floating leaves
    leaf1Y.value = withRepeat(
      withTiming(16, { duration: 4200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    leaf1X.value = withRepeat(
      withTiming(12, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    leaf1Rot.value = withRepeat(
      withTiming(25, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    leaf2Y.value = withRepeat(
      withTiming(-12, { duration: 4800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    leaf2X.value = withRepeat(
      withTiming(-8, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    leaf2Rot.value = withRepeat(
      withTiming(-20, { duration: 4600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    leaf3Y.value = withRepeat(
      withTiming(18, { duration: 5200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    leaf3X.value = withRepeat(
      withTiming(14, { duration: 4400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    leaf3Rot.value = withRepeat(
      withTiming(30, { duration: 5800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // 4. Pin bounce
    pinY.value = withRepeat(
      withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // 5. Scooter idle
    scooterY.value = withRepeat(
      withTiming(-4, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    scooterRot.value = withRepeat(
      withTiming(1.5, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // 6. Particles rising
    particle1Y.value = withRepeat(
      withTiming(40, { duration: 7500, easing: Easing.linear }),
      -1,
      false
    );
    particle1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 3750 }),
        withTiming(0, { duration: 3750 })
      ),
      -1,
      false
    );

    particle2Y.value = withRepeat(
      withTiming(50, { duration: 9000, easing: Easing.linear }),
      -1,
      false
    );
    particle2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 4500 }),
        withTiming(0, { duration: 4500 })
      ),
      -1,
      false
    );

    particle3Y.value = withRepeat(
      withTiming(30, { duration: 6500, easing: Easing.linear }),
      -1,
      false
    );
    particle3Opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 3250 }),
        withTiming(0, { duration: 3250 })
      ),
      -1,
      false
    );
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
        {/* Hero Section Container */}
        <View style={{ height: 280 + insets.top, overflow: 'visible', position: 'relative' }}>
          {/* Base Premium Illustration Background */}
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

          {/* Shifting Gradient Breathing Effect */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
              breathingStyle,
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['rgba(22,163,74,0.3)', 'rgba(34,197,94,0.15)', 'rgba(255,255,255,0)']}
              style={{ flex: 1 }}
            />
          </Animated.View>

          {/* Animated Clouds */}
          <AnimatedCloud style={[cloud1Style, { top: insets.top + 10, left: 0 }]} opacity={0.35} />
          <AnimatedCloud style={[cloud2Style, { top: insets.top + 30, right: 0 }]} opacity={0.25} />

          {/* Floating Leaves */}
          <AnimatedLeaf style={[leaf1Style, { top: insets.top + 50, left: 30 }]} color="#22C55E" size={16} />
          <AnimatedLeaf style={[leaf2Style, { top: insets.top + 90, right: 40 }]} color="#16A34A" size={20} />
          <AnimatedLeaf style={[leaf3Style, { top: insets.top + 140, left: 80 }]} color="#DCFCE7" size={14} />

          {/* Soft Glowing Particles */}
          <Animated.View style={[{ position: 'absolute', left: 60, width: 6, height: 6, borderRadius: 3, backgroundColor: '#DCFCE7' }, particle1Style]} />
          <Animated.View style={[{ position: 'absolute', right: 80, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BBF7D0' }, particle2Style]} />
          <Animated.View style={[{ position: 'absolute', left: SCREEN_WIDTH * 0.45, width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFFFFF' }, particle3Style]} />

          {/* Scooter Idle Animation */}
          <AnimatedScooter style={[scooterStyle, { bottom: 54, left: 30 }]} />

          {/* Location Pin Bounce */}
          <AnimatedLocationPin style={[pinStyle, { bottom: 100, right: 80 }]} />

          {/* Header Content */}
          <HomeHeader
            selectedAddressId={selectedAddressId}
            activeAddress={activeAddress}
            usingCurrentLocation={usingCurrentLocation}
            onAddressPress={() => addressSheetRef.current?.present()}
          />

          {/* Search Bar - overlaps the bottom portion of the hero section */}
          <View
            style={{
              position: 'absolute',
              bottom: -15,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <SearchBar
              placeholderIndex={placeholderIndex}
              placeholderOpacity={placeholderOpacity}
              placeholderTranslateY={placeholderTranslateY}
              onPress={activateSearch}
            />
          </View>
        </View>

        {/* White Content Section - Sliding effect */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            paddingTop: 24, // space for overlapping search bar, reduces gap to categories
            minHeight: SCREEN_HEIGHT - (280 + insets.top),
          }}
        >
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
        </View>
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
        cartGroups={toJS(cartStore.groupedByStore)}
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
        onDeleteCart={(storeId) => cartStore.clearShopCart(storeId)}
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
