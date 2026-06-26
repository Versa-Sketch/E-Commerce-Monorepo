import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Skeleton } from '../../../../Common/components/ui/Skeleton';
import { API_STATUS } from '../../../../Common/Constants';
import { useTheme } from '../../../../theme/ThemeContext';
import { categoriesSectionStyles } from './styledcomponents';

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategory: string;
  categoryLoading: boolean;
  isLoading: boolean;
  isError: boolean;
  onCategorySelect: (categoryId: string) => void;
  onSeeAllPress: () => void;
  onRetry: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  categoryLoading,
  isLoading,
  isError,
  onCategorySelect,
  onSeeAllPress,
  onRetry,
}) => {
  const { theme } = useTheme();
  const categoriesScrollRef = useRef<ScrollView>(null);
  const categoryLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const categoriesScrollOffset = useRef(0);
  const categoriesScrollViewWidth = useRef(0);
  const hasInitializedUnderline = useRef(false);

  // Animated underline values
  const underlineX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  const underlineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
    width: underlineWidth.value,
  }));

  // Animate underline to follow selected category
  useEffect(() => {
    const layout = categoryLayouts.current[selectedCategory];
    if (!layout) return;

    if (hasInitializedUnderline.current) {
      underlineX.value = withTiming(layout.x, { duration: 150 });
      underlineWidth.value = withTiming(layout.width, { duration: 150 });
    } else {
      underlineX.value = layout.x;
      underlineWidth.value = layout.width;
      hasInitializedUnderline.current = true;
    }
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);

    // Auto-scroll to center the selected item
    const layout = categoryLayouts.current[categoryId];
    if (!layout || !categoriesScrollRef.current) return;

    const viewportWidth = categoriesScrollViewWidth.current;
    const centeredX = layout.x + layout.width / 2 - viewportWidth / 2;
    categoriesScrollRef.current.scrollTo({
      x: Math.max(0, centeredX),
      animated: true,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={categoriesSectionStyles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={categoriesSectionStyles.categoriesScroll}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={categoriesSectionStyles.categoryItem}>
              <Skeleton
                width={52}
                height={52}
                variant="circle"
                style={{ marginBottom: 8 }}
              />
              <Skeleton width={48} height={10} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View
        style={[
          categoriesSectionStyles.categoriesSection,
          {
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
        <Pressable onPress={onRetry}>
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

  // Show "all" category first, then first 9 other categories
  const visibleCategories = [
    { id: 'all', name: 'All', image: undefined },
    ...categories.slice(0, 9),
  ];

  return (
    <View style={categoriesSectionStyles.categoriesSection}>
      <ScrollView
        ref={categoriesScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={categoriesSectionStyles.categoriesScroll}
        scrollEventThrottle={16}
        onScroll={(e) => {
          categoriesScrollOffset.current = e.nativeEvent.contentOffset.x;
        }}
        onLayout={(e) => {
          categoriesScrollViewWidth.current = e.nativeEvent.layout.width;
        }}
      >
        {/* Category Items */}
        {visibleCategories.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => handleCategorySelect(item.id)}
              style={categoriesSectionStyles.categoryItem}
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
              {/* Category Image/Icon */}
              <View
                pointerEvents="none"
                style={[
                  categoriesSectionStyles.categoryImageContainer,
                  isSelected && categoriesSectionStyles.categoryImageSelected,
                ]}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={categoriesSectionStyles.categoryImage}
                  />
                ) : (
                  <View
                    pointerEvents="none"
                    style={categoriesSectionStyles.fallbackIconContainer}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={24}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                )}
              </View>

              {/* Category Name */}
              <Text
                numberOfLines={1}
                style={[
                  categoriesSectionStyles.categoryText,
                  {
                    color: isSelected ? '#16A34A' : theme.colors.textPrimary,
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

        {/* See All Button */}
        <Pressable
          onPress={onSeeAllPress}
          style={categoriesSectionStyles.categoryItem}
        >
          <View style={categoriesSectionStyles.seeAllCircle}>
            <Ionicons name="restaurant" size={24} color="#16A34A" />
          </View>
          <View style={categoriesSectionStyles.seeAllLabelRow}>
            <Text
              style={[
                categoriesSectionStyles.categoryText,
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
              color="#16A34A"
              style={{ marginLeft: 2, marginTop: 1 }}
            />
          </View>
        </Pressable>

        {/* Animated Underline */}
        <Animated.View
          pointerEvents="none"
          style={[categoriesSectionStyles.categoryUnderline, underlineAnimatedStyle]}
        />
      </ScrollView>
    </View>
  );
};

export default CategoriesSection;
