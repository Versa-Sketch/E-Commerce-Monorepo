import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  gridIconFrameStyle,
  gridItemCardStyle,
  gridItemLabelStyle,
  menuGridContainerStyle,
} from './styledcomponents';
interface MenuItem {
  title: string;
  icon: string;
  onPress: () => void;
}
interface MenuGridProps {
  items: readonly MenuItem[];
}
export const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  const { theme } = useTheme();
  return (
    <View style={menuGridContainerStyle}>
      {items.map((item, idx) => (
        <Pressable
          key={idx}
          onPress={item.onPress}
          style={[gridItemCardStyle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <View style={[gridIconFrameStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
          </View>
          <Text numberOfLines={1} style={[theme.textPresets.caption, gridItemLabelStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}>
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
export default MenuGrid;
