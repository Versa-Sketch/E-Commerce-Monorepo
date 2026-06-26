import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { SEARCH_PLACEHOLDERS } from '../../Constants';
import { searchBarStyles } from './styledcomponents';

interface SearchBarProps {
  placeholderIndex: number;
  placeholderOpacity: SharedValue<number>;
  placeholderTranslateY: SharedValue<number>;
  onPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholderIndex,
  placeholderOpacity,
  placeholderTranslateY,
  onPress,
}) => {
  const { theme, isDark } = useTheme();

  const placeholderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
    transform: [{ translateY: placeholderTranslateY.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[searchBarStyles.searchBarOuterWrapper, { paddingHorizontal: 20 }]}
    >
      <View
        style={[
          searchBarStyles.searchBarInnerWrapper,
          {
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(75, 85, 99, 0.4)' : '#F3F4F6',
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color="#16A34A"
          style={{ marginLeft: 12, marginRight: 8 }}
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.Text
            numberOfLines={1}
            pointerEvents="none"
            style={[
              placeholderAnimatedStyle,
              searchBarStyles.searchPlaceholderText,
              { color: '#9CA3AF', fontFamily: theme.typography.fonts.medium },
            ]}
          >
            {SEARCH_PLACEHOLDERS[placeholderIndex]}
          </Animated.Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SearchBar;
