import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { LocationPicker, usePlacesAutocomplete } from '@ecommerce/maps';
import type { LocationPickerRef, PickedLocation, PlaceSuggestion, Region } from '@ecommerce/maps';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Chip } from '../../../Common/components/ui/Chip';
import { Input } from '../../../Common/components/ui/Input';
import { setPendingPickedLocation } from '../../../features/Addresses/Store/mapPickerBridge';
import { useTheme } from '../../../theme/ThemeContext';
import { AddressType } from '../../../types/shared';

const { height: SCREEN_H } = Dimensions.get('window');

const SNAP_COLLAPSED = '25%';
const SNAP_EXPANDED = '62%';
const ADDRESS_TYPES: AddressType[] = ['HOME', 'WORK', 'OTHER'];

interface RecentSearch {
  placeId: string;
  name: string;
  secondary: string;
}

// Staggered widths give each skeleton row a natural uneven look
const SK_L = ['75%', '82%', '68%', '78%'] as const;
const SK_S = ['50%', '44%', '57%', '40%'] as const;
const SK_OPACITY = [1, 1, 1, 0.45] as const;

function SearchSkeleton({ borderColor }: { borderColor: string }) {
  const x = useSharedValue(-350);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(350, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <>
      {SK_OPACITY.map((opacity, i) => (
        <View key={i} style={[skStyles.row, { opacity, borderBottomColor: borderColor }]}>
          <View style={[skStyles.icon, { backgroundColor: borderColor, overflow: 'hidden' }]}>
            <Animated.View style={[StyleSheet.absoluteFill, animStyle]} pointerEvents="none">
              <LinearGradient colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
            </Animated.View>
          </View>
          <View style={skStyles.lines}>
            <View style={[skStyles.lineL, { backgroundColor: borderColor, width: SK_L[i], overflow: 'hidden' }]}>
              <Animated.View style={[StyleSheet.absoluteFill, animStyle]} pointerEvents="none">
                <LinearGradient colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              </Animated.View>
            </View>
            <View style={[skStyles.lineS, { backgroundColor: borderColor, width: SK_S[i], overflow: 'hidden' }]}>
              <Animated.View style={[StyleSheet.absoluteFill, animStyle]} pointerEvents="none">
                <LinearGradient colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              </Animated.View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
}

const skStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 0.5 },
  icon: { width: 36, height: 36, borderRadius: 10, flexShrink: 0 },
  lines: { flex: 1, gap: 8 },
  lineL: { height: 13, borderRadius: 6 },
  lineS: { height: 10, borderRadius: 6 },
});

function HighlightText({
  text,
  query,
  style,
}: {
  text: string;
  query: string;
  style?: object;
}) {
  if (!query.trim()) return <Text style={style}>{text}</Text>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={i} style={hlStyle}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
const hlStyle = { color: '#16A34A', fontWeight: '700' as const };

export default function MapPickerScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const locationPickerRef = useRef<LocationPickerRef>(null);
  const searchInputRef = useRef<TextInput>(null);
  const snapPoints = useMemo(() => [SNAP_COLLAPSED, SNAP_EXPANDED], []);

  // Map / location state
  const [currentLocation, setCurrentLocation] = useState<PickedLocation | null>(null);
  const [flatNo, setFlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('HOME');
  const [resolving, setResolving] = useState(false);

  // Search overlay state
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  // Skeleton
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  const { query, setQuery, suggestions, loading: searchLoading, selectSuggestion, clear: clearSearch } =
    usePlacesAutocomplete();

  // animatedPosition drives map height in real-time as sheet drags.
  // Start at the expanded snap (62% sheet = 38% from top).
  const animatedPosition = useSharedValue(SCREEN_H * 0.38);
  const mapAnimatedStyle = useAnimatedStyle(() => ({
    height: Math.max(80, animatedPosition.value),
  }));

  // Skeleton pulse
  const skeletonOpacity = useSharedValue(1);
  useEffect(() => {
    skeletonOpacity.value = withRepeat(
      withSequence(withTiming(0.35, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const skeletonAnimStyle = useAnimatedStyle(() => ({ opacity: skeletonOpacity.value }));

  // Auto-focus the search input when overlay opens
  useEffect(() => {
    if (searchFocused) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [searchFocused]);

  // Auto-hide toast after 2.5s
  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 2500);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const handleLocationChange = useCallback((location: PickedLocation) => {
    setCurrentLocation(location);
  }, []);

  // When pin starts moving: clear stale address + selected pill name
  const handleMovingChange = useCallback((moving: boolean) => {
    if (moving) {
      setCurrentLocation(null);
      setSelectedName('');
    }
  }, []);

  const openSearchOverlay = () => {
    setSearchFocused(true);
  };

  const closeSearchOverlay = () => {
    setSearchFocused(false);
    Keyboard.dismiss();
    clearSearch();
  };

  const handleSuggestionSelect = async (item: PlaceSuggestion) => {
    closeSearchOverlay();
    setResolving(true);
    const location = await selectSuggestion(item.placeId);
    setResolving(false);
    if (!location) return;

    const next: Region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    locationPickerRef.current?.animateToRegion(next);

    const displayName = item.mainText ?? item.description;
    setSelectedName(displayName);

    // Keep max 5 unique recents, most recent first
    setRecentSearches((prev) => [
      { placeId: item.placeId, name: displayName, secondary: item.secondaryText ?? '' },
      ...prev.filter((r) => r.placeId !== item.placeId).slice(0, 4),
    ]);

    setToastText(`Moved to ${displayName}`);
    setToastVisible(true);
  };

  const handleRecentSelect = async (recent: RecentSearch) => {
    closeSearchOverlay();
    setResolving(true);
    const location = await selectSuggestion(recent.placeId);
    setResolving(false);
    if (!location) return;

    const next: Region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    locationPickerRef.current?.animateToRegion(next);
    setSelectedName(recent.name);
    setToastText(`Moved to ${recent.name}`);
    setToastVisible(true);
  };

  const handleSave = () => {
    if (!currentLocation) return;
    setPendingPickedLocation({
      ...currentLocation,
      flatNo: flatNo.trim() || undefined,
      landmark: landmark.trim() || undefined,
      addressType,
    });
    router.back();
  };

  const saveDisabled = !currentLocation;
  const showSuggestions = suggestions.length > 0;
  const showRecents = recentSearches.length > 0 && !query.trim();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* ── Compact search bar ── */}
      <View
        style={[styles.searchBar, { paddingTop: insets.top + 8, backgroundColor: theme.colors.surface }]}
        onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
      >
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.colors.background }]}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </Pressable>

        <Pressable
          style={[
            styles.searchPill,
            { backgroundColor: theme.colors.background, borderColor: selectedName ? `${theme.colors.primary}88` : theme.colors.border },
          ]}
          onPress={openSearchOverlay}
        >
          <Ionicons
            name="search"
            size={15}
            color={selectedName ? theme.colors.primary : theme.colors.textSecondary}
          />
          {selectedName ? (
            <Text
              style={[styles.pillValue, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}
              numberOfLines={1}
            >
              {selectedName}
            </Text>
          ) : (
            <Text style={[styles.pillPlaceholder, { color: theme.colors.textSecondary }]}>
              Search for a location…
            </Text>
          )}
          {(resolving) ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : selectedName ? (
            <Pressable
              onPress={() => setSelectedName('')}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={16} color={theme.colors.textSecondary} />
            </Pressable>
          ) : null}
        </Pressable>
      </View>

      {/* ── Map + bottom sheet ── */}
      <View style={styles.body}>
        <Animated.View style={mapAnimatedStyle}>
          <LocationPicker
            ref={locationPickerRef}
            height="100%"
            primaryColor={theme.colors.primary}
            showSearch={false}
            onLocationChange={handleLocationChange}
            onMovingChange={handleMovingChange}
          />
        </Animated.View>

        <BottomSheet
          ref={sheetRef}
          index={1}
          snapPoints={snapPoints}
          animatedPosition={animatedPosition}
          enablePanDownToClose={false}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backgroundStyle={[styles.sheetBg, { backgroundColor: theme.colors.surface }]}
          handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.addressRow}>
              <View style={[styles.addressIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
                {currentLocation === null ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Ionicons name="location" size={18} color={theme.colors.primary} />
                )}
              </View>
              {currentLocation === null ? (
                <Animated.View style={[styles.skeletonWrap, skeletonAnimStyle]}>
                  <View style={[styles.skLine, styles.skLineLong, { backgroundColor: theme.colors.border }]} />
                  <View style={[styles.skLine, styles.skLineShort, { backgroundColor: theme.colors.border }]} />
                </Animated.View>
              ) : (
                <Text
                  style={[styles.addressText, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}
                  numberOfLines={2}
                >
                  {currentLocation.formattedAddress}
                </Text>
              )}
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <Input
              label="House / Flat / Floor No."
              value={flatNo}
              onChangeText={setFlatNo}
              placeholder="e.g. Flat 4B, 2nd Floor"
              containerStyle={styles.inputGap}
              TextInputComponent={BottomSheetTextInput}
            />
            <Input
              label="Landmark (optional)"
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Near metro station, park…"
              containerStyle={styles.inputGap}
              TextInputComponent={BottomSheetTextInput}
            />

            <Text style={[styles.chipLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }]}>
              Save address as
            </Text>
            <View style={styles.chipRow}>
              {ADDRESS_TYPES.map((type) => (
                <Chip
                  key={type}
                  label={type.charAt(0) + type.slice(1).toLowerCase()}
                  selected={addressType === type}
                  onPress={() => setAddressType(type)}
                  style={styles.chip}
                />
              ))}
            </View>

            <Pressable
              onPress={handleSave}
              disabled={saveDisabled}
              style={[styles.saveBtn, { backgroundColor: theme.colors.primary }, saveDisabled && styles.saveBtnDisabled]}
            >
              <Text style={[styles.saveBtnText, { fontFamily: theme.typography.fonts.bold }]}>
                Save address
              </Text>
            </Pressable>
          </BottomSheetScrollView>
        </BottomSheet>

        {/* Toast — floats above bottom sheet */}
        {toastVisible && searchBarHeight > 0 && (
          <View style={[styles.toast, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.toastText} numberOfLines={1}>{toastText}</Text>
          </View>
        )}
      </View>

      {/* ── Full-screen search overlay ── */}
      {searchFocused && (
        <View style={[styles.overlay, { backgroundColor: theme.colors.background }]}>
          {/* Top input row */}
          <View style={[styles.ovTop, { paddingTop: insets.top + 6, backgroundColor: theme.colors.surface }]}>
            <View style={styles.ovRow}>
              <Pressable
                onPress={closeSearchOverlay}
                style={[styles.backBtn, { backgroundColor: theme.colors.background }]}
                hitSlop={8}
              >
                <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
              </Pressable>

              <View style={[styles.ovInputWrap, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]}>
                <Ionicons name="search" size={15} color={theme.colors.primary} />
                <TextInput
                  ref={searchInputRef}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search for a location…"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.ovInput, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.regular }]}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                {searchLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : query.length > 0 ? (
                  <Pressable onPress={clearSearch} hitSlop={8}>
                    <Ionicons name="close-circle" size={16} color={theme.colors.textSecondary} />
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>

          <View style={[styles.ovDivider, { backgroundColor: theme.colors.border }]} />

          {/* Content */}
          {!query.trim() ? (
            /* Recents */
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {showRecents && (
                <>
                  <Text style={[styles.sectionHd, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.semiBold }]}>
                    Recent searches
                  </Text>
                  {recentSearches.map((r) => (
                    <Pressable
                      key={r.placeId}
                      style={[styles.ovResultRow, { borderBottomColor: theme.colors.border }]}
                      onPress={() => handleRecentSelect(r)}
                    >
                      <View style={[styles.ovResultIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
                        <Ionicons name="time-outline" size={17} color={theme.colors.primary} />
                      </View>
                      <View style={styles.ovResultText}>
                        <Text style={[styles.ovResultMain, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]} numberOfLines={1}>
                          {r.name}
                        </Text>
                        {r.secondary ? (
                          <Text style={[styles.ovResultSub, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                            {r.secondary}
                          </Text>
                        ) : null}
                      </View>
                      <Ionicons name="arrow-up-outline" size={14} color={theme.colors.textSecondary} style={{ transform: [{ rotate: '45deg' }] }} />
                    </Pressable>
                  ))}
                </>
              )}
              {!showRecents && (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={40} color={theme.colors.border} />
                  <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Search for an area, street or landmark
                  </Text>
                </View>
              )}
            </ScrollView>
          ) : searchLoading ? (
            /* Skeleton rows while API is fetching */
            <>
              <Text style={[styles.sectionHd, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.semiBold }]}>
                Results
              </Text>
              <SearchSkeleton borderColor={theme.colors.border} />
            </>
          ) : (
            /* Live results or empty state */
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.placeId}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                showSuggestions ? (
                  <Text style={[styles.sectionHd, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.semiBold }]}>
                    Results
                  </Text>
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="location-outline" size={40} color={theme.colors.border} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                      No results found for "{query}"
                    </Text>
                  </View>
                )
              }
              renderItem={({ item }: { item: PlaceSuggestion }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.ovResultRow,
                    { borderBottomColor: theme.colors.border },
                    pressed && { backgroundColor: `${theme.colors.primary}08` },
                  ]}
                  onPress={() => handleSuggestionSelect(item)}
                >
                  <View style={[styles.ovResultIcon, { backgroundColor: theme.colors.background }]}>
                    <Ionicons name="location-outline" size={17} color={theme.colors.textSecondary} />
                  </View>
                  <View style={styles.ovResultText}>
                    <HighlightText
                      text={item.mainText ?? item.description}
                      query={query}
                      style={[styles.ovResultMain, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.medium }]}
                    />
                    {item.secondaryText ? (
                      <Text style={[styles.ovResultSub, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {item.secondaryText}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Search bar */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    borderWidth: 0.5,
  },
  pillPlaceholder: { flex: 1, fontSize: 14 },
  pillValue: { flex: 1, fontSize: 14 },

  /* Map body */
  body: { flex: 1 },

  /* Bottom sheet */
  sheetBg: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 40 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  addressIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  addressText: { flex: 1, fontSize: 14, lineHeight: 20 },
  skeletonWrap: { flex: 1, gap: 8 },
  skLine: { borderRadius: 6 },
  skLineLong: { height: 13, width: '82%' },
  skLineShort: { height: 11, width: '52%' },
  divider: { height: 1, marginBottom: 16, opacity: 0.5 },
  inputGap: { marginBottom: 14 },
  chipLabel: { fontSize: 12, marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { marginRight: 0 },
  saveBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15 },

  /* Toast */
  toast: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  toastText: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '500' },

  /* Search overlay */
  overlay: {
    position: 'absolute',
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  ovTop: {
    flexShrink: 0,
  },
  ovRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  ovInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 13,
    borderWidth: 1.5,
  },
  ovInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  ovDivider: { height: 0.5 },

  /* Overlay list rows */
  sectionHd: {
    fontSize: 10,
    letterSpacing: 0.07,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  ovResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  ovResultIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ovResultText: { flex: 1 },
  ovResultMain: { fontSize: 13 },
  ovResultSub: { fontSize: 11, marginTop: 2 },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
