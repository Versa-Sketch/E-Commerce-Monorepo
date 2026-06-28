import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDirections } from '../hooks/useDirections';
import { useSimulatedRoute } from '../hooks/useSimulatedRoute';
import { OrderTrackingPanel } from './OrderTrackingPanel';
import type { OrderTrackingMode, OrderStatus } from './OrderTrackingPanel';
import type { Coordinates } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.42);

// Muted delivery-app map style — only used in this component
const DELIVERY_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f0' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f0' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e8e8e8' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#aaaaaa' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#efefef' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e8f0' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9ab8c8' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#f0ede8' }] },
  { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ color: '#eceee6' }] },
];

export interface OrderTrackingScreenProps {
  navigation?: any;
  mode: OrderTrackingMode;
  orderId: string;
  partnerName: string;
  partnerRating?: number;
  partnerVehicleNumber?: string;
  storeName?: string;
  storeLocation?: Coordinates;
  destination: Coordinates;
  destinationLabel?: string;
  dropAddress?: string;
  orderValue?: string;
  itemCount?: number;
  orderStatus?: OrderStatus;
  simulatedRoute: Coordinates[];
  simulationIntervalMs?: number;
  onBack?: () => void;
  onCallPartner?: () => void;
  onMessagePartner?: () => void;
  onSupportPress?: () => void;
  onOrderDetailPress?: () => void;
}

export function OrderTrackingScreen({
  navigation,
  mode,
  orderId,
  partnerName,
  partnerRating,
  partnerVehicleNumber,
  storeName,
  storeLocation,
  destination,
  destinationLabel,
  dropAddress,
  orderValue,
  itemCount,
  orderStatus = 'out_for_delivery',
  simulatedRoute,
  simulationIntervalMs = 5000,
  onBack,
  onCallPartner,
  onMessagePartner,
  onSupportPress,
  onOrderDetailPress,
}: OrderTrackingScreenProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const [etaText, setEtaText] = useState<string | null>(null);
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [traveledPath, setTraveledPath] = useState<Coordinates[]>([]);
  const didFit = useRef(false);

  const { location: partnerLocation, heading, stepIndex, totalSteps } =
    useSimulatedRoute(simulatedRoute, { intervalMs: simulationIntervalMs });

  const { directions } = useDirections(
    partnerLocation,
    partnerLocation ? destination : null,
    { mode: 'two_wheeler' },
  );

  useEffect(() => {
    if (directions) {
      setEtaText(directions.durationText);
      setDistanceText(directions.distanceText);
    }
  }, [directions]);

  // Accumulate traveled path for the dashed trail.
  useEffect(() => {
    if (!partnerLocation) return;
    setTraveledPath((prev) => [...prev, partnerLocation]);
  }, [partnerLocation?.latitude, partnerLocation?.longitude]);

  // Fit both markers on first load with panel padding.
  useEffect(() => {
    if (didFit.current || !partnerLocation) return;
    didFit.current = true;
    const coords = storeLocation
      ? [partnerLocation, destination, storeLocation]
      : [partnerLocation, destination];
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: {
          top: insets.top + 100,
          right: 60,
          bottom: PANEL_HEIGHT + 40,
          left: 60,
        },
        animated: true,
      });
    }, 600);
  }, [partnerLocation]);

  // Smoothly follow rider as they move (after initial fit).
  useEffect(() => {
    if (!didFit.current || !partnerLocation) return;
    mapRef.current?.animateToRegion(
      { ...partnerLocation, latitudeDelta: 0.016, longitudeDelta: 0.016 },
      700,
    );
  }, [partnerLocation?.latitude, partnerLocation?.longitude]);

  // Pulse ring animation.
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.55)).current;
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 2.0, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.55, duration: 1000, useNativeDriver: true }),
        ]),
      ]),
    ).start();
  }, []);

  const handleBack = useCallback(() => {
    if (onBack) { onBack(); return; }
    navigation?.goBack();
  }, [onBack, navigation]);

  const handleRecenter = useCallback(() => {
    if (!partnerLocation) return;
    mapRef.current?.animateToRegion(
      { ...partnerLocation, latitudeDelta: 0.016, longitudeDelta: 0.016 },
      400,
    );
  }, [partnerLocation]);

  const initialRegion = simulatedRoute[0]
    ? { ...simulatedRoute[0], latitudeDelta: 0.025, longitudeDelta: 0.025 }
    : { ...destination, latitudeDelta: 0.025, longitudeDelta: 0.025 };

  const abovePanelBottom = PANEL_HEIGHT + 16;

  return (
    <View style={styles.container}>
      {/* ── Full-screen map ── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        customMapStyle={DELIVERY_MAP_STYLE}
        zoomEnabled={false}
        scrollEnabled
        showsCompass={false}
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
      >
        {/* Traveled trail — dashed faded blue */}
        {traveledPath.length > 1 && (
          <Polyline
            coordinates={traveledPath}
            strokeColor="rgba(74,144,217,0.35)"
            strokeWidth={4}
            lineDashPattern={[6, 8]}
          />
        )}

        {/* Remaining route — solid blue */}
        {directions && directions.polyline.length > 1 && (
          <>
            <Polyline
              coordinates={directions.polyline}
              strokeColor="rgba(74,144,217,0.2)"
              strokeWidth={10}
            />
            <Polyline
              coordinates={directions.polyline}
              strokeColor="#4A90D9"
              strokeWidth={5}
            />
          </>
        )}

        {/* Store marker */}
        {storeLocation && (
          <Marker coordinate={storeLocation} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <View style={styles.storeMarker}>
              <View style={styles.storePin}>
                <Ionicons name="storefront" size={16} color="#fff" />
              </View>
              <View style={styles.pinTailOrange} />
              {storeName ? (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText} numberOfLines={1}>{storeName}</Text>
                </View>
              ) : null}
            </View>
          </Marker>
        )}

        {/* Destination marker */}
        <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View style={styles.destMarker}>
            <View style={styles.destPin}>
              <Ionicons name="home" size={16} color="#fff" />
            </View>
            <View style={styles.pinTailGreen} />
            {destinationLabel ? (
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText} numberOfLines={1}>{destinationLabel}</Text>
              </View>
            ) : null}
          </View>
        </Marker>

        {/* Partner marker — directional arrow */}
        {partnerLocation && (
          <Marker
            coordinate={partnerLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={heading ?? 0}
            tracksViewChanges
          >
            <View style={styles.riderMarkerWrap}>
              <Animated.View style={[
                styles.riderPulse,
                { transform: [{ scale: pulseAnim }], opacity: pulseOpacity },
              ]} />
              <View style={styles.riderMarkerCircle}>
                <Ionicons name="navigate" size={18} color="#fff" />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* ── Floating overlays ── */}

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 10 }]}
        onPress={handleBack}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Live badge */}
      <View style={[styles.liveBadge, { top: insets.top + 16 }]}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      {/* Recenter — sits just above the panel */}
      <TouchableOpacity
        style={[styles.recenterBtn, { bottom: abovePanelBottom }]}
        onPress={handleRecenter}
        activeOpacity={0.85}
      >
        <Ionicons name="navigate-outline" size={20} color="#1A1A1A" />
      </TouchableOpacity>

      {/* ── Floating bottom panel ── */}
      <View style={[styles.panel, { height: PANEL_HEIGHT, paddingBottom: insets.bottom + 8 }]}>
        <OrderTrackingPanel
          mode={mode}
          orderId={orderId}
          partnerName={partnerName}
          partnerRating={partnerRating}
          partnerVehicleNumber={partnerVehicleNumber}
          storeName={storeName}
          dropAddress={dropAddress}
          orderValue={orderValue}
          itemCount={itemCount}
          orderStatus={orderStatus}
          etaText={etaText}
          distanceText={distanceText}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          bottomInset={0}
          onCallPartner={onCallPartner}
          onMessagePartner={onMessagePartner}
          onSupportPress={onSupportPress}
          onOrderDetailPress={onOrderDetailPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Back */
  backBtn: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  /* Live badge */
  liveBadge: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#27C56E',
  },
  liveText: { fontSize: 11, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.8 },

  /* Recenter */
  recenterBtn: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  /* Floating panel */
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
    overflow: 'hidden',
  },

  /* Store marker */
  storeMarker: { alignItems: 'center' },
  storePin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  pinTailOrange: { width: 3, height: 8, backgroundColor: '#FF6B35', borderRadius: 2 },

  /* Destination marker */
  destMarker: { alignItems: 'center' },
  destPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27A259',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#27A259',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  pinTailGreen: { width: 3, height: 8, backgroundColor: '#27A259', borderRadius: 2 },

  /* Shared pin label */
  pinLabel: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    maxWidth: 110,
  },
  pinLabelText: { fontSize: 10, fontWeight: '700', color: '#1A1A1A' },

  /* Rider marker */
  riderMarkerWrap: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderPulse: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,107,53,0.22)',
  },
  riderMarkerCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 7,
  },
});
