import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { DimensionValue, LayoutChangeEvent } from 'react-native';
import { getMapsConfig } from '../config';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useReverseGeocode } from '../hooks/useReverseGeocode';
import type { Coordinates, MapCircleData, MapMarkerData, PickedLocation, Region } from '../types';
import { AppMap } from './AppMap';
import type { AppMapRef } from './AppMap.types';
import { RecenterButton } from './RecenterButton';
import { SearchBox } from './SearchBox';

const DEFAULT_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };
const FALLBACK_CENTER: Coordinates = { latitude: 17.385, longitude: 78.4867 };
const DEFAULT_PRIMARY_COLOR = '#2563EB';
const DEFAULT_MIN_ZOOM = 15;
const DEFAULT_MAX_ZOOM = 19;
const COLLAPSED_SHEET_HEIGHT = 152;

export interface LocationPickerRef {
  animateToRegion: (region: Region) => void;
}

export interface LocationPickerProps {
  initialLocation?: Coordinates;
  /** static pin (+ optional radius circle), no search/drag/confirm */
  readOnly?: boolean;
  radiusMeters?: number;
  onConfirm?: (location: PickedLocation) => void;
  onLocationChange?: (location: PickedLocation) => void;
  showCurrentLocationButton?: boolean;
  showSearch?: boolean;
  height?: DimensionValue;
  confirmLabel?: string;
  /** Brand color applied to the pin, buttons and accents. Defaults to '#2563EB'. */
  primaryColor?: string;
  /** Closest the map can be zoomed in to. Defaults to 15 (street level). */
  minZoomLevel?: number;
  /** Farthest the map can be zoomed out to. Defaults to 19. */
  maxZoomLevel?: number;
  /** Renders extra fields (e.g. address-details form) inside the expandable bottom sheet */
  renderExpandedContent?: (location: PickedLocation | null) => ReactNode;
  /** Confirm button label while the sheet is expanded; falls back to confirmLabel */
  expandedConfirmLabel?: string;
  /** Called on confirm while the sheet is expanded; falls back to onConfirm */
  onExpandedConfirm?: (location: PickedLocation) => void;
  /** Called whenever the pin starts or stops moving (useful for driving skeleton loaders in the parent) */
  onMovingChange?: (isMoving: boolean) => void;
}

export const LocationPicker = forwardRef<LocationPickerRef, LocationPickerProps>(function LocationPickerInner({
  initialLocation,
  readOnly = false,
  radiusMeters,
  onConfirm,
  onLocationChange,
  showCurrentLocationButton = !readOnly,
  showSearch = !readOnly,
  height = 280,
  confirmLabel = 'Confirm location',
  primaryColor = DEFAULT_PRIMARY_COLOR,
  minZoomLevel = DEFAULT_MIN_ZOOM,
  maxZoomLevel = DEFAULT_MAX_ZOOM,
  renderExpandedContent,
  expandedConfirmLabel,
  onExpandedConfirm,
  onMovingChange,
}: LocationPickerProps, ref) {
  const center = initialLocation ?? getMapsConfig().defaultRegion ?? FALLBACK_CENTER;
  const [region, setRegion] = useState<Region>({ ...center, ...DEFAULT_DELTA });
  const [isMoving, setIsMoving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const mapRef = useRef<AppMapRef | null>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (next: Region) => {
      setRegion(next);
      mapRef.current?.animateToRegion(next);
    },
  }));

  const {
    location: currentLocation,
    loading: locating,
    refresh: refreshCurrentLocation,
  } = useCurrentLocation({
    autoRequest: !readOnly && !initialLocation,
    resolveAddress: false,
  });

  const { result: resolved, loading: resolveLoading } = useReverseGeocode(
    readOnly ? null : { latitude: region.latitude, longitude: region.longitude },
  );

  const pickedLocation: PickedLocation | null = resolved
    ? {
        latitude: region.latitude,
        longitude: region.longitude,
        formattedAddress: resolved.formattedAddress,
        street: resolved.street,
        city: resolved.city,
        state: resolved.state,
        postalCode: resolved.postalCode,
      }
    : null;

  useEffect(() => {
    if (!pickedLocation || readOnly) return;
    onLocationChange?.(pickedLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedLocation?.formattedAddress, pickedLocation?.latitude, pickedLocation?.longitude]);

  useEffect(() => {
    if (currentLocation) {
      const next: Region = { ...currentLocation, ...DEFAULT_DELTA };
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync map region to the resolved current-location once available
      setRegion(next);
      mapRef.current?.animateToRegion(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation?.latitude, currentLocation?.longitude, currentLocation?.updatedAt]);

  // --- Bottom sheet expand/collapse (tap the handle to reveal more details) ---
  const [containerHeight, setContainerHeight] = useState(0);

  const expandedSheetHeight =
    renderExpandedContent && containerHeight
      ? Math.max(COLLAPSED_SHEET_HEIGHT, Math.min(containerHeight - 60, containerHeight * 0.75))
      : COLLAPSED_SHEET_HEIGHT;

  const sheetHeightValue = expanded ? expandedSheetHeight : COLLAPSED_SHEET_HEIGHT;

  const toggleExpanded = () => {
    if (!renderExpandedContent) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  };

  // --- Map region tracking ---
  const handleRegionChange = () => {
    setIsMoving(true);
    onMovingChange?.(true);
  };

  const handleRegionChangeComplete = (next: Region) => {
    setRegion(next);
    setIsMoving(false);
    onMovingChange?.(false);
  };

  const confirmDisabled = !pickedLocation || isMoving;

  const handleConfirmPress = () => {
    if (!pickedLocation) return;
    if (expanded && onExpandedConfirm) {
      onExpandedConfirm(pickedLocation);
    } else {
      onConfirm?.(pickedLocation);
    }
  };

  const confirmButtonLabel = expanded && expandedConfirmLabel ? expandedConfirmLabel : confirmLabel;

  const markers: MapMarkerData[] =
    readOnly && initialLocation ? [{ id: 'pin', ...initialLocation, kind: 'pin' }] : [];

  const circles: MapCircleData[] =
    readOnly && initialLocation && radiusMeters
      ? [{ id: 'radius', center: initialLocation, radiusMeters }]
      : [];

  const showResolving = isMoving || (resolveLoading && !resolved);
  const addressText = showResolving
    ? 'Finding address…'
    : resolved?.formattedAddress
      ? resolved.formattedAddress
      : 'Move the pin to set your location';

  const sheetVisible = !readOnly && Boolean(onConfirm || onExpandedConfirm);

  return (
    <View style={[styles.container, { height }]} onLayout={!readOnly ? handleContainerLayout : undefined}>
      <AppMap
        region={region}
        onRegionChangeComplete={!readOnly ? handleRegionChangeComplete : undefined}
        onRegionChange={!readOnly ? handleRegionChange : undefined}
        minZoomLevel={!readOnly ? minZoomLevel : undefined}
        maxZoomLevel={!readOnly ? maxZoomLevel : undefined}
        mapRef={mapRef}
        markers={markers}
        circles={circles}
        zoomEnabled={!readOnly}
        scrollEnabled={!readOnly}
      />

      {!readOnly && (
        <>
          <View pointerEvents="none" style={styles.centerPinWrap}>
            {isMoving && <View style={styles.pinShadow} />}
            <View style={[styles.pinContainer, isMoving && styles.pinContainerLifted]}>
              <View style={[styles.pinBody, { backgroundColor: primaryColor }]}>
                <View style={styles.pinInner}>
                  <Ionicons name="location" size={16} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>

          <View pointerEvents="none" style={[styles.topHint, showSearch && styles.topHintWithSearch]}>
            <Text style={styles.topHintText}>Move pin to exact location</Text>
          </View>
        </>
      )}

      {showSearch && (
        <SearchBox
          onSelect={(location) => {
            const next: Region = { ...location, ...DEFAULT_DELTA };
            setRegion(next);
            mapRef.current?.animateToRegion(next);
          }}
        />
      )}

      {showCurrentLocationButton && !expanded && (
        <RecenterButton
          label="◎"
          color={primaryColor}
          loading={locating}
          onPress={refreshCurrentLocation}
          style={{ bottom: sheetVisible ? COLLAPSED_SHEET_HEIGHT + 16 : 16 }}
        />
      )}

      {sheetVisible && (
        <View style={[styles.sheet, { height: sheetHeightValue }]}>
          <Pressable onPress={toggleExpanded} style={styles.handleArea} hitSlop={8}>
            <View style={[styles.handleBar, { backgroundColor: `${primaryColor}55` }]} />
            {renderExpandedContent && (
              <Text style={styles.handleHint}>{expanded ? 'Tap to show less' : 'Tap for more details'}</Text>
            )}
          </Pressable>

          <View style={styles.addressRow}>
            <View style={[styles.addressIcon, { backgroundColor: `${primaryColor}1A` }]}>
              {showResolving ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : (
                <Text style={styles.addressIconText}>📍</Text>
              )}
            </View>
            <Text style={styles.addressText} numberOfLines={expanded ? undefined : 2}>
              {addressText}
            </Text>
          </View>

          {expanded && renderExpandedContent && (
            <ScrollView style={styles.expandedContent} keyboardShouldPersistTaps="handled">
              {renderExpandedContent(pickedLocation)}
            </ScrollView>
          )}

          <Pressable
            onPress={handleConfirmPress}
            disabled={confirmDisabled}
            style={[styles.confirmButton, { backgroundColor: primaryColor }, confirmDisabled && styles.confirmButtonDisabled]}
          >
            <Text style={styles.confirmButtonText}>{confirmButtonLabel}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  centerPinWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  // Google Maps teardrop — rotated square with one sharp corner pointing down
  pinContainer: {
    transform: [{ translateX: -18 }, { translateY: -44 }],
  },
  pinContainerLifted: {
    transform: [{ translateX: -18 }, { translateY: -56 }],
  },
  pinBody: {
    width: 36,
    height: 36,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 2,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  pinInner: {
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinShadow: {
    position: 'absolute',
    width: 16,
    height: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transform: [{ translateX: -8 }, { translateY: -2 }],
  },
  topHint: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topHintWithSearch: {
    top: 68,
  },
  topHintText: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#FFFFFF',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 6,
  },
  handleHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIconText: {
    fontSize: 16,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 19,
  },
  expandedContent: {
    flex: 1,
    marginBottom: 8,
  },
  confirmButton: {
    paddingVertical: 13,
    borderRadius: 10,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
});
