import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../../../../theme/ThemeContext';
import { SEARCH_PLACEHOLDERS } from '../../Constants';

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
  const { theme } = useTheme();

  const placeholderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
    transform: [{ translateY: placeholderTranslateY.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 20,
        marginVertical: 8,
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 58,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        {/* Search Icon */}
        <Ionicons
          name="search-outline"
          size={22}
          color="#16A34A"
          style={{ marginRight: 10 }}
        />

        {/* Animated Placeholder Text */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.Text
            numberOfLines={1}
            pointerEvents="none"
            style={[
              placeholderAnimatedStyle,
              {
                color: '#9CA3AF',
                fontFamily: theme.typography.fonts.medium,
                fontSize: 14,
              },
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
