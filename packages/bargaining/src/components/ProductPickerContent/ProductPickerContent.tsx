import React from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import type { BargainProduct } from '../../types/product';
import { ProductPickerTile } from '../ProductPickerTile';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createProductPickerContentStyles } from './styles';

export interface ProductPickerContentProps {
  products: BargainProduct[];
  onSelectProduct: (product: BargainProduct) => void;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  emptyLabel?: string;
}

/**
 * The picker's content only — no Modal/sheet wrapper. Each host app presents this
 * inside whatever bottom sheet it already uses (its own categories sheet, @gorhom/bottom-sheet, etc.).
 */
export const ProductPickerContent: React.FC<ProductPickerContentProps> = ({
  products,
  onSelectProduct,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search the seller's catalogue",
  categories,
  selectedCategory,
  onSelectCategory,
  emptyLabel = 'No products found',
}) => {
  const theme = useBargainTheme();
  const styles = createProductPickerContentStyles(theme);

  return (
    <View style={styles.container}>
      {onSearchChange ? (
        <View style={styles.searchRow}>
          <Search size={14} color={theme.colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>
      ) : null}

      {categories && categories.length > 0 ? (
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          renderItem={({ item }) => {
            const active = item === selectedCategory;
            return (
              <Pressable
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => onSelectCategory?.(item)}
              >
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{item}</Text>
              </Pressable>
            );
          }}
        />
      ) : null}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <ProductPickerTile product={item} onPress={onSelectProduct} />}
        ListEmptyComponent={<Text style={styles.emptyText}>{emptyLabel}</Text>}
      />
    </View>
  );
};
