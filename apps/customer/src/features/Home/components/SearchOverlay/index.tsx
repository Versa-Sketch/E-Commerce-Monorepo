import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  overlayContainer,
  overlayHeader,
  headerTitle,
  closeButton,
  searchInputContainer,
  searchInputStyle,
  resultsContainer,
  resultItem,
  resultText,
  emptyStateContainer,
  emptyStateText,
} from './styledcomponents';

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (text: string) => void;
  results: any[];
  onResultPress?: (item: any) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  visible,
  onClose,
  searchValue,
  onSearchChange,
  results,
  onResultPress,
}) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent={false} onRequestClose={onClose}>
      <View style={[overlayContainer, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[overlayHeader, { borderBottomColor: theme.colors.border }]}>
          <TextInput
            style={[searchInputStyle, { color: theme.colors.textPrimary }]}
            placeholder="Search..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchValue}
            onChangeText={onSearchChange}
            autoFocus
          />
          <Pressable style={closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </Pressable>
        </View>

        {/* Results */}
        <View style={[resultsContainer, { backgroundColor: theme.colors.background }]}>
          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[resultItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => onResultPress?.(item)}
                >
                  <Text style={[resultText, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                </Pressable>
              )}
            />
          ) : searchValue ? (
            <View style={emptyStateContainer}>
              <Text style={[emptyStateText, { color: theme.colors.textSecondary }]}>
                No results found
              </Text>
            </View>
          ) : (
            <View style={emptyStateContainer}>
              <Text style={[emptyStateText, { color: theme.colors.textSecondary }]}>
                Start typing to search
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SearchOverlay;
