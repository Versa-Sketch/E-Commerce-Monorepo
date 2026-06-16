import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet } from "../../Common/components/ui/BottomSheet";
import { Chip } from "../../Common/components/ui/Chip";
import { Skeleton } from "../../Common/components/ui/Skeleton";
import { API_STATUS } from "../../Common/Constants";
import { MOCK_PRODUCTS } from "../../constants";
import { useAuthStore } from "../../features/Auth/Providers/useAuthStore";
import { useCartStore } from "../../features/Cart/Providers/useCartStore";
import { useProfileStore } from "../../features/Profile/Providers/useProfileStore";
import { FeaturedShopCard } from "../../features/Stores/components/FeaturedShopCard";
import { FeaturedShopCardSkeleton } from "../../features/Stores/components/FeaturedShopCard/Skeleton";
import { ShopCard } from "../../features/Stores/components/ShopCard";
import { ShopCardSkeleton } from "../../features/Stores/components/ShopCard/Skeleton";
import { useStoresStore } from "../../features/Stores/Providers/useStoresStore";
import { Colors } from "../../theme/colors";
import { useTheme } from "../../theme/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CART_DELETE_ACTION_WIDTH = 110;
const SEARCH_OVERLAY_TOP_OFFSET = 76;
const BANNER_AUTOPLAY_INTERVAL = 4000;
const FLOATING_SEARCH_SCROLL_THRESHOLD = 160;

const SEARCH_PLACEHOLDERS = [
  "Search for 'Milk'",
  "Search for 'Bread'",
  "Search for 'Vegetables'",
  "Search for 'Medicines'",
  "Search for 'Snacks'",
];
const PLACEHOLDER_ROTATE_INTERVAL = 3000;

const HOME_BANNERS = [
  "https://img.magnific.com/free-psd/food-menu-restaurant-facebook-cover-banner-template_120329-4875.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.magnific.com/premium-vector/food-restaurant-menu-social-media-marketing-web-banner-template-design_673898-382.jpg?semt=ais_hybrid&w=740&q=80",
  "https://static.vecteezy.com/system/resources/thumbnails/040/537/735/small/fast-food-or-restaurant-business-promotion-social-media-marketing-web-banner-template-with-logo-and-icon-pizza-burger-or-healthy-food-business-promotional-flyer-design-layout-vector.jpg",
];

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface StaggeredItemProps {
  index: number;
  children: React.ReactNode;
}

const StaggeredItem = ({ index, children }: StaggeredItemProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(
      index * 40,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      index * 40,
      withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const StaggeredSearchResult = ({ index, children }: StaggeredItemProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(
      index * 40,
      withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      index * 40,
      withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// Animation speed / duration (in ms) for hiding/showing the tab bar and shifting the floating cart
const TAB_BAR_ANIMATION_DURATION = 350;

// The amount the floating cart translates down when the bottom tab bar hides (in pixels)
// Set to 0 to keep the cart completely static, or e.g. 60 to shift it down to the bottom
const FLOATING_CART_SHIFT_Y = 60;

export default observer(function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const storesStore = useStoresStore();
  const cartStore = useCartStore();
  const insets = useSafeAreaInsets();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Organic Tomatoes",
    "Cotton Tee",
    "Crocin",
  ]);
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholderOpacity = useSharedValue(1);
  const placeholderTranslateY = useSharedValue(0);
  const searchProgress = useSharedValue(0);
  const floatingSearchVisible = useSharedValue(0);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);
  const lastScrollY = useRef(0);
  const gradientHeaderHeight = useRef(0);

  const isTabBarVisible = storesStore.isTabBarVisible;

  const floatingCartAnimatedStyle = useAnimatedStyle(() => {
    const translateY = withTiming(isTabBarVisible ? 0 : FLOATING_CART_SHIFT_Y, {
      duration: TAB_BAR_ANIMATION_DURATION,
    });
    return {
      transform: [{ translateY }],
    };
  }, [isTabBarVisible]);

  const activateSearch = () => {
    setIsSearchActive(true);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setShowFloatingSearch(false);
    floatingSearchVisible.value = withTiming(0, { duration: 150 });
    searchProgress.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    // autofocus the text input after a short delay to let the animation start
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const deactivateSearch = () => {
    searchInputRef.current?.blur();
    storesStore.setSearchQuery("");
    searchProgress.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
    setIsSearchActive(false);
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

      let nextShowFloatingSearch = showFloatingSearch;
      if (currentY <= floatingSearchThreshold) {
        nextShowFloatingSearch = false;
      } else if (diff > 0) {
        nextShowFloatingSearch = false;
      } else if (diff < 0) {
        nextShowFloatingSearch = true;
      }
      if (nextShowFloatingSearch !== showFloatingSearch) {
        setShowFloatingSearch(nextShowFloatingSearch);
        floatingSearchVisible.value = withTiming(nextShowFloatingSearch ? 1 : 0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }

      lastScrollY.current = currentY;
    }

    if (currentY <= 0) {
      if (!storesStore.isTabBarVisible) {
        storesStore.setTabBarVisible(true);
      }
      if (showFloatingSearch) {
        setShowFloatingSearch(false);
        floatingSearchVisible.value = withTiming(0, { duration: 200 });
      }
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSearchActive ? 0 : 1, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(isSearchActive ? -12 : 0, { duration: 200 }),
        },
      ],
    };
  });

  const categoriesAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSearchActive ? 0 : 1, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(isSearchActive ? 20 : 0, { duration: 200 }),
        },
      ],
    };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isSearchActive ? -72 : 0, {
            duration: 280,
            easing: Easing.out(Easing.cubic),
          }),
        },
      ],
    };
  });

  const searchBarOuterAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingHorizontal: withTiming(isSearchActive ? 10 : 20, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  const searchBarInnerAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        isSearchActive
          ? (isDark ? "#4B5563" : "#9CA3AF")
          : (isDark ? "rgba(75, 85, 99, 0.4)" : "#F3F4F6"),
        { duration: 280 }
      ),
      shadowOpacity: withTiming(isSearchActive ? 0.12 : 0.05, { duration: 280 }),
      shadowRadius: withTiming(isSearchActive ? 16 : 12, { duration: 280 }),
    };
  });

  const cardsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSearchActive ? 0.4 : 1, { duration: 250 }),
      transform: [
        {
          scale: withTiming(isSearchActive ? 0.98 : 1, { duration: 250 }),
        },
      ],
    };
  });

  const dimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSearchActive ? 1 : 0, { duration: 250 }),
    };
  });

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
      height: floatingSearchVisible.value * 60,
    };
  });

  const placeholderAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: placeholderOpacity.value,
      transform: [{ translateY: placeholderTranslateY.value }],
    };
  });

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  const cartSheetRef = useRef<BottomSheetModal>(null);
  const cartSnapPoints = useMemo(() => {
    const groupCount = Math.max(cartStore.groupedByStore.length, 1);
    const overhead = 155 + insets.bottom;
    const rowHeight = 82;
    const contentHeight = overhead + groupCount * rowHeight;
    const minHeight = SCREEN_HEIGHT * 0.32;
    const maxHeight = SCREEN_HEIGHT * 0.75;
    return [Math.min(Math.max(contentHeight, minHeight), maxHeight)];
  }, [cartStore.groupedByStore.length, insets.bottom]);
  const [isCartCloseBtnVisible, setIsCartCloseBtnVisible] = useState(false);
  const cartSwipeableRefs = useRef<Map<string, Swipeable | null>>(new Map());
  const cartProgrammaticOpen = useRef<Set<string>>(new Set());

  const addressSheetRef = useRef<BottomSheetModal>(null);
  const addressSnapPoints = useMemo(() => ["62%"], []);
  const [refreshing, setRefreshing] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const isBannerDragging = useRef(false);
  const [selectedCategory, setSelectedCategoryState] = useState<string>("all");
  const [isCloseBtnVisible, setIsCloseBtnVisible] = useState(false);

  const categoryLayouts = useRef<Record<string, { x: number; width: number }>>(
    {},
  );
  const hasInitializedUnderline = useRef(false);
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);
  const underlineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
    width: underlineWidth.value,
  }));

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategoryState("all");
      storesStore.fetchShops();
    } else {
      setSelectedCategoryState(categoryId);
      const isParent = storesStore.globalCategories.some(
        (cat) => cat.id === categoryId,
      );
      if (isParent) {
        storesStore.fetchShops({ category_id: categoryId });
      } else {
        storesStore.fetchShops({ subcategory_id: categoryId });
      }
    }
  };

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

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setIsCloseBtnVisible(false);
    } else {
      setIsCloseBtnVisible(true);
    }
  }, []);

  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex === -1) {
        setIsCloseBtnVisible(false);
      } else if (toIndex === 0) {
        setIsCloseBtnVisible(true);
      }
    },
    [],
  );

  useEffect(() => {
    storesStore.setTabBarVisible(true);
    storesStore.fetchGlobalCategories();
    storesStore.fetchFeaturedShops();
    storesStore.fetchShops();
    cartStore.hydrateAllCarts();
    return () => {
      storesStore.setTabBarVisible(true);
    };
  }, []);

  // Debounced product/shop search
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

  // Auto-advance the home banner carousel
  useEffect(() => {
    const timer = setInterval(() => {
      if (isBannerDragging.current) return;
      const nextIndex = (activeBannerIndex + 1) % HOME_BANNERS.length;
      bannerScrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
      setActiveBannerIndex(nextIndex);
    }, BANNER_AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [activeBannerIndex]);

  // Rotate the search bar placeholder text every few seconds
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

  // Default-select the first category once categories load
  useEffect(() => {
    if (selectedCategory === "all" && storesStore.globalCategories.length > 0) {
      setSelectedCategoryState(storesStore.globalCategories[0].id);
    }
  }, [storesStore.globalCategories.length]);

  // Animate the underline to follow the selected category
  useEffect(() => {
    const layout = categoryLayouts.current[selectedCategory];
    if (!layout) return;
    if (hasInitializedUnderline.current) {
      underlineX.value = withTiming(layout.x, { duration: 250 });
      underlineWidth.value = withTiming(layout.width, { duration: 250 });
    } else {
      underlineX.value = layout.x;
      underlineWidth.value = layout.width;
      hasInitializedUnderline.current = true;
    }
  }, [selectedCategory]);

  const activeAddress = profileStore.selectedAddress;
  const addresses = profileStore.addresses;
  const filters = storesStore.filters;
  const discountProducts = MOCK_PRODUCTS.filter(
    (p) => p.discountPrice !== undefined,
  );

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      storesStore.fetchGlobalCategories(),
      storesStore.fetchFeaturedShops(),
      storesStore.fetchShops(),
    ]).finally(() => setRefreshing(false));
  };

  const handleAddressSelect = (addr: any) => {
    profileStore.setSelectedAddress(addr);
    addressSheetRef.current?.dismiss();
  };

  // Render helpers
  const renderTopHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <Text
          style={[
            theme.textPresets.caption,
            {
              color: "rgba(255, 255, 255, 0.85)",
              fontFamily: theme.typography.fonts.medium,
              fontSize: 11,
              marginBottom: 1,
            },
          ]}
        >
          Good Morning 👋
        </Text>
        <Pressable
          onPress={() => addressSheetRef.current?.present()}
          style={styles.locationContainer}
        >
          <Ionicons
            name="location-sharp"
            size={14}
            color="#FFFFFF"
            style={{ marginRight: 4, marginTop: -1 }}
          />
          <Text
            style={[
              theme.textPresets.bodyLarge,
              {
                color: "#FFFFFF",
                fontFamily: theme.typography.fonts.bold,
                fontSize: 15,
              },
            ]}
          >
            {activeAddress
              ? `${activeAddress.streetAddress}, ${activeAddress.city}`
              : "Indiranagar, Bengaluru"}
          </Text>
        </Pressable>
        <Text
          style={[
            theme.textPresets.caption,
            {
              color: "rgba(255, 255, 255, 0.9)",
              fontFamily: theme.typography.fonts.bold,
              fontSize: 10,
              marginTop: 1,
            },
          ]}
        >
          Delivering in 15-20 mins
        </Text>
      </View>
      <View style={styles.headerRightActions}>
        <Pressable
          onPress={() => router.push("/profile")}
          style={styles.headerActionBtn}
        >
          <Ionicons
            name="person-circle-outline"
            size={34}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );

  const renderBanners = () => (
    <View style={styles.bannerSection}>
      <ScrollView
        ref={bannerScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScrollBeginDrag={() => {
          isBannerDragging.current = true;
        }}
        onMomentumScrollEnd={(e) => {
          isBannerDragging.current = false;
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveBannerIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {HOME_BANNERS.map((uri, index) => (
          <View key={index} style={styles.bannerSlide}>
            <Image source={{ uri }} style={styles.bannerImage} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>
      <View style={styles.bannerDotsRow}>
        {HOME_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.bannerDot,
              {
                backgroundColor:
                  index === activeBannerIndex ? "#16A34A" : isDark ? "rgba(255,255,255,0.25)" : "#E5E7EB",
                width: index === activeBannerIndex ? 18 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderCategoryList = () => {
    const apiCategories = storesStore.globalCategories || [];
    const isLoading =
      storesStore.globalCategoriesStatus === API_STATUS.FETCHING &&
      apiCategories.length === 0;
    const isError =
      storesStore.globalCategoriesStatus === API_STATUS.ERROR &&
      apiCategories.length === 0;

    if (isLoading) {
      return (
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.categoryItem}>
                <Skeleton
                  width={46}
                  height={46}
                  variant="circle"
                  style={{ marginBottom: 4 }}
                />
                <Skeleton width={40} height={9} />
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={[
            styles.categoriesSection,
            {
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.medium,
              fontSize: 13,
            }}
          >
            Couldn't load categories
          </Text>
          <Pressable onPress={() => storesStore.fetchGlobalCategories()}>
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fonts.semiBold,
                fontSize: 13,
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      );
    }

    // Show only first 5 categories in the horizontal scroll list
    const visibleCategories = apiCategories.slice(0, 5);

    return (
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {visibleCategories.map((item) => {
            const isSelected = selectedCategory === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleCategorySelect(item.id)}
                style={styles.categoryItem}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  categoryLayouts.current[item.id] = { x, width };
                  if (isSelected && !hasInitializedUnderline.current) {
                    underlineX.value = x;
                    underlineWidth.value = width;
                    hasInitializedUnderline.current = true;
                  }
                }}
              >
                <View style={styles.categoryImageContainer}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.categoryImage}
                    />
                  ) : (
                    <View style={styles.fallbackIconContainer}>
                      <Ionicons
                        name="grid-outline"
                        size={18}
                        color={theme.colors.textSecondary}
                      />
                    </View>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected ? "#16A34A" : theme.colors.textPrimary,
                      fontFamily: isSelected
                        ? theme.typography.fonts.bold
                        : theme.typography.fonts.medium,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}

          {/* See all button */}
          <Pressable
            onPress={() => {
              setIsCloseBtnVisible(true);
              sheetRef.current?.present();
            }}
            style={styles.categoryItem}
          >
            <View style={styles.seeAllCircle}>
              <Ionicons name="restaurant" size={18} color="#E11D48" />
            </View>
            <View style={styles.seeAllLabelRow}>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                  },
                ]}
              >
                See all
              </Text>
              <Ionicons
                name="caret-down"
                size={9}
                color="#E11D48"
                style={{ marginLeft: 2, marginTop: 1 }}
              />
            </View>
          </Pressable>

          <Animated.View
            style={[styles.categoryUnderline, underlineAnimatedStyle]}
          />
        </ScrollView>
      </View>
    );
  };

  const renderCuisinesBottomSheet = () => {
    const cardWidth = (SCREEN_WIDTH - 40) / 4;

    // Extract remaining categories that are not shown in the scroll list
    const apiCategories = storesStore.globalCategories || [];
    const remainingCategories = apiCategories.slice(5);

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onChange={handleSheetChange}
        onAnimate={handleSheetAnimate}
        enableContentPanningGesture={false}
        enableOverDrag={false}
        backgroundStyle={{
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleComponent={() => (
          <View style={styles.customHandleContainer}>
            {isCloseBtnVisible && (
              <Pressable
                onPress={() => {
                  setIsCloseBtnVisible(false);
                  sheetRef.current?.dismiss();
                }}
                style={styles.floatingCloseBtn}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            )}
            <View style={styles.grabHandle} />
          </View>
        )}
      >
        <View style={styles.sheetHeaderWrapper}>
          <Text
            style={[
              styles.sheetTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            More Categories
          </Text>
        </View>

        <BottomSheetScrollView
          style={styles.bottomSheetScrollView}
          contentContainerStyle={[
            styles.bottomSheetScrollContent,
            { paddingBottom: 40 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bottomSheetGrid}>
            {remainingCategories.map((item) => {
              const isSelected = selectedCategory === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    handleCategorySelect(item.id);
                    setIsCloseBtnVisible(false);
                    sheetRef.current?.dismiss();
                  }}
                  style={{
                    width: cardWidth,
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={[
                      styles.bottomSheetImageContainer,
                      isSelected && styles.categoryImageSelected,
                    ]}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.bottomSheetImage}
                      />
                    ) : (
                      <View style={styles.fallbackIconContainer}>
                        <Ionicons
                          name="grid-outline"
                          size={24}
                          color={
                            isSelected ? "#E11D48" : theme.colors.textSecondary
                          }
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.bottomSheetText,
                      {
                        color: isSelected
                          ? "#E11D48"
                          : theme.colors.textPrimary,
                        fontFamily: isSelected
                          ? theme.typography.fonts.bold
                          : theme.typography.fonts.medium,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  };

  const renderCartBottomSheet = () => {
    const groups = cartStore.groupedByStore || [];

    const goToCart = (storeId?: string) => {
      setIsCartCloseBtnVisible(false);
      cartSheetRef.current?.dismiss();
      if (storeId) {
        router.push({ pathname: "/customer/cart", params: { shopId: storeId } });
      } else {
        router.push("/customer/cart");
      }
    };

    const handleClearAll = () => {
      cartStore.clearAllCarts();
      setIsCartCloseBtnVisible(false);
      cartSheetRef.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={cartSheetRef}
        index={0}
        snapPoints={cartSnapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onChange={(index) => {
          if (index === -1) {
            setIsCartCloseBtnVisible(false);
          } else {
            setIsCartCloseBtnVisible(true);
          }
        }}
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex === -1) {
            setIsCartCloseBtnVisible(false);
          } else if (toIndex === 0) {
            setIsCartCloseBtnVisible(true);
          }
        }}
        enableContentPanningGesture
        enableOverDrag={false}
        backgroundStyle={{
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleComponent={() => (
          <View style={styles.customHandleContainer}>
            {isCartCloseBtnVisible && (
              <Pressable
                onPress={() => {
                  setIsCartCloseBtnVisible(false);
                  cartSheetRef.current?.dismiss();
                }}
                style={styles.floatingCloseBtn}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            )}
            <View style={styles.grabHandle} />
          </View>
        )}
      >
        <View style={[styles.sheetHeaderWrapper, { borderBottomWidth: 0 }]}>
          <Text
            style={[
              styles.sheetTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Your Carts ({groups.length})
          </Text>
          {groups.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearAllBtn}>
              <Ionicons
                name="trash-outline"
                size={16}
                color={theme.colors.error}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  color: theme.colors.error,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: 13,
                }}
              >
                Clear all
              </Text>
            </Pressable>
          )}
        </View>

        {groups.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <View
              style={[
                styles.emptyCartIconBg,
                {
                  backgroundColor: isDark
                    ? "rgba(239, 68, 68, 0.1)"
                    : "#FFF5F5",
                },
              ]}
            >
              <Ionicons
                name="cart-outline"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            <Text
              style={[
                styles.emptyCartTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                },
              ]}
            >
              Your carts are empty
            </Text>
            <Text
              style={[
                styles.emptyCartSub,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.medium,
                },
              ]}
            >
              Add items from shops near you to start shopping.
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <BottomSheetScrollView
              style={styles.bottomSheetScrollView}
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: 40 + insets.bottom,
              }}
              showsVerticalScrollIndicator={false}
            >
              {groups.map((group) => {
                const itemCount = cartStore.getShopItemCount(group.storeId);
                const total = cartStore.getShopTotals(group.storeId).grandTotal;
                const thumbnailUrl =
                  group.items[0]?.product?.imageUrl ||
                  MOCK_PRODUCTS[0]?.imageUrl;

                return (
                  <Swipeable
                    key={group.storeId}
                    ref={(ref) => {
                      cartSwipeableRefs.current.set(group.storeId, ref);
                    }}
                    containerStyle={styles.cartRowSwipeContainer}
                    overshootRight={false}
                    friction={2.5}
                    rightThreshold={CART_DELETE_ACTION_WIDTH * 0.8}
                    activeOffsetX={[-10, 10]}
                    failOffsetY={[-10, 10]}
                    onSwipeableOpen={(direction) => {
                      if (direction !== "right") return;
                      if (cartProgrammaticOpen.current.has(group.storeId)) {
                        cartProgrammaticOpen.current.delete(group.storeId);
                        return;
                      }
                      cartStore.clearShopCart(group.storeId);
                    }}
                    renderRightActions={(_progress, dragX) => {
                      const scaleX = dragX.interpolate({
                        inputRange: [-CART_DELETE_ACTION_WIDTH, 0],
                        outputRange: [1, 0],
                        extrapolate: "clamp",
                      });
                      const textOpacity = dragX.interpolate({
                        inputRange: [
                          -CART_DELETE_ACTION_WIDTH,
                          -CART_DELETE_ACTION_WIDTH * 0.6,
                          0,
                        ],
                        outputRange: [1, 0, 0],
                        extrapolate: "clamp",
                      });

                      return (
                        <View style={styles.cartRowDeleteAction}>
                          <RNAnimated.View
                            style={[
                              styles.cartRowDeleteBg,
                              {
                                backgroundColor: isDark
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : "rgba(239, 68, 68, 0.05)",
                                transform: [{ scaleX }],
                              },
                            ]}
                          />
                          <Pressable
                            onPress={() =>
                              cartStore.clearShopCart(group.storeId)
                            }
                            style={styles.cartRowDeleteInner}
                          >
                            <RNAnimated.Text
                              style={[
                                styles.cartRowDeleteText,
                                {
                                  color: theme.colors.error,
                                  fontFamily: theme.typography.fonts.bold,
                                  opacity: textOpacity,
                                },
                              ]}
                            >
                              Remove
                            </RNAnimated.Text>
                          </Pressable>
                        </View>
                      );
                    }}
                  >
                    <View
                      style={[
                        styles.cartRow,
                        { backgroundColor: theme.colors.surfaceSecondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.cartThumbnail,
                          { backgroundColor: theme.colors.surface },
                        ]}
                      >
                        <Image
                          source={{ uri: thumbnailUrl }}
                          style={styles.cartThumbnailImage}
                          resizeMode="cover"
                        />
                      </View>

                      <View style={styles.cartRowInfo}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cartCardShopName,
                            {
                              color: theme.colors.textPrimary,
                              fontFamily: theme.typography.fonts.bold,
                            },
                          ]}
                        >
                          {group.storeName}
                        </Text>
                        <Text
                          style={[
                            styles.cartRowPrice,
                            {
                              color: theme.colors.textSecondary,
                              fontFamily: theme.typography.fonts.medium,
                            },
                          ]}
                        >
                          ₹{total.toFixed(0)}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => goToCart(group.storeId)}
                        style={[
                          styles.cartActionPill,
                          {
                            backgroundColor: theme.colors.primary,
                            borderRadius: theme.borderRadius.round,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.cartActionPillTitle,
                            { fontFamily: theme.typography.fonts.bold },
                          ]}
                        >
                          View Cart
                        </Text>
                        <Text
                          style={[
                            styles.cartActionPillSub,
                            { fontFamily: theme.typography.fonts.medium },
                          ]}
                        >
                          {itemCount} item{itemCount === 1 ? "" : "s"}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          cartProgrammaticOpen.current.add(group.storeId);
                          cartSwipeableRefs.current
                            .get(group.storeId)
                            ?.openRight();
                        }}
                        style={[
                          styles.cartRowDeleteToggle,
                          {
                            backgroundColor: isDark
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(239, 68, 68, 0.05)",
                          },
                        ]}
                      >
                        <Ionicons
                          name="close"
                          size={16}
                          color={theme.colors.error}
                        />
                      </Pressable>
                    </View>
                  </Swipeable>
                );
              })}
            </BottomSheetScrollView>

            <View
              style={[
                styles.cartSheetFooter,
                { paddingBottom: insets.bottom + 12 },
              ]}
            >
              <Pressable
                onPress={() => goToCart()}
                style={[
                  styles.checkoutAllBtn,
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.round,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.checkoutAllText,
                    { fontFamily: theme.typography.fonts.bold },
                  ]}
                >
                  Checkout all
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#FFFFFF"
                  style={styles.checkoutAllIcon}
                />
              </Pressable>
            </View>
          </View>
        )}
      </BottomSheetModal>
    );
  };

  const renderSearchResultsSection = () => {
    const query = filters.searchQuery;
    const isInitialLoading =
      storesStore.searchResultsStatus === API_STATUS.FETCHING &&
      storesStore.searchResults.length === 0;
    const isError =
      storesStore.searchResultsStatus === API_STATUS.ERROR &&
      storesStore.searchResults.length === 0;

    if (isInitialLoading) {
      return (
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          {[1, 2, 3].map((i) => (
            <ShopCardSkeleton key={i} style={{ marginBottom: 12 }} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            marginBottom: 32,
            alignItems: "center",
            paddingVertical: 20,
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={28}
            color={theme.colors.textSecondary}
            style={{ marginBottom: 8 }}
          />
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.medium,
              marginBottom: 12,
            }}
          >
            Couldn't load search results
          </Text>
          <Pressable
            onPress={() => storesStore.searchShops({ q: query })}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.surfaceSecondary,
            }}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fonts.semiBold,
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      );
    }

    if (storesStore.searchResults.length === 0) {
      return (
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.medium,
              }}
            >
              No shops found for "{query}"
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
        <Text
          style={[
            theme.textPresets.bodyLarge,
            styles.gridTitle,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
              marginBottom: 16,
            },
          ]}
        >
          Results for "{query}"
        </Text>
        {storesStore.searchResults.map((shop) => {
          const matchedCategories = shop.matched_categories ?? [];
          const matchedSubcategories = shop.matched_subcategories ?? [];
          const hasChips = matchedCategories.length + matchedSubcategories.length > 0;
          return (
            <View key={shop.id} style={{ marginBottom: 16 }}>
              <ShopCard
                shop={shop}
                onPress={() => router.push(`/customer/store/${shop.id}`)}
              />
              {hasChips && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingTop: 8 }}
                >
                  {matchedCategories.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      onPress={() => storesStore.searchShops({ q: query, category_id: c.id })}
                    />
                  ))}
                  {matchedSubcategories.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      onPress={() => storesStore.searchShops({ q: query, subcategory_id: c.id })}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderShopsSection = () => {
    if (filters.searchQuery.trim()) {
      return renderSearchResultsSection();
    }
    const isInitialLoading =
      (storesStore.shopsStatus === API_STATUS.FETCHING && storesStore.shops.length === 0) ||
      (storesStore.featuredShopsStatus === API_STATUS.FETCHING && storesStore.featuredShops.length === 0);
    const isError =
      (storesStore.shopsStatus === API_STATUS.ERROR && storesStore.shops.length === 0) ||
      (storesStore.featuredShopsStatus === API_STATUS.ERROR && storesStore.featuredShops.length === 0);

    if (isInitialLoading) {
      return (
        <View style={{ marginBottom: 32, marginTop: 20 }}>
          <Text
            style={[
              theme.textPresets.bodyLarge,
              styles.gridTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                marginBottom: 12,
                paddingHorizontal: 20,
              },
            ]}
          >
            Featured
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {[1, 2, 3].map((i) => (
              <FeaturedShopCardSkeleton key={i} />
            ))}
          </ScrollView>
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text
              style={[
                theme.textPresets.bodyLarge,
                styles.gridTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  marginBottom: 16,
                },
              ]}
            >
              Shops Near You
            </Text>
            {[1, 2, 3].map((i) => (
              <ShopCardSkeleton key={i} style={{ marginBottom: 12 }} />
            ))}
          </View>
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            marginBottom: 32,
            alignItems: "center",
            paddingVertical: 20,
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={28}
            color={theme.colors.textSecondary}
            style={{ marginBottom: 8 }}
          />
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.medium,
              marginBottom: 12,
            }}
          >
            Couldn't load shops nearby
          </Text>
          <Pressable
            onPress={() => {
              storesStore.fetchFeaturedShops();
              storesStore.fetchShops();
            }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.surfaceSecondary,
            }}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fonts.semiBold,
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      );
    }

    if (storesStore.shops.length === 0) {
      return (
        <View style={{ paddingHorizontal: 20, marginBottom: 32, marginTop: 20 }}>
          <Text
            style={[
              theme.textPresets.bodyLarge,
              styles.gridTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                marginBottom: 16,
              },
            ]}
          >
            Shops Near You
          </Text>
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.medium,
              }}
            >
              No shops found nearby
            </Text>
          </View>
        </View>
      );
    }

    const featuredShops = storesStore.featuredShops;

    return (
      <View style={{ marginBottom: 32, marginTop: 20 }}>
        {featuredShops.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={[styles.sectionHeaderRow, { paddingHorizontal: 20 }]}>
              <View
                style={[
                  styles.sectionIconBadge,
                  { backgroundColor: "rgba(225, 29, 72, 0.1)" },
                ]}
              >
                <Ionicons name="flame" size={16} color="#E11D48" />
              </View>
              <Text
                style={[
                  styles.gridTitle,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                  },
                ]}
              >
                Featured
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
              {featuredShops.map((shop) => (
                <FeaturedShopCard
                  key={shop.id}
                  shop={shop}
                  onPress={() => router.push(`/customer/store/${shop.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
            <View
              style={[
                styles.sectionIconBadge,
                { backgroundColor: "rgba(16, 185, 129, 0.1)" },
              ]}
            >
              <Ionicons name="storefront" size={16} color="#16A34A" />
            </View>
            <Text
              style={[
                styles.gridTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                },
              ]}
            >
              Shops Near You
            </Text>
            <View
              style={[
                styles.sectionCountBadge,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.semiBold,
                }}
              >
                {storesStore.shops.length}
              </Text>
            </View>
          </View>
          {storesStore.shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onPress={() => {
                router.push(`/customer/store/${shop.id}`);
              }}
              style={{ marginBottom: 16 }}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderFloatingCart = () => (
    <Animated.View
      style={[
        styles.floatingCart,
        {
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
        },
        floatingCartAnimatedStyle,
      ]}
    >
      <Pressable
        onPress={() => {
          setIsCartCloseBtnVisible(true);
          cartSheetRef.current?.present();
        }}
        style={styles.cartMainArea}
      >
        <View
          style={[
            styles.cartImageWrapper,
            { backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#F3F4F6" },
          ]}
        >
          <Image
            source={{ uri: MOCK_PRODUCTS[0]?.imageUrl }}
            style={styles.cartImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cartLeft}>
          <Text
            style={[
              styles.viewCartText,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, marginTop: 14 },
            ]}
            numberOfLines={1}
          >
            View all carts
          </Text>
          <Text
            style={[
              styles.cartQtyText,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium },
            ]}
            numberOfLines={1}
          >
            {cartStore.totalItemCount} item
            {cartStore.totalItemCount === 1 ? "" : "s"}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push("/customer/cart")}
        style={styles.cartChevronCircle}
      >
        <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
      </Pressable>
      <View style={styles.viewCartFloatingPillWrapper} pointerEvents="box-none">
        <Pressable
          onPress={() => {
            setIsCartCloseBtnVisible(true);
            cartSheetRef.current?.present();
          }}
          style={[
            styles.viewCartFloatingPill,
            {
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <Ionicons name="cart" size={14} color="#16A34A" style={styles.viewCartFloatingPillIcon} />
          <Text
            style={[styles.viewCartFloatingPillText, { fontFamily: theme.typography.fonts.bold }]}
            numberOfLines={1}
          >
            View Carts
          </Text>
        </Pressable>
        <View style={styles.viewCartFloatingPillBadgeWrapper} pointerEvents="none">
          <View
            style={[
              styles.viewCartFloatingPillBadge,
              {
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Ionicons name="chevron-up" size={13} color="#16A34A" />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderSearchBar = () => (
    <Animated.View style={[styles.searchBarOuterWrapper, searchBarOuterAnimatedStyle, searchBarAnimatedStyle]}>
      <Animated.View
        style={[
          styles.searchBarInnerWrapper,
          { backgroundColor: isDark ? "rgba(31, 41, 55, 0.95)" : "#FFFFFF" },
          searchBarInnerAnimatedStyle,
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color="#16A34A"
          style={{ marginLeft: 12, marginRight: 8 }}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            ref={searchInputRef}
            value={filters.searchQuery}
            onChangeText={(txt) => storesStore.setSearchQuery(txt)}
            onFocus={activateSearch}
            placeholder=""
            placeholderTextColor="#9CA3AF"
            style={[
              styles.searchTextInput,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.medium,
              },
            ]}
          />
          {filters.searchQuery === "" && (
            <Animated.Text
              numberOfLines={1}
              pointerEvents="none"
              style={[
                placeholderAnimatedStyle,
                styles.searchPlaceholderText,
                { color: "#9CA3AF", fontFamily: theme.typography.fonts.medium },
              ]}
            >
              {SEARCH_PLACEHOLDERS[placeholderIndex]}
            </Animated.Text>
          )}
        </View>
        {isSearchActive && (
          <Pressable onPress={deactivateSearch} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  );

  const renderSearchSuggestions = () => {
    const trendingSearches = [
      "Organic Roma Tomatoes",
      "Hass Avocados",
      "Cotton Oversized Tee",
    ];

    return (
      <View style={styles.suggestionsContainer}>
        {recentSearches.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Recent Searches
              </Text>
              <Pressable onPress={() => setRecentSearches([])}>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: 12,
                  }}
                >
                  Clear all
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                paddingHorizontal: 20,
              }}
            >
              {recentSearches.map((item, idx) => (
                <StaggeredItem key={`recent-${item}`} index={idx}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingLeft: 12,
                      paddingRight: 8,
                      borderRadius: theme.borderRadius.round,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surfaceSecondary,
                    }}
                  >
                    <Pressable onPress={() => storesStore.setSearchQuery(item)}>
                      <Text
                        style={{
                          color: theme.colors.textPrimary,
                          fontFamily: theme.typography.fonts.medium,
                          fontSize: 13,
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setRecentSearches((prev) => prev.filter((s) => s !== item))}
                      style={{ marginLeft: 6, padding: 2 }}
                    >
                      <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
                    </Pressable>
                  </View>
                </StaggeredItem>
              ))}
            </View>
          </View>
        )}

        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 12,
            marginHorizontal: 20,
          }}
        />

        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.bold,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 12,
              paddingHorizontal: 20,
            }}
          >
            Trending Searches
          </Text>
          {trendingSearches.map((item, idx) => (
            <StaggeredItem key={`trending-${item}`} index={idx + recentSearches.length}>
              <Pressable
                onPress={() => storesStore.setSearchQuery(item)}
                style={styles.suggestionItemRow}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.colors.surfaceSecondary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="trending-up" size={16} color={theme.colors.success} />
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: 15,
                  }}
                >
                  {item}
                </Text>
                <Ionicons name="open-outline" size={16} color={theme.colors.textMuted} />
              </Pressable>
            </StaggeredItem>
          ))}
        </View>
      </View>
    );
  };

  const renderOverlaySearchResults = () => {
    const query = filters.searchQuery;
    const isInitialLoading =
      (isSearchPending || storesStore.searchResultsStatus === API_STATUS.FETCHING) &&
      storesStore.searchResults.length === 0;
    const isError =
      !isSearchPending &&
      storesStore.searchResultsStatus === API_STATUS.ERROR &&
      storesStore.searchResults.length === 0;

    if (isInitialLoading) {
      return (
        <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Ionicons
              name="search"
              size={24}
              color={theme.colors.textSecondary}
              style={{ marginBottom: 8 }}
            />
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.medium,
                fontSize: 14,
              }}
            >
              Searching for "{query}"...
            </Text>
          </View>
          {[1, 2, 3].map((i) => (
            <ShopCardSkeleton key={i} style={{ marginBottom: 12 }} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={32}
            color={theme.colors.textSecondary}
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.medium,
              marginBottom: 16,
            }}
          >
            Couldn't load search results
          </Text>
          <Pressable
            onPress={() => storesStore.searchShops({ q: query })}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.surfaceSecondary,
            }}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fonts.semiBold,
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      );
    }

    if (storesStore.searchResults.length === 0) {
      const popularSearches = ["Groceries", "Pharmacy", "Bakery", "Electronics"];
      return (
        <View style={{ paddingHorizontal: 20, marginTop: 40, alignItems: "center" }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: theme.colors.surfaceSecondary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="sad-outline" size={28} color={theme.colors.textSecondary} />
          </View>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
              fontSize: 15,
              marginBottom: 4,
            }}
          >
            No results for "{query}"
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.medium,
              fontSize: 13,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Check the spelling or try a different search.
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fonts.bold,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Popular Searches
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {popularSearches.map((item) => (
              <Chip key={item} label={item} onPress={() => storesStore.setSearchQuery(item)} />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
        <Text
          style={[
            theme.textPresets.bodyLarge,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
              fontSize: 16,
              marginBottom: 4,
            },
          ]}
        >
          Results for "{query}"
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fonts.medium,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {storesStore.searchResults.length} shop{storesStore.searchResults.length === 1 ? "" : "s"} found
        </Text>
        {storesStore.searchResults.map((shop, idx) => {
          const matchedCategories = shop.matched_categories ?? [];
          const matchedSubcategories = shop.matched_subcategories ?? [];
          const hasChips = matchedCategories.length + matchedSubcategories.length > 0;
          return (
            <StaggeredSearchResult key={shop.id} index={idx}>
              <View style={{ marginBottom: 16 }}>
                <ShopCard
                  shop={shop}
                  onPress={() => router.push(`/customer/store/${shop.id}`)}
                />
                {hasChips && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 8 }}>
                    {matchedCategories.map((c) => (
                      <Chip
                        key={c.id}
                        label={c.name}
                        onPress={() => storesStore.searchShops({ q: query, category_id: c.id })}
                        style={{ backgroundColor: Colors.semantic.infoLight, borderColor: "transparent" }}
                        textStyle={{ color: Colors.semantic.info }}
                      />
                    ))}
                    {matchedSubcategories.map((c) => (
                      <Chip
                        key={c.id}
                        label={c.name}
                        onPress={() => storesStore.searchShops({ q: query, subcategory_id: c.id })}
                        style={{ backgroundColor: theme.colors.surfaceSecondary, borderColor: "transparent" }}
                        textStyle={{ color: theme.colors.primary }}
                      />
                    ))}
                  </View>
                )}
              </View>
            </StaggeredSearchResult>
          );
        })}
      </View>
    );
  };

  const renderAddressSheet = () => (
    <BottomSheetModal
      ref={addressSheetRef}
      snapPoints={addressSnapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.colors.surface, borderRadius: 28 }}
      handleIndicatorStyle={{ backgroundColor: isDark ? "#374151" : "#E5E7EB" }}
    >
      <BottomSheetView style={styles.addressSheetContent}>
        <View style={styles.addressSheetHeader}>
          <Text
            style={[
              styles.addressSheetTitle,
              {
                fontFamily: theme.typography.fonts.bold,
                color: theme.colors.textPrimary,
              },
            ]}
          >
            Choose Delivery Address
          </Text>
        </View>
        <Text
          style={[
            styles.addressSheetSub,
            {
              fontFamily: theme.typography.fonts.medium,
              color: theme.colors.textSecondary,
            },
          ]}
        >
          Select your location to find stores within a 6 km radius.
        </Text>
        {/* Add new address CTA — above the address list */}
        <Pressable
          onPress={() => {
            addressSheetRef.current?.dismiss();
            router.push("/customer/addresses/map-picker");
          }}
          style={({ pressed }) => [
            styles.addAddrBtn,
            { borderColor: theme.colors.border, backgroundColor: pressed ? `${theme.colors.primary}0C` : theme.colors.background },
          ]}
        >
          <View style={[styles.addAddrIconWrap, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.addAddrLabel,
                { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold },
              ]}
            >
              Add new address
            </Text>
            <Text
              style={[
                styles.addAddrSub,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium },
              ]}
            >
              Pin your exact location on the map
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Pressable>

        {/* Divider */}
        <View style={[styles.addrDivider, { backgroundColor: theme.colors.border }]} />

        <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
          {addresses.map((addr) => {
            const active = activeAddress?.id === addr.id;
            return (
              <Pressable
                key={addr.id}
                onPress={() => handleAddressSelect(addr)}
                style={[
                  styles.addrItem,
                  {
                    borderColor: active ? "#10B981" : theme.colors.border,
                    backgroundColor: active
                      ? isDark
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(16, 185, 129, 0.05)"
                      : "transparent",
                  },
                ]}
              >
                <View
                  style={[
                    styles.addrIcon,
                    {
                      backgroundColor: active
                        ? "#10B981"
                        : isDark
                          ? "#1F2937"
                          : "#ECFDF5",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      addr.label === "Home"
                        ? "home-outline"
                        : addr.label === "Work"
                          ? "briefcase-outline"
                          : "location-outline"
                    }
                    size={16}
                    color={active ? "#FFFFFF" : "#10B981"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.addrLabel,
                      {
                        fontFamily: theme.typography.fonts.bold,
                        color: theme.colors.textPrimary,
                      },
                    ]}
                  >
                    {addr.label}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.addrStreet,
                      {
                        fontFamily: theme.typography.fonts.medium,
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {addr.streetAddress}, {addr.city}
                  </Text>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                ) : (
                  <View style={[styles.radioCircle, { borderColor: theme.colors.border }]} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={!isSearchActive}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#16A34A"
          />
        }
      >
        <LinearGradient
          colors={["#16A34A", theme.colors.background]}
          style={styles.gradientHeaderSection}
          onLayout={(e) => {
            gradientHeaderHeight.current = e.nativeEvent.layout.height;
          }}
        >
          <Animated.View style={headerAnimatedStyle}>
            {renderTopHeader()}
          </Animated.View>

          {renderSearchBar()}

          <Animated.View style={headerAnimatedStyle}>
            {renderBanners()}
          </Animated.View>
        </LinearGradient>

        <View
          style={[
            styles.stickyCategoriesSection,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Animated.View style={floatingSearchSpacerStyle} />
          <Animated.View style={categoriesAnimatedStyle}>
            {renderCategoryList()}
          </Animated.View>
        </View>

        <Animated.View style={cardsAnimatedStyle}>
          {renderShopsSection()}
        </Animated.View>
      </ScrollView>

      {/* Floating search bar - appears when scrolling up past the header */}
      <Animated.View
        pointerEvents={showFloatingSearch && !isSearchActive ? "auto" : "none"}
        style={[
          styles.floatingSearchBar,
          { top: insets.top + 8 },
          floatingSearchAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={activateSearch}
          style={[
            styles.searchBarInnerWrapper,
            { backgroundColor: isDark ? "rgba(31, 41, 55, 0.95)" : "#FFFFFF" },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color="#16A34A"
            style={{ marginLeft: 12, marginRight: 8 }}
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Animated.Text
              numberOfLines={1}
              style={[
                placeholderAnimatedStyle,
                styles.searchPlaceholderText,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium },
              ]}
            >
              {SEARCH_PLACEHOLDERS[placeholderIndex]}
            </Animated.Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Dimmed background overlay */}
      <Animated.View
        pointerEvents={isSearchActive ? "auto" : "none"}
        style={[
          styles.dimmerOverlay,
          {
            top: insets.top + SEARCH_OVERLAY_TOP_OFFSET,
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)",
          },
          dimmerAnimatedStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={deactivateSearch} />
      </Animated.View>

      {/* Search suggestions & results overlay */}
      {isSearchActive && (
        <Animated.View
          style={[
            styles.searchOverlayContainer,
            {
              top: insets.top + SEARCH_OVERLAY_TOP_OFFSET,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {filters.searchQuery.trim() === ""
              ? renderSearchSuggestions()
              : renderOverlaySearchResults()}
          </ScrollView>
        </Animated.View>
      )}

      {!cartStore.isEmpty && !isSearchActive && renderFloatingCart()}
      {renderAddressSheet()}
      {renderCuisinesBottomSheet()}
      {renderCartBottomSheet()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: { flex: 1 },
  locationContainer: { flexDirection: "row", alignItems: "center" },
  scrollContainer: { paddingBottom: 140, flexGrow: 1 },
  headerRightActions: { flexDirection: "row", alignItems: "center" },
  headerActionBtn: { padding: 6, position: "relative" },

  // Green-to-background gradient behind the address header, search bar and banner
  gradientHeaderSection: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    paddingBottom: 8,
  },

  // Sticky categories (takes over the top spot once the header/banner scroll away)
  stickyCategoriesSection: {
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },

  // Floating search bar (shown on scroll-up past the header)
  floatingSearchBar: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 12,
  },

  // Search bar styles
  searchBarOuterWrapper: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  searchBarInnerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    paddingRight: 5,
  },
  searchTextInput: { flex: 1, fontSize: 14, height: "100%", paddingLeft: 4 },
  searchPlaceholderText: {
    position: "absolute",
    left: 4,
    right: 0,
    fontSize: 14,
  },
  dimmerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
  },
  searchOverlayContainer: {
    position: "absolute",
    zIndex: 5,
  },
  suggestionsContainer: {
    paddingTop: 28,
  },
  suggestionItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceSearchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  waveformBar: {
    width: 2.2,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 1.2,
    borderRadius: 1,
  },

  // Suggestions chips
  suggestionsScroll: { paddingHorizontal: 20, marginBottom: 20 },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  suggestionIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  suggestionText: { fontSize: 13, fontWeight: "500" },

  // Tabs styles
  topTabsScroll: { paddingHorizontal: 20, marginBottom: 20 },
  topTabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  topTabText: { fontSize: 14, fontWeight: "600", marginLeft: 6 },

  // Grid styles
  gridContainer: { paddingHorizontal: 20, marginBottom: 24 },
  gridTitle: { fontSize: 19, fontWeight: "700" },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Section headers (Featured / Shops Near You)
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sectionCountBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  // Card styles
  cardImageContainer: {
    height: 80,
    width: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: "100%" },
  cardText: { fontSize: 11, textAlign: "center", lineHeight: 14 },

  // Spotlight styles
  spotlightScroll: { paddingLeft: 20, paddingRight: 4 },
  spotlightCard: {
    height: 120,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  spotlightCardText: {
    fontSize: 15,
    fontWeight: "700",
    width: "75%",
    lineHeight: 20,
  },
  spotlightCardImage: {
    width: 70,
    height: 70,
    position: "absolute",
    bottom: -5,
    right: -5,
  },

  // Picks styles
  picksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  picksCard: {
    height: 110,
    borderRadius: 20,
    padding: 12,
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    marginBottom: 12,
  },
  picksCardText: {
    fontSize: 13,
    fontWeight: "700",
    width: "80%",
    lineHeight: 16,
  },
  picksCardImage: {
    width: 55,
    height: 55,
    position: "absolute",
    bottom: -5,
    right: -5,
  },

  // Deals styles
  sectionTitleRow: { paddingHorizontal: 20, marginBottom: 12 },
  dealsScroll: { paddingHorizontal: 12, paddingBottom: 16 },
  dealCardWrapper: { width: 180, marginHorizontal: 6 },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  countdownBox: {
    backgroundColor: "#F5ECE9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countdownText: { color: "#C97C5D", fontSize: 12, fontWeight: "bold" },
  countdownColon: { color: "#C97C5D", fontWeight: "bold", marginHorizontal: 3 },

  // Floating Cart & Address sheet
  floatingCart: {
    position: "absolute",
    bottom: 96,
    left: 48,
    right: 48,
    height: 64,
    borderRadius: 32,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    elevation: 6,
    shadowColor: "rgba(0, 77, 87, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  cartMainArea: { flex: 1, flexDirection: "row", alignItems: "center" },
  cartImageWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    marginRight: 12,
  },
  cartImage: { width: "100%", height: "100%" },
  cartLeft: { flex: 1, justifyContent: "center" },
  viewCartText: { fontSize: 15 },
  cartQtyText: {
    fontSize: 13,
    marginTop: 2,
  },
  viewCartFloatingPillWrapper: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  viewCartFloatingPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 0.5,
    elevation: 4,
    shadowColor: "rgba(0, 77, 87, 0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  viewCartFloatingPillIcon: { marginRight: 6 },
  viewCartFloatingPillText: {
    color: "#16A34A",
    fontSize: 13,
  },
  viewCartFloatingPillBadgeWrapper: {
    position: "absolute",
    top: -14,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  viewCartFloatingPillBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cartChevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#047857",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  addressList: { padding: 16 },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  addressIcon: { marginRight: 12 },
  addressText: { flex: 1 },

  // Home banner carousel
  bannerSection: { marginBottom: 12 },
  bannerSlide: { width: SCREEN_WIDTH, paddingHorizontal: 20 },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 18,
  },
  bannerDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  bannerDot: {
    height: 6,
    borderRadius: 3,
  },
  // Premium Address Sheet Styles
  addressSheetContent: { padding: 20, paddingBottom: 40 },
  addressSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  addressSheetTitle: { fontSize: 18, marginBottom: 6 },
  addressSheetSub: { fontSize: 13, marginBottom: 20 },
  addrItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
    gap: 12,
  },
  addrIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  addrLabel: { fontSize: 14 },
  addrStreet: { fontSize: 12, marginTop: 2 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5 },
  addrDivider: { height: 1, marginVertical: 14, opacity: 0.5 },
  addAddrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  addAddrIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  addAddrLabel: { fontSize: 14 },
  addAddrSub: { fontSize: 11, marginTop: 2 },

  // New Category List & Bottom Sheet styles
  categoriesSection: { paddingVertical: 4 },
  categoriesScroll: { paddingHorizontal: 20, alignItems: "flex-start" },
  categoryItem: {
    alignItems: "center",
    marginRight: 14,
    position: "relative",
    width: 58,
  },
  categoryImageContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  categoryImageSelected: { borderColor: "#E11D48", borderWidth: 2 },
  categoryImage: { width: "100%", height: "100%", resizeMode: "cover" },
  categoryText: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 12,
    color: "#374151",
    paddingHorizontal: 2,
  },
  categoryUnderline: {
    position: "absolute",
    left: 0,
    bottom: -2,
    height: 3,
    backgroundColor: "#16A34A",
    borderRadius: 1.5,
  },
  seeAllCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFE4E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  seeAllLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetHeaderWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    position: "relative",
  },
  customHandleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 4,
    position: "relative",
    overflow: "visible",
  },
  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  floatingCloseBtn: {
    position: "absolute",
    top: -56,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "left",
    marginTop: 10,
  },
  bottomSheetScrollView: { paddingHorizontal: 20 },
  bottomSheetScrollContent: { paddingTop: 20, paddingBottom: 40 },
  bottomSheetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  bottomSheetImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bottomSheetImage: { width: "100%", height: "100%", resizeMode: "cover" },
  bottomSheetText: { fontSize: 12, textAlign: "center", lineHeight: 16 },
  fallbackIconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },

  // Cart Bottom Sheet & Cards styling
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 20,
    top: 20,
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyCartIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyCartTitle: { fontSize: 18, marginBottom: 6 },
  emptyCartSub: { fontSize: 13, textAlign: "center", lineHeight: 18 },
  cartRowSwipeContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
  },
  cartRowDeleteAction: {
    width: CART_DELETE_ACTION_WIDTH,
    height: "100%",
    position: "relative",
  },
  cartRowDeleteBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin: "right",
  },
  cartRowDeleteInner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cartRowDeleteText: { fontSize: 14 },
  cartThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 12,
  },
  cartThumbnailImage: { width: "100%", height: "100%" },
  cartRowInfo: { flex: 1, marginRight: 8 },
  cartCardShopName: { fontSize: 15, marginBottom: 2 },
  cartRowPrice: { fontSize: 12 },
  cartActionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 70,
  },
  cartActionPillTitle: { color: "#FFFFFF", fontSize: 12 },
  cartActionPillSub: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 10,
    marginTop: 1,
  },
  cartRowDeleteToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cartSheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: "center",
  },
  checkoutAllBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    paddingHorizontal: 20,
    width: "60%",
  },
  checkoutAllText: { color: "#FFFFFF", fontSize: 13 },
  checkoutAllIcon: { marginLeft: 4 },
});
