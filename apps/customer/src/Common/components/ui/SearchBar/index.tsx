import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { Input } from '../Input';
import { containerStyle, filterButtonStyle } from './styledcomponents';
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  style?: ViewStyle;
  inputContainerStyle?: ViewStyle;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search nearby stores, products, medicines...',
  onFilterPress,
  style,
  inputContainerStyle,
}) => {
  const { theme } = useTheme();
  const handleClear = () => onChangeText('');
  const renderFilterButton = () => (
    <Pressable
      onPress={onFilterPress}
      style={[filterButtonStyle, { backgroundColor: theme.colors.primary, borderRadius: 12 }]}
    >
      <Ionicons name="options-outline" size={18} color={theme.colors.surface} />
    </Pressable>
  );
  return (
    <View style={[containerStyle, style]}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon="search"
        onClear={handleClear}
        inputStyle={{ fontSize: 14 }}
        style={{ flex: 1 }}
        containerStyle={{
          height: 56,
          borderRadius: 20,
          shadowColor: 'rgba(0, 60, 70, 0.08)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 3,
          ...inputContainerStyle,
        }}
        rightIcon={onFilterPress ? renderFilterButton() : undefined}
      />
    </View>
  );
};
export default SearchBar;
