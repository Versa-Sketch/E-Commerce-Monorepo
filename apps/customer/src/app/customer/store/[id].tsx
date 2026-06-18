import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

type StoreDetailTab = 'products';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selectedSortSlug, setSelectedSortSlug] = useState<string | null>(null);
  const sortSheetRef = useRef<BottomSheetModal>(null);
  const isSortMounted = useRef(false);

  React.useEffect(() => {
    if (shopId) {
      storesStore.fetchShopCategories(shopId);
      storesStore.fetchShopProducts(shopId, { page_size: 5, q });
      storesStore.fetchShopSortFilters(shopId);
      if (storesStore.shops.length === 0) {
        storesStore.fetchShops();
      }
      cartStore.getShopCart(shopId);
    }
  }, [shopId, q]);

  React.useEffect(() => {
    if (!isSortMounted.current) {
      isSortMounted.current = true;
      return;
    }
    if (!shopId) return;
    storesStore.fetchShopProducts(shopId, { page_size: 5, filter: selectedSortSlug ?? undefined });
  }, [selectedSortSlug]);

  const shop = storesStore.shops.find((s) => s.id === shopId) || storesStore.shops[0];

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

  // Horizontal Product Row - Redesigned
  const renderStoreProductRow = (product: Product) => {
    const quantityInCart = cartStore.getQuantityForProduct(product.id);
    const basePrice = product.price;
    const displayPrice = product.discountPrice || basePrice;
    const hasDiscount = !!product.discountPrice;
    const discountPercent = hasDiscount ? Math.round(((basePrice - displayPrice) / basePrice) * 100) : 0;

    return (
      <View
        key={product.id}
        style={[styles.productCard, { backgroundColor: theme.colors.surface, shadowColor: '#000' }]}
      >
        {/* Left Side: Image */}
        <View style={styles.productCardImage}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="cover" />
        </View>

        {/* Right Side: Info */}
        <View style={styles.productCardContent}>
          {/* Bargain Badge */}
          {product.isBargainable && (
            <View style={styles.bargainBadge}>
              <Text style={styles.bargainBadgeText}>🏷 Bargain Available</Text>
            </View>
          )}

          {/* Product Title */}
          <Text
            style={[
              styles.productCardTitle,
              { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold },
            ]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Description */}
          <Text
            style={[styles.productCardDesc, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {product.description}
          </Text>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <Text
              style={[
                styles.discountPriceText,
                { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold },
              ]}
            >
              ₹{displayPrice.toFixed(0)}
            </Text>
            {hasDiscount && (
              <>
                <Text style={styles.originalPriceText}>₹{basePrice.toFixed(0)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{discountPercent}% OFF</Text>
                </View>
              </>
            )}
          </View>

          {/* Bottom Row: Actions & Quantity */}
          <View style={styles.productCardBottom}>
            <View style={styles.actionRow}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  alert('Saved to wishlist');
                }}
                style={[styles.iconButton, { borderColor: theme.colors.border }]}
              >
                <Ionicons name="heart-outline" size={14} color={theme.colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  alert('Shared successfully');
                }}
                style={[styles.iconButton, { borderColor: theme.colors.border }]}
              >
                <Ionicons name="share-social-outline" size={14} color={theme.colors.textSecondary} />
              </Pressable>
            </View>

            {/* Quantity Control */}
            {quantityInCart > 0 ? (
              <View style={[styles.qtySelector, { borderColor: theme.colors.border }]}>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDecrement(product, quantityInCart);
                  }}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="remove" size={14} color="#16A34A" />
                </Pressable>
                <RollingNumber value={quantityInCart} style={styles.qtySelectorText as any} />
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    handleIncrement(product, quantityInCart);
                  }}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="add" size={14} color="#16A34A" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleAdd(product);
                }}
                style={[styles.addButton, { backgroundColor: '#16A34A' }]}
              >
                <Text style={styles.addButtonText}>ADD</Text>
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
          <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.55)' }]} />

          <View style={styles.heroActions}>
            <Pressable onPress={() => router.back()} style={styles.backBtnHeader}>
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </Pressable>
          </View>
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

        {/* Search Bar + Filter Icon */}
        <View style={[styles.stickySection, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <View style={styles.searchRow}>
            <View style={styles.stickySearch}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12, height: 44 }}>
                <Ionicons name="search" size={18} color={theme.colors.textSecondary} />
                <TextInput
                  placeholder={`Search in ${store.name}...`}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{ flex: 1, marginLeft: 8, fontSize: 14, color: theme.colors.textPrimary }}
                />
              </View>
            </View>
            <Pressable
              onPress={() => sortSheetRef.current?.present()}
              style={[styles.filterButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Ionicons name="funnel" size={20} color="#16A34A" />
              {selectedSortSlug && (
                <View style={styles.sortBadge}>
                  <Text style={styles.sortBadgeText}>1</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.filtersSection}>
            {/* Filter Chips */}
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
                        borderColor: isActive ? '#16A34A' : theme.colors.border,
                        backgroundColor: isActive ? '#16A34A' : theme.colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
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
                          style={styles.catalogSectionHeader}
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
          />
        </View>
      </ScrollView>

      {/* Sort Bottom Sheet */}
      <BottomSheetModal
        ref={sortSheetRef}
        snapPoints={['50%']}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <BottomSheetView style={styles.sortSheet}>
          <View style={styles.sortSheetHeader}>
            <Text style={[styles.sortSheetTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
              Sort By
            </Text>
            {selectedSortSlug && (
              <Pressable onPress={() => { setSelectedSortSlug(null); sortSheetRef.current?.dismiss(); }}>
                <Text style={{ color: '#0C831F', fontSize: 13, fontFamily: theme.typography.fonts.medium }}>Clear</Text>
              </Pressable>
            )}
          </View>
          {storesStore.shopSortFilters.map((sortFilter, index) => {
            const isSelected = selectedSortSlug === sortFilter.slug;
            const isLast = index === storesStore.shopSortFilters.length - 1;
            return (
              <Pressable
                key={sortFilter.slug}
                onPress={() => {
                  setSelectedSortSlug(isSelected ? null : sortFilter.slug);
                  sortSheetRef.current?.dismiss();
                }}
                style={[styles.sortOption, { borderBottomWidth: isLast ? 0 : 1, borderBottomColor: theme.colors.border }]}
              >
                <View style={styles.sortOptionLeft}>
                  <Text style={[styles.sortOptionName, { color: theme.colors.textPrimary, fontFamily: isSelected ? theme.typography.fonts.bold : theme.typography.fonts.medium }]}>
                    {sortFilter.name}
                  </Text>
                  {sortFilter.description ? (
                    <Text style={[styles.sortOptionDesc, { color: theme.colors.textSecondary }]}>
                      {sortFilter.description}
                    </Text>
                  ) : null}
                </View>
                <View style={[styles.sortRadio, { borderColor: isSelected ? '#0C831F' : theme.colors.border }]}>
                  {isSelected && <View style={styles.sortRadioInner} />}
                </View>
              </Pressable>
            );
          })}
        </BottomSheetView>
      </BottomSheetModal>

      {/* Floating Cart Bar at the Bottom */}
      {cartStore.getShopItemCount(shopId) > 0 && (
        <Pressable
          onPress={() => router.push('/customer/cart')}
          style={[styles.floatingCartBar, { backgroundColor: '#16A34A' }]}
        >
          <View style={styles.cartBarLeft}>
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.cartBarText, { fontSize: 15, fontWeight: '700' }]}>
              {cartStore.getShopItemCount(shopId)} Items
            </Text>
          </View>
          <View style={styles.cartBarCenter}>
            <Text style={[styles.cartBarText, { fontSize: 16, fontWeight: '700' }]}>
              ₹{cartStore.getShopTotals(shopId).grandTotal.toFixed(0)}
            </Text>
          </View>
          <View style={styles.cartBarRight}>
            <Text style={[styles.cartBarText, { fontSize: 14, fontWeight: '600' }]}>View Cart</Text>
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
  coverContainer: { height: 220, width: '100%', position: 'relative', backgroundColor: '#1A202C' },
  coverImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFill },

  heroActions: { position: 'absolute', top: 50, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  heroRightActions: { flexDirection: 'row', gap: 8 },
  heroActionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  backBtnHeader: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },

  storeInfoCard: { paddingHorizontal: 16, paddingVertical: 16, marginHorizontal: 0, marginTop: -20, borderRadius: undefined, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  storeLogo: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#E5E7EB', zIndex: 10 },
  storeMainDetails: { flex: 1, marginLeft: 12 },
  storeTitleRow: { flexDirection: 'row', alignItems: 'center' },
  storeNameText: { fontSize: 16, lineHeight: 20 },
  detailsBlock: { marginTop: 6 },
  detailTextRow: { flexDirection: 'row', alignItems: 'center', fontSize: 12 },
  detailIcon: { marginRight: 4 },
  detailText: { fontSize: 12 },

  ratingBadgeContainer: { alignItems: 'center', marginTop: 0, marginLeft: 12 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  reviewCountText: { fontSize: 11, marginTop: 4 },

  stickySection: { borderBottomWidth: 1, paddingTop: 8, paddingBottom: 0, borderBottomColor: '#E5E7EB', shadowColor: 'rgba(0,0,0,0.02)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 2, elevation: 1 },
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
    paddingVertical: 12,
    position: 'relative',
  },
  tabItemText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#16A34A',
  },

  filtersSection: {
    paddingTop: 12,
    paddingBottom: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 13,
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

  catalogSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, marginTop: 16, backgroundColor: 'transparent', borderRadius: 0, marginHorizontal: 0, shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  subCatHeaderTitle: { fontSize: 15 },
  listContainer: { paddingHorizontal: 0 },
  accordionTitleLeft: { flexDirection: 'row', alignItems: 'center' },
  categoryIconEmoji: { fontSize: 18, marginRight: 8 },

  // Product Card Styles (Redesigned)
  productCard: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, marginHorizontal: 16, marginBottom: 8, marginTop: 0, borderRadius: 16, backgroundColor: '#FFFFFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  productCardImage: { width: 100, height: 100, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6', marginRight: 12 },
  productImage: { width: 100, height: 100, borderRadius: 16 },
  productCardContent: { flex: 1, justifyContent: 'space-between' },

  bargainBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginBottom: 6, alignSelf: 'flex-start' },
  bargainBadgeText: { fontSize: 11, color: '#16A34A', fontWeight: '600' },

  productCardTitle: { fontSize: 15, lineHeight: 20, marginBottom: 4 },
  productCardDesc: { fontSize: 12, lineHeight: 16, marginBottom: 6 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  discountPriceText: { fontSize: 15 },
  originalPriceText: { fontSize: 12, textDecorationLine: 'line-through', color: '#9CA3AF', marginLeft: 6 },

  discountBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  discountBadgeText: { fontSize: 10, color: '#16A34A', fontWeight: '600' },

  productCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconButton: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

  qtySelector: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 8, height: 32, gap: 6 },
  qtyBtn: { padding: 4 },
  qtySelectorText: { color: '#111827', fontWeight: '600', fontSize: 12, minWidth: 20, textAlign: 'center' },

  addButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },

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

  sortBadge: { position: 'absolute', top: 7, right: 7, width: 14, height: 14, borderRadius: 7, backgroundColor: '#16A34A', justifyContent: 'center', alignItems: 'center' },
  sortBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
  sortSheet: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 },
  sortSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sortSheetTitle: { fontSize: 16 },
  sortOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  sortOptionLeft: { flex: 1, paddingRight: 12 },
  sortOptionName: { fontSize: 14 },
  sortOptionDesc: { fontSize: 12, marginTop: 3 },
  sortRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  sortRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16A34A' },

  floatingCartBar: { position: 'absolute', bottom: 16, left: 16, right: 16, height: 72, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderRadius: 20, elevation: 8, shadowColor: '#16A34A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 30, zIndex: 99 },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center' },
  cartBarCenter: { flexDirection: 'row', alignItems: 'center' },
  cartBarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  cartBarRight: { flexDirection: 'row', alignItems: 'center' },
});
