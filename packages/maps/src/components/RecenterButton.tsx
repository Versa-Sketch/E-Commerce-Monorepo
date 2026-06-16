import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export interface RecenterButtonProps {
  onPress: () => void;
  label?: string;
  color?: string;
  loading?: boolean;
  style?: { bottom?: number; right?: number };
}

export function RecenterButton({ onPress, loading, style, color = '#16A34A' }: RecenterButtonProps) {
  return (
    <View
      style={[styles.wrapper, style?.bottom !== undefined && { bottom: style.bottom }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={onPress}
        disabled={loading}
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={color} style={{ width: 18, height: 18 }} />
        ) : (
          <Ionicons name="locate" size={18} color={color} />
        )}
        <Text style={[styles.text, { color }]}>Use current location</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pillPressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
