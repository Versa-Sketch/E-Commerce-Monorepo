import React from 'react';
import { OrderTrackingScreen } from '../../../../packages/maps/src';
import type { Coordinates } from '../../../../packages/maps/src';

// Indiranagar → HSR Layout, Bengaluru (10-point route)
const DEMO_ROUTE: Coordinates[] = [
  { latitude: 12.9784, longitude: 77.6408 }, // Fresh Mart – Indiranagar
  { latitude: 12.9756, longitude: 77.6388 },
  { latitude: 12.9728, longitude: 77.6360 },
  { latitude: 12.9700, longitude: 77.6332 },
  { latitude: 12.9672, longitude: 77.6308 },
  { latitude: 12.9648, longitude: 77.6284 },
  { latitude: 12.9628, longitude: 77.6262 },
  { latitude: 12.9608, longitude: 77.6244 },
  { latitude: 12.9590, longitude: 77.6230 },
  { latitude: 12.9570, longitude: 77.6218 }, // Customer home – HSR Layout
];

const STORE: Coordinates = DEMO_ROUTE[0];
const CUSTOMER: Coordinates = DEMO_ROUTE[DEMO_ROUTE.length - 1];

export function TestTrackingScreen({ navigation }: any) {
  return (
    <OrderTrackingScreen
      navigation={navigation}
      mode="customer"
      orderId="fixture-order-001"
      partnerName="Arjun Kumar"
      partnerRating={4.9}
      storeName="Fresh Mart"
      storeLocation={STORE}
      destination={CUSTOMER}
      destinationLabel="Home"
      dropAddress="42, 5th Main, Sector 2, HSR Layout, Bengaluru – 560102"
      orderValue="350.00"
      itemCount={4}
      orderStatus="out_for_delivery"
      simulatedRoute={DEMO_ROUTE}
      simulationIntervalMs={5000}
    />
  );
}
