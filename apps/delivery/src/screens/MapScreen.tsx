import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors, typography } from '../theme';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

const { height: SCREEN_H } = Dimensions.get('window');

// ─── Rich mock store data ────────────────────────────────────────────────────

type StoreStatus = 'accepting' | 'busy' | 'closed';
type StoreZone   = 'hot' | 'warm' | 'cold';

interface Store {
  id: string;
  name: string;
  category: string;
  emoji: string;
  address: string;
  distance: string;
  distanceNum: number;
  rating: number;
  ratingCount: number;
  orders: number;
  eta: string;
  zone: StoreZone;
  status: StoreStatus;
  popularItems: string[];
  timing: string;
  coord: [number, number];
  priceRange: string;
}

const PARTNER_COORD: [number, number] = [78.3800, 17.4400];

const mockStores: Store[] = [
  {
    id: 's1', name: 'Hotel Sri Lakshmi Sai', category: 'Biryani', emoji: '🍛',
    address: 'Plot 45, Gachibowli Main Road, Hyderabad',
    distance: '0.4 km', distanceNum: 0.4,
    rating: 4.3, ratingCount: 234, orders: 4, eta: '3 min',
    zone: 'hot', status: 'accepting',
    popularItems: ['Chicken Biryani', 'Mutton Fry', 'Raita'],
    timing: '11am – 11pm', priceRange: '₹80–₹180',
    coord: [78.3820, 17.4420],
  },
  {
    id: 's2', name: 'Hotel Babu Biryani Point', category: 'Biryani', emoji: '🍛',
    address: '12B Kondapur Road, Near Metro Station',
    distance: '0.7 km', distanceNum: 0.7,
    rating: 4.1, ratingCount: 189, orders: 2, eta: '6 min',
    zone: 'warm', status: 'busy',
    popularItems: ['Veg Biryani', 'Egg Curry', 'Lassi'],
    timing: '10am – 10pm', priceRange: '₹60–₹150',
    coord: [78.3770, 17.4380],
  },
  {
    id: 's3', name: 'Dawat Biryani House', category: 'North Indian', emoji: '🫕',
    address: 'Shop 3, Inorbit Mall Road, Madhapur',
    distance: '0.9 km', distanceNum: 0.9,
    rating: 4.6, ratingCount: 512, orders: 7, eta: '2 min',
    zone: 'hot', status: 'accepting',
    popularItems: ['Dum Biryani', 'Dal Makhni', 'Paneer Tikka'],
    timing: '12pm – 12am', priceRange: '₹100–₹250',
    coord: [78.3850, 17.4450],
  },
  {
    id: 's4', name: 'Spice Garden', category: 'South Indian', emoji: '🥘',
    address: 'H.No 8-2-120, Banjara Hills Rd No 2',
    distance: '1.2 km', distanceNum: 1.2,
    rating: 3.9, ratingCount: 98, orders: 1, eta: '9 min',
    zone: 'cold', status: 'accepting',
    popularItems: ['Dosa', 'Idli Sambar', 'Filter Coffee'],
    timing: '7am – 10pm', priceRange: '₹40–₹120',
    coord: [78.3840, 17.4360],
  },
  {
    id: 's5', name: 'Biryani Bros', category: 'Fast Food', emoji: '🍔',
    address: 'Ground Floor, DLF Building, Gachibowli',
    distance: '0.5 km', distanceNum: 0.5,
    rating: 4.4, ratingCount: 376, orders: 5, eta: '4 min',
    zone: 'warm', status: 'accepting',
    popularItems: ['Zinger Burger', 'Spicy Wings', 'Loaded Fries'],
    timing: '11am – 11pm', priceRange: '₹90–₹200',
    coord: [78.3760, 17.4410],
  },
  {
    id: 's6', name: 'Paradise Restaurant', category: 'Biryani', emoji: '🍛',
    address: 'Secunderabad Branch, MG Road',
    distance: '1.5 km', distanceNum: 1.5,
    rating: 4.7, ratingCount: 1204, orders: 9, eta: '5 min',
    zone: 'hot', status: 'accepting',
    popularItems: ['Hyderabadi Biryani', 'Haleem', 'Double Ka Meetha'],
    timing: '12pm – 11pm', priceRange: '₹150–₹350',
    coord: [78.3790, 17.4460],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StoreStatus, { label: string; color: string; bg: string }> = {
  accepting: { label: 'Accepting Orders', color: '#1A1A1A', bg: '#F0F0F0' },
  busy:       { label: 'Busy',            color: '#555555', bg: '#EBEBEB' },
  closed:     { label: 'Closed',          color: '#AAAAAA', bg: '#F5F5F5' },
};

const ZONE_OPACITY: Record<StoreZone, number> = { hot: 0.15, warm: 0.08, cold: 0.04 };

const CATEGORIES = ['All', 'Biryani', 'North Indian', 'South Indian', 'Fast Food'];

function stars(rating: number) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

// ─── Main component ───────────────────────────────────────────────────────────

const SHEET_H = SCREEN_H * 0.58;
const SNAP_CLOSE_THRESHOLD = SHEET_H * 0.32;

const SPRING_CFG = {
  damping: 42,
  stiffness: 320,
  mass: 0.6,
  overshootClamping: true,   // prevents any bounce overshoot
};

export function MapScreen() {
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Reanimated shared values
  const translateY  = useSharedValue(SHEET_H);   // starts hidden below screen
  const dragOffsetY = useSharedValue(0);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredStores = activeCategory === 'All'
    ? mockStores
    : mockStores.filter(s => s.category === activeCategory);

  // ── Open: spring in from bottom ──────────────────────────────────────────
  function openStore(store: Store) {
    setSelectedStore(store);
    cameraRef.current?.setCamera({
      centerCoordinate: store.coord,
      zoomLevel: 15.5,
      animationMode: 'flyTo',
      animationDuration: 700,
    });
    translateY.value = withSpring(0, SPRING_CFG);
  }

  // ── Close: slide out smoothly ─────────────────────────────────────────────
  function closeSheet() {
    setSelectedStore(null);
  }

  function closeStore() {
    translateY.value = withTiming(SHEET_H, { duration: 280 }, () => {
      runOnJS(closeSheet)();
    });
  }

  // ── Pan gesture ───────────────────────────────────────────────────────────
  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragOffsetY.value = translateY.value;
    })
    .onUpdate((e) => {
      // Only drag downward (positive Y)
      const next = dragOffsetY.value + e.translationY;
      translateY.value = Math.max(0, next);
    })
    .onEnd((e) => {
      const shouldClose =
        translateY.value > SNAP_CLOSE_THRESHOLD || e.velocityY > 800;
      if (shouldClose) {
        translateY.value = withTiming(SHEET_H, { duration: 260 }, () => {
          runOnJS(closeSheet)();
        });
      } else {
        // Snap back to fully open
        translateY.value = withSpring(0, SPRING_CFG);
      }
    });

  // ── Animated style ────────────────────────────────────────────────────────
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  function recenter() {
    cameraRef.current?.setCamera({
      centerCoordinate: PARTNER_COORD,
      zoomLevel: 14,
      animationMode: 'flyTo',
      animationDuration: 600,
    });
  }

  const liveOrders = filteredStores.reduce((s, x) => s + x.orders, 0);

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Stores Near You</Text>
          <Text style={styles.headerSub}>{filteredStores.length} stores · {liveOrders} active orders</Text>
        </View>
      </View>

      {/* ── Category filter ── */}
      <View style={[styles.filterWrap, styles.filterWrapDark]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.filterChipText, activeCategory === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Map ── */}
      <View style={styles.mapWrap}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={false}
          scaleBarEnabled={false}
          onPress={closeStore}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={14}
            centerCoordinate={PARTNER_COORD}
            animationMode="flyTo"
            animationDuration={800}
          />

          {/* Zone circles */}
          {filteredStores.map(s => (
            <MapboxGL.ShapeSource
              key={`z-${s.id}`} id={`z-${s.id}`}
              shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: s.coord }, properties: {} }}
            >
              <MapboxGL.CircleLayer id={`zl-${s.id}`} style={{
                circleRadius: 90,
                circleColor: '#000000',
                circleOpacity: ZONE_OPACITY[s.zone],
                circleStrokeWidth: 1,
                circleStrokeColor: '#000000',
                circleStrokeOpacity: 0.12,
                circlePitchAlignment: 'map',
              }} />
            </MapboxGL.ShapeSource>
          ))}

          {/* Partner dot */}
          <MapboxGL.PointAnnotation id="me" coordinate={PARTNER_COORD}>
            <View style={[styles.meDot, styles.meDotDark]}>
              <View style={[styles.meInner, styles.meInnerDark]} />
            </View>
          </MapboxGL.PointAnnotation>

          {/* Store markers */}
          {filteredStores.map(s => {
            const isSelected = selectedStore?.id === s.id;
            return (
              <MapboxGL.PointAnnotation
                key={s.id} id={s.id}
                coordinate={s.coord}
                onSelected={() => openStore(s)}
              >
                <View style={[styles.markerWrap, isSelected && styles.markerWrapSelected]}>
                  <Text style={styles.markerEmoji}>{s.emoji}</Text>
                  <View style={[styles.markerBadge, isSelected && styles.markerBadgeSelected]}>
                    <Text style={[styles.markerBadgeText, isSelected && styles.markerBadgeTextSel]}>
                      {s.orders}
                    </Text>
                  </View>
                </View>
              </MapboxGL.PointAnnotation>
            );
          })}
        </MapboxGL.MapView>

        {/* Recenter button */}
        <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
          <Ionicons name="locate" size={20} color={colors.black87} />
        </TouchableOpacity>

        {/* Stats pill */}
        <View style={styles.statsPill}>
          <StatItem icon="flame-outline" value={`${filteredStores.filter(s => s.zone === 'hot').length}`} label="Hot" />
          <View style={styles.statsDot} />
          <StatItem icon="bag-handle-outline" value={`${liveOrders}`} label="Orders" />
          <View style={styles.statsDot} />
          <StatItem icon="time-outline" value="4 min" label="Avg ETA" />
        </View>
      </View>

      {/* ── Horizontal store list ── */}
      {!selectedStore && (
        <View style={[styles.listWrap, styles.listWrapDark]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listScroll}>
            {filteredStores
              .sort((a, b) => a.distanceNum - b.distanceNum)
              .map(s => (
                <TouchableOpacity key={s.id} style={styles.miniCard} onPress={() => openStore(s)} activeOpacity={0.85}>
                  <View style={styles.miniCardTop}>
                    <Text style={styles.miniEmoji}>{s.emoji}</Text>
                    <View style={[styles.miniStatus, { backgroundColor: STATUS_CONFIG[s.status].bg }]}>
                      <Text style={[styles.miniStatusText, { color: STATUS_CONFIG[s.status].color }]}>
                        {s.status === 'accepting' ? '● Live' : s.status === 'busy' ? '⏳ Busy' : '✕ Closed'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.miniName} numberOfLines={1}>{s.name}</Text>
                  <Text style={styles.miniMeta}>{s.distance} · {s.eta} · {s.orders} orders</Text>
                  <View style={styles.miniRatingRow}>
                    <Text style={styles.miniStar}>★</Text>
                    <Text style={styles.miniRating}>{s.rating}</Text>
                    <Text style={styles.miniRatingCount}>({s.ratingCount})</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      {/* ── Store detail bottom sheet ── */}
      {selectedStore && (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle]}>

            {/* Drag handle */}
            <View style={styles.sheetHandleWrap}>
              <View style={styles.sheetHandle} />
            </View>

            {/* Close */}
            <TouchableOpacity style={styles.sheetClose} onPress={closeStore}>
              <Ionicons name="close" size={18} color={colors.gray300} />
            </TouchableOpacity>

          {/* Hero row */}
          <View style={styles.sheetHero}>
            <View style={styles.sheetEmojiBox}>
              <Text style={styles.sheetEmoji}>{selectedStore.emoji}</Text>
            </View>
            <View style={styles.sheetHeroInfo}>
              <Text style={[styles.sheetName, styles.textWhite]}>
                {selectedStore.name}
              </Text>
              <Text style={styles.sheetCategory}>{selectedStore.category}</Text>
              <View style={styles.sheetRatingRow}>
                <Text style={styles.sheetStar}>★</Text>
                <Text style={[styles.sheetRating, styles.textWhite]}>
                  {selectedStore.rating}
                </Text>
                <Text style={styles.sheetRatingCount}>({selectedStore.ratingCount} ratings)</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_CONFIG[selectedStore.status].bg }]}>
              <Text style={[styles.statusBadgeText, { color: STATUS_CONFIG[selectedStore.status].color }]}>
                {STATUS_CONFIG[selectedStore.status].label}
              </Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.sheetStats}>
            <SheetStat icon="navigate-outline" value={selectedStore.distance} label="Distance" />
            <View style={styles.sheetStatDiv} />
            <SheetStat icon="time-outline" value={selectedStore.eta} label="ETA" />
            <View style={styles.sheetStatDiv} />
            <SheetStat icon="receipt-outline" value={`${selectedStore.orders}`} label="Orders" />
            <View style={styles.sheetStatDiv} />
            <SheetStat icon="pricetag-outline" value={selectedStore.priceRange} label="Range" />
          </View>

          {/* Address */}
          <View style={styles.sheetRow}>
            <Ionicons name="location-outline" size={15} color={colors.gray300} />
            <Text style={[styles.sheetAddress, styles.textGray]} numberOfLines={2}>
              {selectedStore.address}
            </Text>
          </View>

          {/* Timing */}
          <View style={styles.sheetRow}>
            <Ionicons name="time-outline" size={15} color={colors.gray300} />
            <Text style={[styles.sheetAddress, styles.textGray]}>
              {selectedStore.timing}
            </Text>
          </View>

          {/* Popular items */}
          <Text style={[styles.sheetSectionTitle, styles.textWhite]}>
            Popular Items
          </Text>
          <View style={styles.itemsRow}>
            {selectedStore.popularItems.map(item => (
              <View key={item} style={[styles.itemChip, styles.itemChipDark]}>
                <Text style={[styles.itemChipText, styles.textWhite]}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.navBtn}>
              <Ionicons name="navigate" size={16} color={colors.white} />
              <Text style={styles.navBtnText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ordersBtn}>
              <Ionicons name="bag-handle-outline" size={16} color={colors.black87} />
              <Text style={styles.ordersBtnText}>
                View Orders ({selectedStore.orders})
              </Text>
            </TouchableOpacity>
          </View>
          </Animated.View>
        </GestureDetector>
      )}
    </SafeAreaView>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatItem({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={12} color={colors.gray300} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SheetStat({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.sheetStatItem}>
      <Ionicons name={icon} size={18} color={colors.gray300} />
      <Text style={styles.sheetStatValue}>{value}</Text>
      <Text style={styles.sheetStatLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  headerTitle: { ...typography.h3, color: colors.black87 },
  headerSub: { ...typography.small, color: colors.gray300, marginTop: 1 },
  themeBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  themeBtnDark: { backgroundColor: colors.black87, borderColor: colors.black87 },

  // Filter
  filterWrap: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  filterWrapDark: { backgroundColor: '#111111', borderBottomColor: '#333' },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.gray100, backgroundColor: colors.white,
  },
  filterChipActive: { backgroundColor: colors.black87, borderColor: colors.black87 },
  filterChipText: { ...typography.small, color: colors.black87, fontWeight: '600' },
  filterChipTextActive: { color: colors.white },

  // Map
  mapWrap: { flex: 1, position: 'relative' },
  map: { flex: 1 },

  recenterBtn: {
    position: 'absolute', right: 12, top: 12,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
  },
  recenterBtnDark: { backgroundColor: '#1A1A1A' },

  statsPill: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
    gap: 8,
  },
  statsPillDark: { backgroundColor: 'rgba(20,20,20,0.95)' },
  statItem: { alignItems: 'center' },
  statValue: { ...typography.small, color: colors.black87, fontWeight: '700', fontSize: 11 },
  statLabel: { fontSize: 9, color: colors.gray300, marginTop: 1 },
  statsDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.gray100 },

  // Partner marker
  meDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: colors.black87,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  },
  meDotDark: { backgroundColor: '#1A1A1A', borderColor: colors.white },
  meInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.black87 },
  meInnerDark: { backgroundColor: colors.white },

  // Store marker
  markerWrap: {
    alignItems: 'center', justifyContent: 'center',
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.gray100,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, elevation: 4,
  },
  markerWrapSelected: {
    backgroundColor: colors.black87, borderColor: colors.black87,
    width: 52, height: 52, borderRadius: 26,
  },
  markerEmoji: { fontSize: 22 },
  markerBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: colors.black87, borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4, borderWidth: 1.5, borderColor: colors.white,
  },
  markerBadgeSelected: { backgroundColor: colors.white },
  markerBadgeText: { fontSize: 10, fontWeight: '700', color: colors.white },
  markerBadgeTextSel: { color: colors.black87 },

  // Mini cards
  listWrap: {
    backgroundColor: colors.white, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  listWrapDark: { backgroundColor: '#111111', borderTopColor: '#333' },
  listScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 14 },
  miniCard: {
    width: 160, backgroundColor: colors.gray50, borderRadius: 12,
    padding: 12, borderWidth: 1.5, borderColor: colors.gray100,
  },
  miniCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  miniEmoji: { fontSize: 24 },
  miniStatus: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  miniStatusText: { fontSize: 10, fontWeight: '600' },
  miniName: { ...typography.small, color: colors.black87, fontWeight: '700', marginBottom: 3 },
  miniMeta: { fontSize: 10, color: colors.gray300, marginBottom: 4 },
  miniRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  miniStar: { fontSize: 11, color: '#F5A623' },
  miniRating: { fontSize: 11, fontWeight: '700', color: colors.black87 },
  miniRatingCount: { fontSize: 10, color: colors.gray300 },

  // Bottom sheet
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 28, paddingTop: 0,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16, elevation: 12,
    height: SHEET_H,
  },
  sheetHandleWrap: {
    width: '100%', alignItems: 'center',
    paddingTop: 10, paddingBottom: 8,
  },
  sheetHandle: {
    width: 40, height: 5, borderRadius: 3,
    backgroundColor: colors.gray100,
  },
  sheetClose: { position: 'absolute', top: 18, right: 20, padding: 6 },

  // Hero
  sheetHero: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  sheetEmojiBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: colors.gray50, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.gray100,
  },
  sheetEmoji: { fontSize: 28 },
  sheetHeroInfo: { flex: 1 },
  sheetName: { ...typography.h3, color: colors.black87 },
  sheetCategory: { ...typography.small, color: colors.gray300, marginTop: 2 },
  sheetRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  sheetStar: { fontSize: 13, color: '#F5A623' },
  sheetRating: { ...typography.small, color: colors.black87, fontWeight: '700' },
  sheetRatingCount: { ...typography.small, color: colors.gray300 },

  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },

  // Stats row
  sheetStats: {
    flexDirection: 'row', backgroundColor: colors.gray50, borderRadius: 12,
    paddingVertical: 12, marginBottom: 14,
    borderWidth: 1, borderColor: colors.gray100,
  },
  sheetStatsDark: { backgroundColor: '#2A2A2A', borderColor: '#333' },
  sheetStatItem: { flex: 1, alignItems: 'center', gap: 3 },
  sheetStatDiv: { width: 1, backgroundColor: colors.gray100, marginVertical: 4 },
  sheetStatValue: { ...typography.body, color: colors.black87, fontWeight: '700' },
  sheetStatLabel: { fontSize: 10, color: colors.gray300 },

  // Info rows
  sheetRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  sheetAddress: { ...typography.small, color: colors.gray700, flex: 1, lineHeight: 18 },

  // Popular items
  sheetSectionTitle: { ...typography.small, color: colors.black87, fontWeight: '700', marginTop: 6, marginBottom: 8 },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  itemChip: {
    backgroundColor: colors.gray50, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: colors.gray100,
  },
  itemChipDark: { backgroundColor: '#2A2A2A', borderColor: '#444' },
  itemChipText: { ...typography.small, color: colors.black87 },

  // Actions
  sheetActions: { flexDirection: 'row', gap: 10 },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: colors.black87, borderRadius: 12, paddingVertical: 12,
  },
  navBtnText: { ...typography.body, color: colors.white, fontWeight: '700' },
  ordersBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: colors.gray50, borderRadius: 12, paddingVertical: 12,
    borderWidth: 1.5, borderColor: colors.gray100,
  },
  ordersBtnDark: { backgroundColor: '#2A2A2A', borderColor: '#444' },
  ordersBtnText: { ...typography.body, color: colors.black87, fontWeight: '700' },

  // Text helpers
  textWhite: { color: colors.white },
  textGray: { color: 'rgba(255,255,255,0.6)' },
});
