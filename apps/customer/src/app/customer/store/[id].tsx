import { SearchBar } from '@/Common/components/ui/SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View
} from 'react-native';
import { LoadingWrapper } from '../../../Common/components/ui/LoadingWrapper';
import { RollingNumber } from '../../../Common/components/ui/RollingNumber';
import { useCartStore } from '../../../features/Cart/Providers/useCartStore';
import { useStoresStore } from '../../../features/Stores/Providers/useStoresStore';
import { StoreProductRowSkeleton } from '../../../features/Stores/components/StoreProductRow/Skeleton';
import { shopProductToProduct } from '../../../features/Stores/utils/productAdapter';
import { useTheme } from '../../../theme/ThemeContext';
import { Product, StoreCategory } from '../../../types/shared';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type StoreDetailTab = 'products' | 'about';
type ProductFilter = 'All' | 'In Stock' | 'Offers' | 'Bargainable';

// Food Classification Helper
const getFoodType = (product: Product): 'veg' | 'non-veg' | 'egg' => {
  const name = product.name.toLowerCase();
  const desc = product.description.toLowerCase();

  if (
    name.includes('chicken') ||
    name.includes('fish') ||
    name.includes('mutton') ||
    name.includes('meat') ||
    name.includes('biryani') ||
    desc.includes('chicken') ||
    desc.includes('fish') ||
    desc.includes('meat')
  ) {
    return 'non-veg';
  }
  if (name.includes('egg') || desc.includes('egg')) {
    return 'egg';
  }
  return 'veg';
};

export default observer(function StoreDetailsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const storesStore = useStoresStore();
  const cartStore = useCartStore();

  const shopId = id as string;

  React.useEffect(() => {
    if (shopId) {
      storesStore.fetchShopCategories(shopId);
      storesStore.fetchShopProducts(shopId, { page_size: 5, q });
      if (storesStore.shops.length === 0) {
        storesStore.fetchShops();
      }
      cartStore.getShopCart(shopId);
    }
  }, [shopId, q]);

  const shop = storesStore.shops.find((s) => s.id === shopId) || storesStore.shops[0];

  const [activeTab, setActiveTab] = useState<StoreDetailTab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!shopId) return;
    const query = searchQuery.trim();
    if (!query) {
      storesStore.searchShopProducts(shopId, { q: '' });
      return;
    }
    const timer = setTimeout(() => {
      storesStore.searchShopProducts(shopId, { q: query });
    }, 400);
    return () => clearTimeout(timer);
  }, [shopId, searchQuery]);

  if (!shop) return null;

  // Adapt Shop to have properties needed by the UI
  const store = {
    id: shop.id,
    name: shop.name,
    category: (shop.shop_types[0]?.slug ?? 'grocery') as StoreCategory,
    logoUrl: shop.id === 'store_1'
      ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80'
      : shop.id === 'store_2'
        ? 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=200&q=80'
        : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80',
    coverUrl: shop.id === 'store_1'
      ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'
      : shop.id === 'store_2'
        ? 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80'
        : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
    rating: parseFloat(shop.average_rating) || 4.5,
    reviewCount: 300,
    distance: parseFloat(shop.delivery_radius_km) / 2 || 2.5,
    deliveryEta: 25,
    deliveryFee: parseFloat(shop.surge_fee) || 0,
    minOrderValue: parseFloat(shop.min_order) || 99,
    isOpen: shop.is_open,
    address: 'Indiranagar, Bangalore',
    phone: shop.phone_number,
    about: shop.description,
  };

  const adaptedProducts = storesStore.shopProducts.map((sp) =>
    shopProductToProduct(sp, shop.id, shop.name)
  );

  const isSearching = searchQuery.trim().length > 0;

  const searchAdaptedProducts = storesStore.shopProductSearchResults.map((sp) =>
    shopProductToProduct(sp, shop.id, shop.name)
  );

  const storeProducts = isSearching ? searchAdaptedProducts : adaptedProducts;

  // Dynamic filter logic (search relevance is handled server-side; only apply chip filters here)
  const filteredProducts = storeProducts.filter((p) => {
    if (selectedFilter === 'In Stock') {
      return p.inStock;
    } else if (selectedFilter === 'Offers') {
      return p.discountPrice !== undefined && p.discountPrice !== null;
    } else if (selectedFilter === 'Bargainable') {
      return p.isBargainable;
    }
    return true;
  });

  // Group filtered products by category (only used when not searching)
  const productsByCategory: Record<string, Product[]> = {};
  filteredProducts.forEach((p) => {
    if (!productsByCategory[p.category]) {
      productsByCategory[p.category] = [];
    }
    productsByCategory[p.category].push(p);
  });

  const isFoodStore = store.category === 'food' || store.category === 'daily_amenities';

  // Emojis for categories
  const getCategoryEmoji = (catName: string): string => {
    const name = catName.toLowerCase();
    if (name.includes('fruit') && name.includes('roasted')) return '🥣';
    if (name.includes('fruit')) return '🍎';
    if (name.includes('veg')) return '🥦';
    if (name.includes('chip') || name.includes('crisp')) return '🥔';
    if (name.includes('biscuit') || name.includes('cookie')) return '🍪';
    if (name.includes('dairy') || name.includes('bread') || name.includes('milk')) return '🥛';
    if (name.includes('bakery') || name.includes('cake')) return '🍰';
    if (name.includes('beverage') || name.includes('drink') || name.includes('soda')) return '🥤';
    if (name.includes('chocolate') || name.includes('candy')) return '🍫';
    if (name.includes('ice cream')) return '🍦';
    if (name.includes('meat') || name.includes('chicken') || name.includes('fish')) return '🥩';
    return '📦';
  };

  // Add/Increment/Decrement Cart Action helpers
  const handleAdd = (product: Product) => {
    cartStore.setQuantity(product, 1);
  };

  const handleIncrement = (product: Product, quantity: number) => {
    cartStore.setQuantity(product, quantity + 1);
  };

  const handleDecrement = (product: Product, quantity: number) => {
    cartStore.setQuantity(product, quantity - 1);
  };

  // Render food indicator badge
  const renderFoodTypeBadge = (product: Product) => {
    if (!isFoodStore) return null;
    const type = getFoodType(product);
    const color = type === 'veg' ? '#0C831F' : type === 'non-veg' ? '#EF4444' : '#F59E0B';

    return (
      <View style={[styles.foodBadgeOuter, { borderColor: color }]}>
        {type === 'non-veg' ? (
          <View style={styles.foodBadgeTriangle} />
        ) : (
          <View style={[styles.foodBadgeDot, { backgroundColor: color }]} />
        )}
      </View>
    );
  };

  // Horizontal Product Row
  const renderStoreProductRow = (product: Product) => {
    const quantityInCart = cartStore.getQuantityForProduct(product.id);
    const basePrice = product.price;
    const displayPrice = product.discountPrice || basePrice;
    const hasDiscount = !!product.discountPrice;

    return (
      <View
        key={product.id}
        style={[styles.productRow, { borderBottomColor: theme.colors.border }]}
      >
        {/* Left Side: Info & Description */}
        <View style={styles.productRowLeft}>
          <View style={styles.badgeRow}>
            {renderFoodTypeBadge(product)}
            {product.rating > 4.5 && (
              <View style={[styles.reorderBadge, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="trending-up" size={10} color="#0C831F" style={{ marginRight: 2 }} />
                <Text style={styles.reorderText}>Highly reordered</Text>
              </View>
            )}
          </View>

          <Text style={[styles.productTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.discountPriceText, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              ₹{displayPrice}
            </Text>
            {hasDiscount && (
              <Text style={styles.originalPriceText}>
                ₹{basePrice}
              </Text>
            )}
          </View>

          {product.isBargainable && (
            <View style={[styles.dealBadge, { backgroundColor: 'rgba(18, 178, 38, 0.06)' }]}>
              <Ionicons name="sparkles-sharp" size={12} color="#0C831F" style={{ marginRight: 4 }} />
              <Text style={[styles.dealText, { color: '#0C831F', fontFamily: theme.typography.fonts.semiBold }]}>
                Try New Deal • Bargainable
              </Text>
            </View>
          )}

          <Text numberOfLines={2} style={[styles.productDesc, { color: theme.colors.textSecondary }]}>
            {product.description}
          </Text>

          {/* Action buttons (Bookmark, Share) */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                alert('Saved to wishlist');
              }}
              style={[styles.circleActionBtn, { borderColor: theme.colors.border }]}
            >
              <Ionicons name="bookmark-outline" size={14} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                alert('Shared successfully');
              }}
              style={[styles.circleActionBtn, { borderColor: theme.colors.border, marginLeft: 10 }]}
            >
              <Ionicons name="share-social-outline" size={14} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Right Side: Image & ADD Button */}
        <View style={styles.productRowRight}>
          <Image source={{ uri: product.imageUrl }} style={styles.productRowImage} resizeMode="cover" />

          {/* Overlapping ADD/Quantity pill */}
          <View style={styles.addBtnContainer}>
            {quantityInCart > 0 ? (
              <View style={[styles.qtySelectorPill, { backgroundColor: '#0C831F' }]}>
                <Pressable
                  onPress={(e) => { e.stopPropagation(); handleDecrement(product, quantityInCart); }}
                  style={styles.qtyActionBtn}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                  <Ionicons name="remove" size={16} color="#FFFFFF" />
                </Pressable>
                <RollingNumber value={quantityInCart} style={styles.qtySelectorText as any} />
                <Pressable
                  onPress={(e) => { e.stopPropagation(); handleIncrement(product, quantityInCart); }}
                  style={styles.qtyActionBtn}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={(e) => { e.stopPropagation(); handleAdd(product); }} style={[styles.addPillBtn, { borderColor: '#0C831F' }]}>
                <Text style={[styles.addBtnText, { color: '#0C831F' }]}>ADD</Text>
                <Text style={[styles.addBtnPlus, { color: '#0C831F' }]}>+</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Section with Overlay Actions */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: store.coverUrl }} style={styles.coverImage} resizeMode="cover" />
          <View style={styles.overlay} />

          <Pressable onPress={() => router.back()} style={styles.backBtnHeader}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Store Detail Information Card */}
        <View style={[styles.storeInfoCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.logoRow}>
            <Image source={{ uri: store.logoUrl }} style={[styles.storeLogo, { borderColor: theme.colors.border }]} />

            <View style={styles.storeMainDetails}>
              <View style={styles.storeTitleRow}>
                <Text style={[styles.storeNameText, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
                  {store.name}
                </Text>
                <Ionicons name="information-circle-outline" size={18} color={theme.colors.textSecondary} style={{ marginLeft: 6, marginTop: 2 }} />
              </View>

              <View style={styles.detailsBlock}>
                <View style={styles.detailTextRow}>
                  <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {store.distance} km away • Indiranagar
                  </Text>
                  <Ionicons name="chevron-down" size={12} color={theme.colors.textSecondary} style={{ marginLeft: 3 }} />
                </View>

                <View style={[styles.detailTextRow, { marginTop: 4 }]}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {store.deliveryEta - 5}-{store.deliveryEta} mins • Schedule for later
                  </Text>
                  <Ionicons name="chevron-down" size={12} color={theme.colors.textSecondary} style={{ marginLeft: 3 }} />
                </View>
              </View>
            </View>

            {/* Zomato Green Rating Badge */}
            <View style={styles.ratingBadgeContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{store.rating}</Text>
                <Ionicons name="star" size={10} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
              <Text style={[styles.reviewCountText, { color: theme.colors.textSecondary }]}>By 300+</Text>
            </View>
          </View>
        </View>

        {/* Tab Selection Section & Dynamic Filters */}
        <View style={[styles.stickySection, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <View style={styles.tabsWrapper}>
            {(['products', 'about'] as StoreDetailTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={styles.tabItem}
                >
                  <Text
                    style={[
                      styles.tabItemText,
                      {
                        color: isActive ? '#0C831F' : theme.colors.textSecondary,
                        fontFamily: isActive ? theme.typography.fonts.bold : theme.typography.fonts.medium,
                      },
                    ]}
                  >
                    {tab}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'products' && (
            <View style={styles.filtersSection}>
              {/* Inner Search bar and Filter Button */}
              <View style={styles.searchRow}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={`Search in ${store.name}...`}
                  style={styles.stickySearch}
                  inputContainerStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
                    borderWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                  }}
                />
                <Pressable
                  onPress={() => {
                    alert('Filter options opened');
                  }}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
                      borderColor: 'transparent',
                    },
                  ]}
                >
                  <Ionicons name="options-outline" size={20} color={theme.colors.textPrimary} />
                </Pressable>
              </View>

              {/* Horizontally scrollable filter chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsScroll}
              >
                {(['All', 'In Stock', 'Offers', 'Bargainable'] as ProductFilter[]).map((filter) => {
                  const isActive = selectedFilter === filter;
                  return (
                    <Pressable
                      key={filter}
                      onPress={() => setSelectedFilter(filter)}
                      style={[
                        styles.filterChip,
                        {
                          borderColor: isActive ? '#12B226' : theme.colors.border,
                          backgroundColor: isActive ? 'rgba(18, 178, 38, 0.08)' : theme.colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: isActive ? '#0C831F' : theme.colors.textSecondary,
                            fontFamily: isActive ? theme.typography.fonts.bold : theme.typography.fonts.medium,
                          },
                        ]}
                      >
                        {filter}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Tab content body */}
        <View style={styles.tabContentBody}>
          <LoadingWrapper
            apiStatus={isSearching ? storesStore.shopProductSearchStatus : storesStore.shopProductsStatus}
            error={isSearching ? storesStore.shopProductSearchError : storesStore.shopProductsError}
            retry={() => {
              if (isSearching) {
                storesStore.searchShopProducts(shopId, { q: searchQuery.trim() });
              } else {
                storesStore.fetchShopCategories(shopId);
                storesStore.fetchShopProducts(shopId, { page_size: 5 });
              }
            }}
            renderLoadingUI={() => (
              <View style={styles.productsList}>
                {[1, 2, 3, 4].map((i) => (
                  <StoreProductRowSkeleton key={i} />
                ))}
              </View>
            )}
            renderSuccessUI={() => (
              <>
                {activeTab === 'products' && (
                  <View style={styles.productsList}>
                    {filteredProducts.length === 0 ? (
                      <View style={styles.emptyCatalog}>
                        <Ionicons name="restaurant-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={[styles.emptyCatalogText, { color: theme.colors.textSecondary }]}>
                          {isSearching
                            ? `No products found for "${searchQuery.trim()}".`
                            : 'No items match the selected filters.'}
                        </Text>
                      </View>
                    ) : isSearching ? (
                      <View style={styles.listContainer}>
                        {filteredProducts.map((prod) => renderStoreProductRow(prod))}
                      </View>
                    ) : (
                      Object.keys(productsByCategory).map((catName) => {
                        const isCollapsed = !!collapsedCategories[catName];
                        const items = productsByCategory[catName];
                        return (
                          <View key={catName} style={{ marginBottom: 16 }}>
                            <Pressable
                              onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setCollapsedCategories((prev) => ({
                                  ...prev,
                                  [catName]: !prev[catName],
                                }));
                              }}
                              style={[
                                styles.catalogSectionHeader,
                                {
                                  borderBottomWidth: isCollapsed ? 1 : 0,
                                  borderBottomColor: theme.colors.border,
                                  paddingVertical: 12,
                                },
                              ]}
                            >
                              <View style={styles.accordionTitleLeft}>
                                <Text style={styles.categoryIconEmoji}>
                                  {getCategoryEmoji(catName)}
                                </Text>
                                <Text
                                  style={[
                                    styles.subCatHeaderTitle,
                                    {
                                      color: theme.colors.textPrimary,
                                      fontFamily: theme.typography.fonts.bold,
                                    },
                                  ]}
                                >
                                  {catName} ({items.length})
                                </Text>
                              </View>
                              <Ionicons
                                name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                                size={18}
                                color={theme.colors.textPrimary}
                              />
                            </Pressable>
                            {!isCollapsed && (
                              <View style={styles.listContainer}>
                                {items.map((prod) => renderStoreProductRow(prod))}
                              </View>
                            )}
                          </View>
                        );
                      })
                    )}
                  </View>
                )}

                {activeTab === 'about' && (
                  <View style={styles.aboutContainer}>
                    <Text style={[styles.subCatHeaderTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, marginBottom: 8 }]}>
                      About {store.name}
                    </Text>
                    <Text style={[styles.aboutDescText, { color: theme.colors.textSecondary }]}>
                      {store.about || 'This store connects community members with premium daily essentials, food items, and specialized catalog products.'}
                    </Text>
                  </View>
                )}
              </>
            )}
          />
        </View>
      </ScrollView>

      {/* Floating Cart Bar at the Bottom */}
      {cartStore.getShopItemCount(shopId) > 0 && (
        <Pressable
          onPress={() => router.push('/customer/cart')}
          style={[styles.floatingCartBar, { backgroundColor: '#16A34A', borderRadius: theme.borderRadius.round }]}
        >
          <View style={styles.cartBarLeft}>
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.cartBarText}>
              {cartStore.getShopItemCount(shopId)} Items | ₹{cartStore.getShopTotals(shopId).grandTotal.toFixed(0)}
            </Text>
          </View>
          <View style={styles.cartBarRight}>
            <Text style={styles.cartBarText}>View Cart</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </View>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  coverContainer: { height: SCREEN_HEIGHT * 0.2, width: '100%', position: 'relative', backgroundColor: '#1A202C' },
  coverImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.25)' },

  backBtnHeader: { position: 'absolute', top: 50, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },

  storeInfoCard: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 0, shadowColor: 'rgba(0,0,0,0.05)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: -44 },
  storeLogo: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: '#FFFFFF', backgroundColor: '#FFFFFF', zIndex: 10 },
  storeMainDetails: { flex: 1, marginLeft: 12, marginTop: 44 },
  storeTitleRow: { flexDirection: 'row', alignItems: 'center' },
  storeNameText: { fontSize: 20, lineHeight: 24 },
  detailsBlock: { marginTop: 6 },
  detailTextRow: { flexDirection: 'row', alignItems: 'center' },
  detailIcon: { marginRight: 4 },
  detailText: { fontSize: 12 },

  ratingBadgeContainer: { alignItems: 'center', marginTop: 44 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#12B226', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  reviewCountText: { fontSize: 10, marginTop: 4 },

  stickySection: { borderBottomWidth: 1, paddingTop: 8, shadowColor: 'rgba(0,0,0,0.02)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 2, elevation: 1 },
  tabsWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabItemText: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#0C831F',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  filtersSection: {
    paddingTop: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  stickySearch: {
    flex: 1,
    marginRight: 10,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterChipsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
  },

  tabContentBody: {
    paddingBottom: 40,
  },
  productsList: {
    width: '100%',
  },
  emptyCatalog: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyCatalogText: {
    fontSize: 13,
    marginTop: 8,
  },

  catalogSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, marginTop: 16 },
  subCatHeaderTitle: { fontSize: 16 },
  listContainer: { paddingHorizontal: 16 },
  accordionTitleLeft: { flexDirection: 'row', alignItems: 'center' },
  categoryIconEmoji: { fontSize: 18, marginRight: 8 },

  // Horizontal product item row styles (Zomato style)
  productRow: { flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1, marginHorizontal: 16 },
  productRowLeft: { flex: 1, paddingRight: 16 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reorderBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  reorderText: { fontSize: 9, color: '#15803D', fontWeight: 'bold' },

  productTitle: { fontSize: 16, lineHeight: 22, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  discountPriceText: { fontSize: 15 },
  originalPriceText: { fontSize: 12, textDecorationLine: 'line-through', color: '#9CA3AF', marginLeft: 6 },

  dealBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F5', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 },
  dealText: { fontSize: 10, color: '#EF4F5F' },

  productDesc: { fontSize: 12, lineHeight: 18, marginBottom: 8 },

  actionRow: { flexDirection: 'row', alignItems: 'center' },
  circleActionBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

  productRowRight: { width: 120, alignItems: 'center', position: 'relative' },
  productRowImage: { width: 120, height: 120, borderRadius: 16 },

  // Custom Zomato ADD button overlay
  addBtnContainer: { position: 'absolute', bottom: -10, width: 96, alignItems: 'center' },
  addPillBtn: { flexDirection: 'row', width: 96, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#EF4F5F', backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#EF4F5F', fontWeight: 'bold', fontSize: 13 },
  addBtnPlus: { color: '#EF4F5F', fontWeight: 'bold', fontSize: 11, position: 'absolute', right: 10, top: 8 },

  qtySelectorPill: { flexDirection: 'row', width: 96, height: 36, borderRadius: 18, backgroundColor: '#EF4F5F', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
  qtyActionBtn: { padding: 6 },
  qtySelectorText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },

  foodBadgeOuter: { width: 13, height: 13, borderWidth: 1.5, borderRadius: 2, justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  foodBadgeDot: { width: 5, height: 5, borderRadius: 2.5 },
  foodBadgeTriangle: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 3.5, borderRightWidth: 3.5, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#EF4444' },

  offersContainer: { padding: 16 },
  offerBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderRadius: 8, borderStyle: 'dashed', marginBottom: 12 },
  offerIcon: { marginRight: 16 },
  offerText: { flex: 1 },
  offerBannerTitle: { fontSize: 13 },
  offerBannerDesc: { fontSize: 11, marginTop: 2 },

  aboutContainer: { padding: 16 },
  aboutDescText: { fontSize: 12, lineHeight: 22 },

  floatingCartBar: { position: 'absolute', bottom: 24, left: 20, right: 20, height: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, elevation: 8, shadowColor: 'rgba(0, 77, 87, 0.25)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 12, zIndex: 99 },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center' },
  cartBarText: { color: '#FFFFFF', fontWeight: 'bold' },
  cartBarRight: { flexDirection: 'row', alignItems: 'center' },
});
