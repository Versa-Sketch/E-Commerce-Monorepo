import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Animated } from 'react-native';
import { observer } from 'mobx-react-lite';
import { router } from 'expo-router';
import {
  Building2, Bell, CreditCard, FileText, HelpCircle, LogOut,
  Settings, ShieldCheck, LayoutGrid, ChevronRight, MapPin, Home, Briefcase, Star,
} from 'lucide-react-native';
import { useStores } from '../../Common/hooks/useStores';
import { Colors } from '../../theme/colors';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { Badge, Card, ScreenHeader } from '../../components/ui/MerchantPrimitives';
import { apiRequest } from '../../Common/services/http';
import { AUTH_ENDPOINTS } from '../../Auth/Constants/api';
import styles from './styles';

interface Address {
  id: string;
  address_line1: string;
  address_line2: string | null;
  state: string;
  pincode: string;
  address_type: 'HOME' | 'WORK' | 'OTHER';
  is_default: boolean;
}

const ADDRESS_TYPE_ICON: Record<string, React.ComponentType<any>> = {
  HOME: Home,
  WORK: Briefcase,
  OTHER: MapPin,
};

function AddressSkeleton() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.addressRow, { opacity: pulse, borderBottomWidth: 0, gap: 12 }]}>
      <View style={[styles.addressIconCircle, { backgroundColor: '#E2E8F0', borderWidth: 0 }]} />
      <View style={[styles.addressMeta, { gap: 6, flex: 1 }]}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={{ width: 60, height: 12, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
          <View style={{ width: 50, height: 12, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
        </View>
        <View style={{ width: '80%', height: 10, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
        <View style={{ width: '60%', height: 10, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
      </View>
    </Animated.View>
  );
}

export default observer(function MoreScreen() {
  const { authStore, sessionStore } = useStores();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);

  useEffect(() => {
    void authStore.fetchProfile();
    if (!sessionStore.accessToken) { setAddressLoading(false); return; }
    apiRequest<Address[]>(AUTH_ENDPOINTS.ADDRESSES, { token: sessionStore.accessToken })
      .then(res => {
        if (res.ok) setAddresses(res.data);
      })
      .finally(() => setAddressLoading(false));
  }, [sessionStore.accessToken]);

  const settings = [
    { title: 'Store Profile', subtitle: 'Logo, address, public store details', icon: Building2, route: '/settings' },
    { title: 'Edit Shop Types', subtitle: 'Update the categories your shop sells', icon: LayoutGrid, route: '/edit-shop-types' },
    { title: 'Business Settings', subtitle: 'Hours, delivery radius, order rules', icon: Settings, route: '/settings' },
    { title: 'Payout Settings', subtitle: 'Bank account and settlement schedule', icon: CreditCard, route: '/payments' },
    { title: 'Notifications', subtitle: 'Order, bargain, stock, and payout alerts', icon: Bell, route: '/settings' },
    { title: 'Support', subtitle: 'Help center and support conversations', icon: HelpCircle, route: '/support' },
    { title: 'Policies', subtitle: 'Returns, tax, privacy, and merchant terms', icon: FileText, route: '/settings' },
  ];

  return (
    <AnimatedScreen style={styles.container}>
      <ScreenHeader title="More" subtitle="Account and store settings" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <Image source={{ uri: authStore.logo }} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.storeName}>{authStore.storeName}</Text>
            <Text style={styles.storeType}>{authStore.storeType} · Bengaluru</Text>
            <View style={styles.badges}>
              <Badge label="Open Now" tone="success" />
              <Badge label="Verified" tone="primary" />
            </View>
          </View>
        </Card>

        {sessionStore.user && (
          <Card style={styles.accountCard}>
            <Text style={styles.accountName}>{sessionStore.user.full_name}</Text>
            <Text style={styles.accountPhone}>{sessionStore.user.phone_number}</Text>
            <View style={styles.badges}>
              <Badge label={sessionStore.user.role.replace(/_/g, ' ')} tone="primary" />
              {sessionStore.user.is_verified && <Badge label="Verified" tone="success" />}
            </View>
          </Card>
        )}

        {/* ── Shop Addresses ─────────────────────────────────────────────── */}
        <View style={styles.addressSection}>
          <View style={styles.addressSectionHeader}>
            <MapPin size={15} color={Colors.primary} />
            <Text style={styles.addressSectionTitle}>Shop Addresses</Text>
          </View>

          {addressLoading ? (
            <View style={{ gap: 8 }}>
              <AddressSkeleton />
              <AddressSkeleton />
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.addressEmptyRow}>
              <MapPin size={20} color={Colors.textMuted} />
              <Text style={styles.addressEmptyText}>No addresses saved</Text>
            </View>
          ) : (
            addresses.map((addr, i) => {
              const TypeIcon = ADDRESS_TYPE_ICON[addr.address_type] ?? MapPin;
              const isLast = i === addresses.length - 1;
              return (
                <View
                  key={addr.id}
                  style={[styles.addressRow, isLast && styles.addressRowLast]}
                >
                  <View style={styles.addressIconCircle}>
                    <TypeIcon size={15} color={Colors.primary} />
                  </View>
                  <View style={styles.addressMeta}>
                    <View style={styles.addressTopRow}>
                      <Text style={styles.addressType}>{addr.address_type}</Text>
                      {addr.is_default && (
                        <View style={styles.defaultPill}>
                          <Star size={9} color={Colors.primary} fill={Colors.primary} />
                          <Text style={styles.defaultPillText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addressLine1}>{addr.address_line1}</Text>
                    {addr.address_line2 ? (
                      <Text style={styles.addressLine2}>{addr.address_line2}</Text>
                    ) : null}
                    <Text style={styles.addressLine2}>{addr.state} · {addr.pincode}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.trustBanner}>
          <ShieldCheck size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.trustTitle}>Merchant account in good standing</Text>
            <Text style={styles.trustSub}>Payouts active · Policy checks complete · Catalog live</Text>
          </View>
        </View>

        <View style={styles.settingsGroup}>
          {settings.map(({ title, subtitle, icon: Icon, route }, index) => (
            <TouchableOpacity
              key={title}
              style={[styles.settingRow, index === settings.length - 1 && styles.settingRowLast]}
              activeOpacity={0.7}
              onPress={() => router.push(route as any)}
            >
              <View style={styles.settingIcon}>
                <Icon size={17} color={Colors.primary} />
              </View>
              <View style={styles.settingMeta}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSub}>{subtitle}</Text>
              </View>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.75}
          onPress={() => {
            Alert.alert(
              'Logout',
              'You will be signed out of your merchant account.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: () => {
                    sessionStore.logout();
                    router.replace('/(auth)/welcome');
                  },
                },
              ]
            );
          }}
        >
          <LogOut size={17} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </AnimatedScreen>
  );
});
