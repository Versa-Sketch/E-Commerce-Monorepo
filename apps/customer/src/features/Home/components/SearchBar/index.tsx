import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { searchBarContainer, searchInputStyle } from './styledcomponents';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  placeholder = 'Search stores, products...',
}) => {
  const { theme } = useTheme();

  return (
    <View style={[searchBarContainer, { backgroundColor: theme.colors.surface }]}>
      <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={{ marginRight: 12 }} />
      <TextInput
        style={[searchInputStyle, { color: theme.colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SearchBar;
