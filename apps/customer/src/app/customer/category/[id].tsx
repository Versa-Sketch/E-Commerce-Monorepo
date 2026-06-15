import { ShopCard } from '../../../features/Stores/components/ShopCard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCartStore } from '../../../features/Cart/Providers/useCartStore';
import { useStoresStore } from '../../../features/Stores/Providers/useStoresStore';
import { useTheme } from '../../../theme/ThemeContext';
import { LoadingWrapper } from '../../../Common/components/ui/LoadingWrapper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORY_COVERS: Record<string, string> = {
  daily_amenities: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  pharmacy: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80',
  food: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
  fashion: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  electronics: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&q=80',
  general_store: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
};

const CATEGORY_TAGLINES: Record<string, string> = {
  daily_amenities: 'Fresh fruits, vegetables, and daily essentials delivered in 15 mins',
  pharmacy: 'Prescriptions, OTC medicines & premium wellness products',
  food: 'Gourmet delicacies, hot meals and quick snacks',
  fashion: 'Premium apparel, basics & custom styles',
  electronics: 'Smart tech, earbuds, accessories & laptop peripherals',
  general_store: 'Everything your household needs, in one place',
};

export default observer(function CategoryDetailsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { id, title } = useLocalSearchParams();
  const cartStore = useCartStore();
  const storesStore = useStoresStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  const categoryId = id as string;
  const categoryTitle = (title as string) || categoryId.replace('_', ' ');

  const category = storesStore.globalCategories.find((c) => c.id === categoryId);
  const subCategories = [
    { id: 'All', name: 'All' },
    ...(category ? category.subcategories : []),
  ];

  useEffect(() => {
    storesStore.fetchShops({
      category_id: categoryId,
      subcategory_id: selectedSubCategory === 'All' ? undefined : selectedSubCategory,
    });
  }, [categoryId, selectedSubCategory]);

  const filteredShops = storesStore.shops.filter((shop) => {
    const q = searchQuery.toLowerCase();
    return (
      shop.name.toLowerCase().includes(q) ||
      (shop.description && shop.description.toLowerCase().includes(q))
    );
  });

  const coverUrl =
    CATEGORY_COVERS[categoryId] ||
    (category?.image ? category.image : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80');
  const tagline = CATEGORY_TAGLINES[categoryId] || 'Explore the best neighborhood selections near you';

  const renderShopsList = () => {
    if (filteredShops.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
            No shops found in this category
          </Text>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 4 }}>
        {filteredShops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onPress={() => {
              router.push(`/customer/store/${shop.id}`);
            }}
            style={{ marginBottom: 12 }}
          />
        ))}

        {storesStore.hasMoreShops && (
          <Pressable
            onPress={() => {
              storesStore.fetchShops(
                {
                  category_id: categoryId,
                  subcategory_id: selectedSubCategory === 'All' ? undefined : selectedSubCategory,
                },
                { append: true }
              );
            }}
            style={[styles.loadMoreBtn, { borderColor: theme.colors.primary }]}
          >
            <Text style={[styles.loadMoreText, { color: theme.colors.primary, fontFamily: theme.typography.fonts.bold }]}>
              Load More Shops
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Translucent/Glassmorphic Header */}
      <View style={[styles.header, { backgroundColor: isDark ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          {categoryTitle}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Hero Banner */}
        <View style={styles.heroBanner}>
          <Image source={{ uri: coverUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />
          <View style={styles.heroTextContainer}>
            <Text style={[styles.heroTitle, { fontFamily: theme.typography.fonts.bold }]}>{categoryTitle}</Text>
            <Text numberOfLines={2} style={[styles.heroSubtitle, { fontFamily: theme.typography.fonts.medium }]}>
              {tagline}
            </Text>
          </View>
        </View>

        {/* Dynamic Inner Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBarWrapper, { backgroundColor: isDark ? theme.colors.surfaceSecondary : '#F3F4F6' }]}>
            <Ionicons name="search" size={20} color="#16A34A" style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search stores in ${categoryTitle}...`}
              placeholderTextColor="#9CA3AF"
              style={[styles.searchInput, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Subcategories Horizontal Scroll */}
        {subCategories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subCategoriesScroll}
          >
            {subCategories.map((subCat) => {
              const isSelected = selectedSubCategory === subCat.id;
              return (
                <Pressable
                  key={subCat.id}
                  onPress={() => setSelectedSubCategory(subCat.id)}
                  style={[
                    styles.subCatChip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF'),
                      borderColor: isSelected ? theme.colors.primary : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'),
                      borderWidth: 1.5,
                      borderRadius: theme.borderRadius.round,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.subCatChipText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.textSecondary,
                        fontFamily: isSelected ? theme.typography.fonts.bold : theme.typography.fonts.medium,
                      },
                    ]}
                  >
                    {subCat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Shops Section */}
        <View style={styles.productsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
            {selectedSubCategory === 'All' ? 'Shops in Spotlight' : 'Filtered Shops'}
          </Text>

          <LoadingWrapper
            apiStatus={storesStore.shopsStatus}
            error={storesStore.shopsError}
            retry={() =>
              storesStore.fetchShops({
                category_id: categoryId,
                subcategory_id: selectedSubCategory === 'All' ? undefined : selectedSubCategory,
              })
            }
            renderSuccessUI={renderShopsList}
          />
        </View>
      </ScrollView>

      {/* Floating Zomato/Swiggy style Cart Bar */}
      {!cartStore.isEmpty && (
        <Pressable
          onPress={() => router.push('/customer/cart')}
          style={[styles.floatingCartBar, { backgroundColor: '#16A34A', borderRadius: theme.borderRadius.round }]}
        >
          <View style={styles.cartBarLeft}>
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.cartBarText, { fontFamily: theme.typography.fonts.bold, color: '#FFFFFF' }]}>
              {cartStore.totalItemCount} Items  •  ₹{cartStore.totals.grandTotal.toFixed(0)}
            </Text>
          </View>
          <View style={styles.cartBarRight}>
            <Text style={[styles.cartBarButtonText, { fontFamily: theme.typography.fonts.bold, color: '#FFFFFF' }]}>
              View Cart
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </View>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  heroBanner: {
    height: SCREEN_HEIGHT * 0.18,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroTextContainer: {
    zIndex: 10,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: '85%',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  subCategoriesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subCatChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  subCatChipText: {
    fontSize: 13,
  },
  productsSection: {
    paddingHorizontal: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  loadMoreBtn: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    fontSize: 14,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    elevation: 8,
    shadowColor: 'rgba(0, 77, 87, 0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    zIndex: 99,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarText: {
    fontSize: 14,
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarButtonText: {
    fontSize: 14,
  },
});
