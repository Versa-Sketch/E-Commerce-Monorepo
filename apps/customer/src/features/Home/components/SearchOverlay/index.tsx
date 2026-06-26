import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { SEARCH_PLACEHOLDERS } from '../../Constants';
import { Chip } from '../../../../Common/components/ui/Chip';
import { ShopCard } from '../../../../features/Stores/components/ShopCard';
import { ShopCardSkeleton } from '../../../../features/Stores/components/ShopCard/Skeleton';

interface GreenSearchHeaderProps {
  query: string;
  inputRef: React.RefObject<TextInput>;
  onChangeText: (text: string) => void;
  onClose: () => void;
}

const GreenSearchHeader: React.FC<GreenSearchHeaderProps> = ({
  query,
  inputRef,
  onChangeText,
  onClose,
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: '#16A34A', paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? 'rgba(31,41,55,0.95)' : '#FFFFFF',
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(75,85,99,0.4)' : '#F3F4F6',
          height: 46,
          shadowColor: '#16A34A',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 3,
          paddingRight: 5,
        }}
      >
        <Ionicons name="search" size={20} color="#16A34A" style={{ marginLeft: 12, marginRight: 8 }} />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeText}
          placeholder={SEARCH_PLACEHOLDERS[0]}
          placeholderTextColor="#9CA3AF"
          style={{
            flex: 1,
            fontSize: 14,
            color: theme.colors.textPrimary,
            paddingVertical: 0,
            fontFamily: theme.typography.fonts.medium,
          }}
        />
        <Pressable onPress={onClose} style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
          <Ionicons name="close" size={18} color="#9CA3AF" />
        </Pressable>
      </View>
    </View>
  );
};

interface SearchOverlayProps {
  isSearchActive: boolean;
  query: string;
  recentSearches: string[];
  searchResults: any[];
  isSearchPending: boolean;
  isSearchError: boolean;
  onRecentSearchPress: (query: string) => void;
  onTrendingSearchPress: (query: string) => void;
  onResultPress?: (shopId: string, query: string) => void;
  onClearRecent: () => void;
  onRemoveRecent: (item: string) => void;
  onRetry: (query: string) => void;
  onClose: () => void;
  onChangeText: (text: string) => void;
}

const trendingSearches = [
  'Organic Roma Tomatoes',
  'Hass Avocados',
  'Cotton Oversized Tee',
];

const popularSearches = ['Groceries', 'Pharmacy', 'Bakery', 'Electronics'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  query,
  recentSearches,
  searchResults,
  isSearchPending,
  isSearchError,
  onRecentSearchPress,
  onTrendingSearchPress,
  onResultPress,
  onClearRecent,
  onRemoveRecent,
  onRetry,
  onClose,
  onChangeText,
}) => {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  // Focus once on mount — not via autoFocus to avoid refocus on re-render
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const blurInput = () => inputRef.current?.blur();

  const isLoading = isSearchPending && searchResults.length === 0;
  const isError = !isSearchPending && isSearchError && searchResults.length === 0;
  const hasResults = searchResults.length > 0;
  const hasNoResults = !isLoading && !isError && query.trim() !== '' && !hasResults;

  const renderContent = () => {
    if (!query.trim()) {
      return (
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 20, paddingBottom: 40 }}>
            {recentSearches.length > 0 && (
              <View style={{ marginBottom: 4 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.fonts.bold,
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    }}
                  >
                    Recent Searches
                  </Text>
                  <Pressable onPress={onClearRecent}>
                    <Text style={{ color: '#16A34A', fontFamily: theme.typography.fonts.semiBold, fontSize: 13 }}>
                      Clear all
                    </Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 20 }}>
                  {recentSearches.map((item) => (
                    <View
                      key={`recent-${item}`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#ECFDF5',
                        borderRadius: 20,
                        paddingVertical: 7,
                        paddingLeft: 12,
                        paddingRight: 10,
                      }}
                    >
                      <Pressable onPress={() => onRecentSearchPress(item)}>
                        <Text style={{ color: '#065F46', fontFamily: theme.typography.fonts.medium, fontSize: 13, marginRight: 6 }}>
                          {item}
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => onRemoveRecent(item)} style={{ padding: 2 }}>
                        <Ionicons name="close" size={13} color="#059669" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 20, marginBottom: 20 }} />

            <View>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  paddingHorizontal: 20,
                  marginBottom: 4,
                }}
              >
                Trending Searches
              </Text>
              {trendingSearches.map((item, idx) => (
                <Pressable
                  key={`trending-${item}`}
                  onPress={() => onTrendingSearchPress(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 13,
                    borderBottomWidth: idx < trendingSearches.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: '#ECFDF5',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="trending-up" size={16} color="#16A34A" />
                  </View>
                  <Text style={{ flex: 1, color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium, fontSize: 14 }}>
                    {item}
                  </Text>
                  <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      );
    }

    if (isLoading) {
      return (
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            {[1, 2, 3].map((i) => (
              <ShopCardSkeleton key={i} style={{ marginBottom: 12 }} />
            ))}
          </View>
        </ScrollView>
      );
    }

    if (isError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Ionicons name="cloud-offline-outline" size={32} color={theme.colors.textSecondary} style={{ marginBottom: 12 }} />
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, marginBottom: 16 }}>
            Couldn't load results
          </Text>
          <Pressable
            onPress={() => onRetry(query)}
            style={{ paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, backgroundColor: '#ECFDF5' }}
          >
            <Text style={{ color: '#16A34A', fontFamily: theme.typography.fonts.semiBold }}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (hasNoResults) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <View
            style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: theme.colors.surfaceSecondary,
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}
          >
            <Ionicons name="sad-outline" size={28} color={theme.colors.textSecondary} />
          </View>
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 15, marginBottom: 4 }}>
            No results for "{query}"
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
            Check the spelling or try a different search.
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
            Popular Searches
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {popularSearches.map((item) => (
              <Chip key={item} label={item} onPress={() => onTrendingSearchPress(item)} />
            ))}
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, fontSize: 15, marginBottom: 4 }}>
            Results for "{query}"
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: 13, marginBottom: 16 }}>
            {searchResults.length} shop{searchResults.length === 1 ? '' : 's'} found
          </Text>
          {searchResults.map((shop) => {
            const matchedCategories = shop.matched_categories ?? [];
            const matchedSubcategories = shop.matched_subcategories ?? [];
            const hasChips = matchedCategories.length + matchedSubcategories.length > 0;
            return (
              <View key={shop.id} style={{ marginBottom: 16 }}>
                <ShopCard shop={shop} onPress={() => onResultPress?.(shop.id, query)} />
                {hasChips && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 8 }}>
                    {matchedCategories.map((c: any) => (
                      <Chip key={c.id} label={c.name} onPress={() => onTrendingSearchPress(c.name)} />
                    ))}
                    {matchedSubcategories.map((c: any) => (
                      <Chip key={c.id} label={c.name} onPress={() => onTrendingSearchPress(c.name)} />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={blurInput} accessible={false}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <GreenSearchHeader
          query={query}
          inputRef={inputRef}
          onChangeText={onChangeText}
          onClose={onClose}
        />
        {renderContent()}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchOverlay;
