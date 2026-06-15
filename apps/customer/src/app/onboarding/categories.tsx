import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect, G, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useProfileStore } from '../../features/Profile/Providers/useProfileStore';
import { useStoresStore } from '../../features/Stores/Providers/useStoresStore';
import { useTheme } from '../../theme/ThemeContext';
import { StoreCategory } from '../../types/shared';
const { width: W } = Dimensions.get('window');
const CARD_WIDTH = (W - 32 - 16) / 3;
const BasketIllustration = () => (
  <Svg width="150" height="150" viewBox="0 0 150 150">
    {}
    <Circle cx="75" cy="82" r="58" fill="#ECFDF5" opacity="0.9" />
    {}
    <Path d="M 18 38 H 22 M 20 36 V 40" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
    <Path d="M 128 55 H 132 M 130 53 V 57" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="132" cy="32" r="3" fill="#BBF7D0" />
    <Circle cx="14" cy="100" r="2.5" fill="#A7F3D0" />
    {}
    <Rect x="28" y="78" width="94" height="54" rx="10" fill="#16A34A" />
    {}
    <Path d="M 28 90 H 122" stroke="#15803D" strokeWidth="1" opacity="0.5" />
    <Path d="M 28 102 H 122" stroke="#15803D" strokeWidth="1" opacity="0.5" />
    <Path d="M 28 114 H 122" stroke="#15803D" strokeWidth="1" opacity="0.5" />
    <Path d="M 50 78 V 132" stroke="#15803D" strokeWidth="1" opacity="0.4" />
    <Path d="M 75 78 V 132" stroke="#15803D" strokeWidth="1" opacity="0.4" />
    <Path d="M 100 78 V 132" stroke="#15803D" strokeWidth="1" opacity="0.4" />
    {}
    <Circle cx="75" cy="108" r="12" fill="#FFFFFF" opacity="0.2" />
    <Path d="M 75 100 C 70 100, 67 104, 67 108 C 67 113, 75 120, 75 120 C 75 120, 83 113, 83 108 C 83 104, 80 100, 75 100 Z" fill="#FFFFFF" />
    <Circle cx="75" cy="108" r="3.5" fill="#16A34A" />
    {}
    <Path d="M 46 78 C 46 58, 60 50, 75 50 C 90 50, 104 58, 104 78" fill="none" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
    {}
    <Rect x="35" y="52" width="10" height="32" rx="5" fill="#F59E0B" />
    <Path d="M 35 64 Q 30 60, 33 55 Q 38 58, 45 56" fill="#D97706" />
    {}
    <Circle cx="55" cy="70" r="12" fill="#EF4444" />
    <Path d="M 55 58 C 55 58, 57 52, 62 54" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <Path d="M 55 58 C 55 58, 53 52, 48 54" fill="none" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
    {}
    <Rect x="68" y="42" width="12" height="38" rx="5" fill="#BAE6FD" />
    <Rect x="70" y="38" width="8" height="8" rx="3" fill="#7DD3FC" />
    <Rect x="69" y="54" width="10" height="2" rx="1" fill="#7DD3FC" opacity="0.6" />
    {}
    <Ellipse cx="96" cy="66" rx="10" ry="13" fill="#FCD34D" />
    <Path d="M 96 53 C 96 53, 98 47, 102 49" fill="none" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
    {}
    <Path d="M 110 60 C 118 50, 130 54, 126 64 C 120 60, 114 62, 112 68 Z" fill="#4ADE80" />
    <Path d="M 110 60 L 116 66" stroke="#16A34A" strokeWidth="1" strokeLinecap="round" />
  </Svg>
);
const DailyEssentialsIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 64 64">
    <Rect x="10" y="28" width="44" height="30" rx="8" fill="#16A34A" />
    <Path d="M 18 28 C 18 16, 46 16, 46 28" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
    <Circle cx="20" cy="24" r="5" fill="#FCA5A5" />
    <Circle cx="44" cy="22" r="4" fill="#FCD34D" />
    <Path d="M 10 36 H 54" stroke="#15803D" strokeWidth="1.5" opacity="0.4" />
    <Path d="M 10 44 H 54" stroke="#15803D" strokeWidth="1.5" opacity="0.4" />
    <Path d="M 32 28 V 58" stroke="#15803D" strokeWidth="1.5" opacity="0.3" />
    <Circle cx="32" cy="46" r="8" fill="#FFFFFF" opacity="0.15" />
    <Path d="M 32 40 C 28 40, 25 43, 25 46 C 25 50, 32 55, 32 55 C 32 55, 39 50, 39 46 C 39 43, 36 40, 32 40 Z" fill="#FFFFFF" opacity="0.9" />
    <Circle cx="32" cy="46" r="3" fill="#16A34A" />
  </Svg>
);
const FoodDiningIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 64 64">
    {}
    <Path d="M 12 34 C 12 20, 52 20, 52 34 Z" fill="#F472B6" />
    <Rect x="10" y="34" width="44" height="6" rx="3" fill="#EC4899" />
    {}
    <Ellipse cx="32" cy="44" rx="22" ry="6" fill="#FBCFE8" />
    <Ellipse cx="32" cy="43" rx="18" ry="4" fill="#FFFFFF" />
    {}
    <Rect x="28" y="14" width="8" height="8" rx="4" fill="#F472B6" />
    <Rect x="30" y="18" width="4" height="4" rx="2" fill="#EC4899" />
    {}
    <Path d="M 32 26 C 32 26, 28 22, 26 24 C 24 26, 26 30, 32 34 C 38 30, 40 26, 38 24 C 36 22, 32 26, 32 26 Z" fill="#FFFFFF" opacity="0.9" />
  </Svg>
);
const FashionIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 64 64">
    {}
    <Path d="M 32 10 C 32 10, 40 10, 40 16 C 40 20, 36 22, 32 22" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M 32 22 L 8 36 L 13 42 L 20 38 L 20 56 H 44 L 44 38 L 51 42 L 56 36 L 32 22 Z" fill="#FCD34D" />
    <Path d="M 20 44 H 44" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
    <Path d="M 20 50 H 44" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
    {}
    <Rect x="38" y="46" width="10" height="14" rx="3" fill="#16A34A" />
    <Circle cx="43" cy="50" r="2" fill="#FFFFFF" />
    <Path d="M 40 54 H 46" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <Path d="M 40 57 H 46" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </Svg>
);
const GeneralStoreIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 64 64">
    {}
    <Path d="M 8 28 L 32 16 L 56 28 Z" fill="#60A5FA" />
    <Path d="M 8 28 H 56" stroke="#3B82F6" strokeWidth="1.5" />
    {}
    <Path d="M 20 28 L 26 18" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
    <Path d="M 32 28 L 32 16" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
    <Path d="M 44 28 L 38 18" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
    {}
    <Rect x="10" y="28" width="44" height="28" rx="4" fill="#DBEAFE" />
    <Rect x="10" y="28" width="44" height="28" rx="4" fill="none" stroke="#BFDBFE" strokeWidth="1" />
    {}
    <Rect x="26" y="40" width="12" height="16" rx="3" fill="#3B82F6" />
    <Circle cx="36" cy="48" r="1.5" fill="#FFFFFF" />
    {}
    <Rect x="13" y="32" width="10" height="8" rx="2" fill="#93C5FD" />
    <Rect x="41" y="32" width="10" height="8" rx="2" fill="#93C5FD" />
    {}
    <Path d="M 18 32 V 40 M 13 36 H 23" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
    <Path d="M 46 32 V 40 M 41 36 H 51" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
  </Svg>
);
const MedicinesIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 64 64">
    {}
    <Rect x="22" y="18" width="20" height="36" rx="6" fill="#A855F7" />
    <Rect x="26" y="12" width="12" height="8" rx="3" fill="#7C3AED" />
    <Rect x="22" y="28" width="20" height="2" rx="1" fill="#7C3AED" opacity="0.4" />
    {}
    <Rect x="29" y="34" width="6" height="10" rx="2" fill="#FFFFFF" />
    <Rect x="26" y="37" width="12" height="4" rx="2" fill="#FFFFFF" />
    {}
    <G transform="translate(40, 44) rotate(-30)">
      <Rect x="-12" y="-5" width="12" height="10" rx="5" fill="#EF4444" />
      <Rect x="0" y="-5" width="12" height="10" rx="5" fill="#FFFFFF" />
      <Path d="M 0 -5 V 5" stroke="#E5E7EB" strokeWidth="0.5" />
    </G>
    <G transform="translate(44, 54) rotate(15)">
      <Rect x="-10" y="-4" width="10" height="8" rx="4" fill="#F97316" />
      <Rect x="0" y="-4" width="10" height="8" rx="4" fill="#FFFFFF" />
    </G>
  </Svg>
);
const MoreCategoriesIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 64 64">
    <Rect x="10" y="10" width="18" height="18" rx="6" fill="#374151" />
    <Rect x="36" y="10" width="18" height="18" rx="6" fill="#16A34A" />
    <Rect x="10" y="36" width="18" height="18" rx="6" fill="#16A34A" />
    <Rect x="36" y="36" width="18" height="18" rx="6" fill="#6B7280" />
  </Svg>
);
const RadarVisual = () => (
  <Svg width="60" height="60" viewBox="0 0 60 60">
    <Circle cx="30" cy="30" r="28" fill="none" stroke="#D1FAE5" strokeWidth="1.5" strokeDasharray="3 3" />
    <Circle cx="30" cy="30" r="20" fill="none" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="3 3" />
    <Circle cx="30" cy="30" r="12" fill="#ECFDF5" />
    <Circle cx="30" cy="30" r="6" fill="#D1FAE5" />
    <Path d="M 30 22 C 26 22, 23 25, 23 29 C 23 34, 30 40, 30 40 C 30 40, 37 34, 37 29 C 37 25, 34 22, 30 22 Z" fill="#16A34A" />
    <Circle cx="30" cy="29" r="3.5" fill="#FFFFFF" />
  </Svg>
);
const CATEGORIES = [
  {
    id: 'daily_amenities' as StoreCategory,
    name: 'Daily Essentials',
    desc: 'Groceries, fruits, veggies & daily needs',
    bg: '#ECFDF5',
    arrowColor: '#16A34A',
    Icon: DailyEssentialsIcon,
  },
  {
    id: 'food' as StoreCategory,
    name: 'Food & Dining',
    desc: 'Restaurants, meals & more',
    bg: '#FDF2F8',
    arrowColor: '#EC4899',
    Icon: FoodDiningIcon,
  },
  {
    id: 'fashion' as StoreCategory,
    name: 'Fashion',
    desc: 'Clothing, footwear & accessories',
    bg: '#FFFBEB',
    arrowColor: '#D97706',
    Icon: FashionIcon,
  },
  {
    id: 'general_store' as StoreCategory,
    name: 'General Store',
    desc: 'Household, stationery & essentials',
    bg: '#EFF6FF',
    arrowColor: '#3B82F6',
    Icon: GeneralStoreIcon,
  },
  {
    id: 'pharmacy' as StoreCategory,
    name: 'Medicines',
    desc: 'Health essentials & personal care',
    bg: '#F5F3FF',
    arrowColor: '#7C3AED',
    Icon: MedicinesIcon,
  },
  {
    id: 'others' as StoreCategory,
    name: 'More Categories',
    desc: 'Explore more options',
    bg: '#F9FAFB',
    arrowColor: '#6B7280',
    Icon: MoreCategoriesIcon,
  },
];
export default observer(function OnboardingCategories() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const storesStore = useStoresStore();
  const profileStore = useProfileStore();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);
  const activeAddress = profileStore.selectedAddress;
  const addresses = profileStore.addresses;
  const handleCategoryPress = (catId: StoreCategory) => {
    storesStore.setSelectedCategory(catId);
    if (!profileStore.isLocationConfirmed) {
      sheetRef.current?.present();
    } else {
      router.replace('/(tabs)');
    }
  };
  const handleAddressSelect = async (addr: any) => {
    profileStore.setSelectedAddress(addr);
    profileStore.setLocationConfirmed(true);
    sheetRef.current?.dismiss();
    router.replace('/(tabs)');
  };
  const handleSkipAddress = () => {
    profileStore.setLocationConfirmed(true);
    sheetRef.current?.dismiss();
    router.replace('/(tabs)');
  };
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <Pressable onPress={handleSkipAddress} style={styles.topBarSkipBtn}>
            <Text style={[styles.topBarSkipText, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>
              Skip
            </Text>
          </Pressable>
          <Pressable style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color="#111827" />
            <View style={styles.bellDot} />
          </Pressable>
        </View>
        {/* ── Hero ── */}
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={[styles.heroLine1, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>
              Welcome to
            </Text>
            <View style={styles.heroLine2Row}>
              <Text style={[styles.heroGreen, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>
                Localio!
              </Text>
              {/* Spark lines next to Localio */}
              <Svg width="28" height="24" viewBox="0 0 28 24" style={{ marginLeft: 4, marginTop: 4 }}>
                <Path d="M 4 18 L 10 6" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
                <Path d="M 14 20 L 18 10" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 22 16 L 26 8" stroke="#BBF7D0" strokeWidth="1.5" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.heroSub, { fontFamily: theme.typography.fonts.inter500Medium }]}>
              What are you shopping for today?
            </Text>
          </View>
          <BasketIllustration />
        </View>
        {/* ── Location card ── */}
        <View style={styles.locationCard}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIconBg}>
              <Ionicons name="location" size={18} color="#16A34A" />
            </View>
            <Text style={[styles.locationText, { fontFamily: theme.typography.fonts.inter500Medium }]}>
              We'll list the best nearby stores within a{' '}
              <Text style={[styles.locationHighlight, { fontFamily: theme.typography.fonts.inter700Bold }]}>
                6 km radius
              </Text>
              {' '}from your delivery address.
            </Text>
          </View>
          <RadarVisual />
        </View>
        {/* ── Category grid ── */}
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryPress(cat.id)}
              style={[styles.catCard, { backgroundColor: cat.bg }]}
            >
              <cat.Icon />
              <Text
                numberOfLines={2}
                style={[styles.catName, { fontFamily: theme.typography.fonts.inter700Bold }]}
              >
                {cat.name}
              </Text>
              <View style={[styles.arrowCircle, { borderColor: cat.arrowColor + '40' }]}>
                <Ionicons name="arrow-forward" size={12} color={cat.arrowColor} />
              </View>
            </Pressable>
          ))}
        </View>
        {/* ── Bottom CTA ── */}
        <View style={styles.ctaCard}>
          {/* Badge */}
          <View style={styles.badgeWrap}>
            <Svg width="52" height="52" viewBox="0 0 52 52">
              <Path d="M 26 4 L 32 10 L 40 8 L 42 16 L 50 20 L 46 28 L 50 36 L 42 40 L 40 48 L 32 46 L 26 52 L 20 46 L 12 48 L 10 40 L 2 36 L 6 28 L 2 20 L 10 16 L 12 8 L 20 10 Z" fill="#16A34A" />
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }} />
              <Path d="M 18 26 L 22 30 L 34 20" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
              {/* % symbol */}
              <Circle cx="21" cy="22" r="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
              <Circle cx="31" cy="32" r="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
              <Path d="M 33 20 L 19 34" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </Svg>
            {/* Confetti dots */}
            <Svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: -4, right: -4 }}>
              <Circle cx="8" cy="4" r="2.5" fill="#FCD34D" />
              <Circle cx="18" cy="8" r="2" fill="#F87171" />
              <Circle cx="4" cy="16" r="1.5" fill="#60A5FA" />
            </Svg>
          </View>
          <View style={styles.ctaText}>
            <Text style={[styles.ctaLine1, { fontFamily: theme.typography.fonts.inter500Medium }]}>
              Best prices from
            </Text>
            <Text style={[styles.ctaLine2, { fontFamily: theme.typography.fonts.inter700Bold }]}>
              trusted local stores
            </Text>
            <Text style={[styles.ctaLine3, { fontFamily: theme.typography.fonts.inter500Medium }]}>
              Quality products, fast delivery
            </Text>
          </View>
          <Pressable
            onPress={() => sheetRef.current?.present()}
            style={styles.exploreBtn}
          >
            <Text style={[styles.exploreBtnText, { fontFamily: theme.typography.fonts.inter700Bold }]}>
              Explore Stores
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </Pressable>
        </View>
      </ScrollView>
      {/* ── Bottom sheet (address picker) ── */}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.colors.surface, borderRadius: 28 }}
        handleIndicatorStyle={{ backgroundColor: '#E5E7EB' }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { fontFamily: theme.typography.fonts.inter700Bold }]}>
              Choose Delivery Address
            </Text>
            <Pressable onPress={handleSkipAddress} style={styles.skipBtn}>
              <Text style={[styles.skipBtnText, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>
                Skip
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.sheetSub, { fontFamily: theme.typography.fonts.inter500Medium }]}>
            Select your location to find stores within a 6 km radius.
          </Text>

          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
            {addresses.map((addr) => {
              const active = activeAddress?.id === addr.id;
              return (
                <Pressable
                  key={addr.id}
                  onPress={() => handleAddressSelect(addr)}
                  style={[styles.addrItem, active && styles.addrItemActive]}
                >
                  <View style={[styles.addrIcon, active && styles.addrIconActive]}>
                    <Ionicons
                      name={addr.label === 'Home' ? 'home' : addr.label === 'Work' ? 'briefcase' : 'location'}
                      size={16}
                      color={active ? '#FFFFFF' : '#16A34A'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addrLabel, { fontFamily: theme.typography.fonts.inter700Bold }]}>
                      {addr.label}
                    </Text>
                    <Text numberOfLines={1} style={[styles.addrStreet, { fontFamily: theme.typography.fonts.inter500Medium }]}>
                      {addr.streetAddress}, {addr.city}
                    </Text>
                  </View>
                  {active
                    ? <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                    : <View style={styles.radioCircle} />
                  }
                </Pressable>
              );
            })}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 40 },
  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  // Hero
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  heroText: { flex: 1, paddingRight: 4 },
  heroLine1: { fontSize: 28, color: '#111827', lineHeight: 34 },
  heroLine2Row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  heroGreen: { fontSize: 28, color: '#16A34A', lineHeight: 34 },
  heroSub: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  // Location card
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    gap: 12,
  },
  locationLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  locationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: { flex: 1, fontSize: 12.5, color: '#374151', lineHeight: 18 },
  locationHighlight: { color: '#16A34A', fontSize: 12.5 },
  // Category grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  catCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  catName: {
    fontSize: 11.5,
    color: '#111827',
    marginTop: 8,
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 15,
  },
  catDesc: {
    fontSize: 9.5,
    color: '#6B7280',
    lineHeight: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  // Bottom CTA
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  badgeWrap: { position: 'relative', width: 52, height: 52 },
  ctaText: { flex: 1 },
  ctaLine1: { fontSize: 11, color: '#6B7280' },
  ctaLine2: { fontSize: 13, color: '#16A34A', lineHeight: 18 },
  ctaLine3: { fontSize: 10.5, color: '#9CA3AF' },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreBtnText: { fontSize: 13, color: '#FFFFFF' },
  // Bottom sheet
  sheetContent: { padding: 20, paddingBottom: 40 },
  sheetTitle: { fontSize: 18, color: '#111827', marginBottom: 6 },
  sheetSub: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#16A34A',
    borderStyle: 'dashed',
    backgroundColor: '#F0FDF4',
    marginBottom: 16,
  },
  gpsBtnText: { fontSize: 14, color: '#16A34A' },
  addrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    gap: 12,
  },
  addrItemActive: { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
  addrIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addrIconActive: { backgroundColor: '#16A34A' },
  addrLabel: { fontSize: 14, color: '#111827' },
  addrStreet: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#D1D5DB' },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  skipBtnText: {
    fontSize: 13,
    color: '#4B5563',
  },
  topBarSkipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  topBarSkipText: {
    fontSize: 13,
    color: '#4B5563',
  },
});
