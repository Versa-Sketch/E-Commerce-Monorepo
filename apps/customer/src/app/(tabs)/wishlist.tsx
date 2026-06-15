import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../Common/components/ui/EmptyState';
import { useTheme } from '../../theme/ThemeContext';
export default function WishlistScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[theme.textPresets.h2, { color: theme.colors.textPrimary }]}>
          Your Wishlist
        </Text>
      </View>
      <View style={styles.content}>
        <EmptyState
          title="Wishlist is empty"
          description="Save your favorite daily groceries, items, and fashion apparel here to grab them later."
          iconName="heart-outline"
          actionLabel="Explore Stores"
          onActionPress={() => router.push('/(tabs)')}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
