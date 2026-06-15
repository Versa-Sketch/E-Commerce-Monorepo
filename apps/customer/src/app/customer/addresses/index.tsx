import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../Common/components/ui/Badge';
import { Button } from '../../../Common/components/ui/Button';
import { EmptyState } from '../../../Common/components/ui/EmptyState';
import { LoadingWrapper } from '../../../Common/components/ui/LoadingWrapper';
import { useAddressStore } from '../../../features/Addresses/Providers/useAddressStore';
import { AddressApi, AddressType } from '../../../types/shared';
import { useTheme } from '../../../theme/ThemeContext';

const ICON_BY_TYPE: Record<AddressType, keyof typeof Ionicons.glyphMap> = {
  HOME: 'home-outline',
  WORK: 'briefcase-outline',
  SHOP: 'storefront-outline',
  OTHER: 'location-outline',
};

export default observer(function AddressesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const addressStore = useAddressStore();

  useEffect(() => {
    addressStore.fetchAddresses();
  }, []);

  const handleSetDefault = (address: AddressApi) => {
    addressStore.setDefaultAddress(address.id);
  };

  const handleEdit = (address: AddressApi) => {
    router.push(`/customer/addresses/form?id=${address.id}`);
  };

  const handleDelete = (address: AddressApi) => {
    Alert.alert(
      'Delete address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => addressStore.deleteAddress(address.id),
        },
      ]
    );
  };

  const renderAddressCard = (address: AddressApi) => (
    <View
      key={address.id}
      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconFrame, { backgroundColor: theme.dark ? 'rgba(0, 109, 119, 0.15)' : 'rgba(0, 109, 119, 0.05)', borderRadius: theme.borderRadius.round }]}>
          <Ionicons name={ICON_BY_TYPE[address.address_type] ?? 'location-outline'} size={20} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.titleRow}>
            <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold, textTransform: 'capitalize' }]}>
              {address.address_type.toLowerCase()}
            </Text>
            {address.is_default && (
              <Badge label="Default" variant="success" size="sm" style={{ marginLeft: 8 }} />
            )}
          </View>
          <Text style={[theme.textPresets.bodySmall, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            {address.address_line1}
            {address.address_line2 ? `, ${address.address_line2}` : ''}
          </Text>
          <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
            {address.state} - {address.pincode}
          </Text>
        </View>
      </View>
      <View style={[styles.actionsRow, { borderTopColor: theme.colors.border }]}>
        {!address.is_default && (
          <Pressable style={styles.actionBtn} onPress={() => handleSetDefault(address)}>
            <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.primary} />
            <Text style={[theme.textPresets.label, { color: theme.colors.primary, marginLeft: 6 }]}>Set default</Text>
          </Pressable>
        )}
        <Pressable style={styles.actionBtn} onPress={() => handleEdit(address)}>
          <Ionicons name="create-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[theme.textPresets.label, { color: theme.colors.textSecondary, marginLeft: 6 }]}>Edit</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => handleDelete(address)}>
          <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
          <Text style={[theme.textPresets.label, { color: theme.colors.error, marginLeft: 6 }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {addressStore.addresses.length === 0 ? (
        <EmptyState
          title="No addresses yet"
          description="Add an address to get your orders delivered to the right place."
          iconName="location-outline"
        />
      ) : (
        addressStore.addresses.map(renderAddressCard)
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[theme.textPresets.bodyLarge, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }]}>
          My Addresses
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>
      <LoadingWrapper
        apiStatus={addressStore.fetchStatus}
        error={addressStore.error}
        retry={addressStore.fetchAddresses}
        renderSuccessUI={renderContent}
      />
      <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <Button
          label="Add new address"
          onPress={() => router.push('/customer/addresses/form')}
          leftIcon={<Ionicons name="add" size={18} color={theme.colors.surface} />}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12, borderBottomWidth: 1.5 },
  backBtn: { padding: 4 },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  card: { borderWidth: 1.5, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  iconFrame: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  actionsRow: { flexDirection: 'row', borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  footer: { padding: 16, borderTopWidth: 1.5, paddingBottom: 32 },
});
