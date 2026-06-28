import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../../../../theme/ThemeContext";
import { ShopCard } from "../../../../features/Stores/components/ShopCard";
import { ShopCardSkeleton } from "../../../../features/Stores/components/ShopCard/Skeleton";
import { FeaturedShopCard } from "../../../../features/Stores/components/FeaturedShopCard";
import { FeaturedShopCardSkeleton } from "../../../../features/Stores/components/FeaturedShopCard/Skeleton";
import { shopsSectionStyles } from "./styledcomponents";

interface Shop {
  id: string;
  name: string;
  [key: string]: any;
}

interface ShopsSectionProps {
  shops: Shop[];
  featuredShops: Shop[];
  searchQuery: string;
  isLoading: boolean;
  isError: boolean;
  onShopPress: (shopId: string, searchQuery: string) => void;
  onFeaturedShopPress: (shopId: string) => void;
  onRetry: () => void;
}

export const ShopsSection: React.FC<ShopsSectionProps> = ({
  shops,
  featuredShops,
  searchQuery,
  isLoading,
  isError,
  onShopPress,
  onFeaturedShopPress,
  onRetry,
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  // If search query exists, return empty (handled by search results section)
  if (searchQuery.trim()) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={shopsSectionStyles.loadingContainer}>
        {/* Featured Loading */}
        <Text
          style={[
            theme.textPresets.bodyLarge,
            shopsSectionStyles.gridTitle,
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
          contentContainerStyle={shopsSectionStyles.loadingScrollView}
        >
          {[1, 2, 3].map((i) => (
            <FeaturedShopCardSkeleton key={i} />
          ))}
        </ScrollView>

        {/* Shops Near You Loading */}
        <View style={shopsSectionStyles.loadingNearYouSection}>
          <Text
            style={[
              theme.textPresets.bodyLarge,
              shopsSectionStyles.gridTitle,
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

  // Error state
  if (isError) {
    return (
      <View style={shopsSectionStyles.errorContainer}>
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
          onPress={onRetry}
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

  // No shops state
  if (shops.length === 0) {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 32,
          marginTop: 20,
        }}
      >
        <Text
          style={[
            theme.textPresets.bodyLarge,
            shopsSectionStyles.gridTitle,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
              marginBottom: 16,
            },
          ]}
        >
          Shops Near You
        </Text>
        <View style={shopsSectionStyles.emptyStateContainer}>
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

  // Main content
  return (
    <View style={shopsSectionStyles.container}>
      {/* Featured Shops Section */}
      {/* {featuredShops.length > 0 && (
        <View style={shopsSectionStyles.featuredSection}>
          <View
            style={[
              shopsSectionStyles.sectionHeaderRow,
              { paddingHorizontal: 20 },
            ]}
          >
            <View
              style={[
                shopsSectionStyles.sectionIconBadge,
                { backgroundColor: 'rgba(225, 29, 72, 0.1)' },
              ]}
            >
              <Ionicons name="flame" size={16} color="#E11D48" />
            </View>
            <Text
              style={[
                shopsSectionStyles.gridTitle,
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
            contentContainerStyle={shopsSectionStyles.featuredScrollView}
          >
            {featuredShops.map((shop) => (
              <FeaturedShopCard
                key={shop.id}
                shop={shop}
                onPress={() => onFeaturedShopPress(shop.id)}
              />
            ))}
          </ScrollView>
        </View>
      )} */}

      {/* Shops Near You Section */}
      <View style={shopsSectionStyles.nearYouSection}>
        <View style={[shopsSectionStyles.sectionHeaderRow, { marginTop: 12 }]}>
          <View
            style={[
              shopsSectionStyles.sectionIconBadge,
              { backgroundColor: "rgba(16, 185, 129, 0.1)" },
            ]}
          >
            <Ionicons name="storefront" size={16} color="#16A34A" />
          </View>
          <Text
            style={[
              shopsSectionStyles.gridTitle,
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
              shopsSectionStyles.sectionCountBadge,
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
              {shops.length}
            </Text>
          </View>
        </View>

        {/* Shop Cards List */}
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onPress={() => onShopPress(shop.id, searchQuery)}
            style={shopsSectionStyles.shopCardContainer}
          />
        ))}
      </View>
    </View>
  );
};

export default ShopsSection;
