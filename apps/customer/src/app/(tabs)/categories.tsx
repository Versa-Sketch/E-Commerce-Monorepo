import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CategoryCard } from "../../features/Stores/components/CategoryCard";
import { ProductCard } from "../../features/Stores/components/ProductCard";
import { StoreCard } from "../../features/Stores/components/StoreCard";
import { MOCK_PRODUCTS, MOCK_STORES } from "../../constants";
import { useStoresStore } from "../../features/Stores/Providers/useStoresStore";
import { useTheme } from "../../theme/ThemeContext";
import { StoreCategory } from "../../types/shared";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CATEGORIES_DATA: { id: StoreCategory; label: string }[] = [
  { id: "fashion", label: "Fashion" },
  { id: "food", label: "Food & Dining" },
  { id: "daily_amenities", label: "Daily Amenities" },
  { id: "general_store", label: "General Store" },
  { id: "pharmacy", label: "Medicines" },
  { id: "electronics", label: "Electronics" },
  { id: "others", label: "Others" },
];
export default observer(function CategoriesScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const storesStore = useStoresStore();
  const handleCategorySelect = (catId: StoreCategory) => {
    storesStore.setSelectedCategory(catId);
    router.push("/(tabs)");
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          style={[
            theme.textPresets.h1,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
              fontSize: 26,
            },
          ]}
        >
          Discover Neighborhood
        </Text>
        <Text
          style={[
            theme.textPresets.bodySmall,
            { color: theme.colors.textSecondary, marginTop: 4, fontSize: 13 },
          ]}
        >
          Explore stores, collections and trending deals near you
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {CATEGORIES_DATA.map((item) => (
            <View key={item.id} style={styles.gridItemWrapper}>
              <CategoryCard
                category={item.id}
                label={item.label}
                onPress={() => handleCategorySelect(item.id)}
                style={styles.card}
              />
            </View>
          ))}
        </View>
        <View
          style={[styles.heroBanner, { borderRadius: theme.borderRadius.xl }]}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
            }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0, 77, 87, 0.45)" },
            ]}
          />
          <View style={styles.heroTextContainer}>
            <Text
              style={[
                styles.heroTitle,
                { fontFamily: theme.typography.fonts.bold },
              ]}
            >
              Indiranagar's Finest
            </Text>
            <Text
              numberOfLines={2}
              style={[
                styles.heroSubtitle,
                { fontFamily: theme.typography.fonts.medium },
              ]}
            >
              Handcrafted local collections delivered directly to your doorstep
              in 20 minutes
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Featured Stores
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {MOCK_STORES.slice(1, 4).map((store) => (
              <View key={store.id} style={styles.storeCardWrapper}>
                <StoreCard
                  store={store}
                  onPress={() => {
                    storesStore.setSelectedCategory(store.category);
                    router.push(`/customer/store/${store.id}`);
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Curated Collections
          </Text>
          <View style={styles.collectionsGrid}>
            <Pressable
              style={styles.collectionItem}
              onPress={() => handleCategorySelect("daily_amenities")}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
                }}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(0, 60, 70, 0.45)" },
                ]}
              />
              <Text
                style={[
                  styles.collectionText,
                  { fontFamily: theme.typography.fonts.bold },
                ]}
              >
                Daily Amenities
              </Text>
            </Pressable>
            <Pressable
              style={styles.collectionItem}
              onPress={() => handleCategorySelect("fashion")}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
                }}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(0, 60, 70, 0.45)" },
                ]}
              />
              <Text
                style={[
                  styles.collectionText,
                  { fontFamily: theme.typography.fonts.bold },
                ]}
              >
                Premium Apparel
              </Text>
            </Pressable>
            <Pressable
              style={styles.collectionItem}
              onPress={() => handleCategorySelect("pharmacy")}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=400&q=80",
                }}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(0, 60, 70, 0.45)" },
                ]}
              />
              <Text
                style={[
                  styles.collectionText,
                  { fontFamily: theme.typography.fonts.bold },
                ]}
              >
                Wellness Essentials
              </Text>
            </Pressable>
            <Pressable
              style={styles.collectionItem}
              onPress={() => handleCategorySelect("electronics")}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&q=80",
                }}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(0, 60, 70, 0.45)" },
                ]}
              />
              <Text
                style={[
                  styles.collectionText,
                  { fontFamily: theme.typography.fonts.bold },
                ]}
              >
                Smart Tech Hub
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
              },
            ]}
          >
            Trending Products
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {MOCK_PRODUCTS.slice(0, 4).map((prod) => (
              <View key={prod.id} style={styles.productCardWrapper}>
                <ProductCard
                  product={prod}
                  onPress={() => {
                    storesStore.setSelectedCategory(prod.category as any);
                    router.push(`/customer/store/${prod.storeId}`);
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
});
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  scrollContent: { paddingBottom: 140 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  gridItemWrapper: { width: "31%", alignItems: "center", marginBottom: 16 },
  card: { width: "100%" },
  heroBanner: {
    height: 140,
    marginHorizontal: 20,
    marginBottom: 28,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heroTextContainer: { zIndex: 10 },
  heroTitle: { color: "#FFFFFF", fontSize: 20, marginBottom: 4 },
  heroSubtitle: {
    color: "#E0F2F1",
    fontSize: 12,
    maxWidth: "80%",
    lineHeight: 16,
  },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, paddingHorizontal: 20, marginBottom: 12 },
  horizontalScroll: { paddingHorizontal: 16 },
  storeCardWrapper: { width: SCREEN_WIDTH * 0.76, marginRight: 12 },
  productCardWrapper: { width: 170, marginRight: 12 },
  collectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  collectionItem: {
    width: "48%",
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  collectionText: {
    color: "#FFFFFF",
    fontSize: 14,
    zIndex: 10,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
