import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { BottomSheet } from '../../../Common/components/ui/BottomSheet';
import { useTheme } from '../../../theme/ThemeContext';

interface LocationPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectUsingMaps: () => void;
}

export function LocationPickerSheet({ visible, onClose, onSelectUsingMaps }: LocationPickerSheetProps) {
  const { theme } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Set Location" height={180}>
      <Pressable
        onPress={onSelectUsingMaps}
        style={[styles.option, { backgroundColor: theme.colors.surfaceSecondary, borderRadius: theme.borderRadius.md }]}
      >
        <Ionicons name="map-outline" size={20} color={theme.colors.primary} />
        <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, marginLeft: 12, fontFamily: theme.typography.fonts.semiBold }]}>
          Select using Maps
        </Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
