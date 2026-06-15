# DeliveryPartner App

A pixel-perfect, fully navigable Delivery Partner mobile app built with **Expo SDK 56**, **React Native 0.85**, and **TypeScript**. Matches the Swiggy/Zomato Delivery Partner app aesthetic. 100% frontend-only — no API calls, no auth tokens.

---

## Quick Start

```bash
cd DeliveryPartnerApp
npm install          # already done if you cloned this project
npx expo start       # opens Expo Dev Tools
```

Then scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

---

## Dependencies

All installed via `npx expo install`. Key packages:

| Package | Purpose |
|---|---|
| `expo` ~56.0.8 | Expo SDK |
| `react-native` 0.85.3 | Core framework |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/bottom-tabs` | 5-tab bottom nav |
| `@react-navigation/native-stack` | Stack navigators |
| `react-native-reanimated` | Animated online toggle, bottom sheets |
| `react-native-gesture-handler` | Gesture support |
| `zustand` | App-wide state (online toggle, booked gigs) |
| `expo-linear-gradient` | Gradient cards (earnings, order) |
| `@expo/vector-icons` | Ionicons throughout |

---

## Project Structure

```
src/
  mock/          → Static TypeScript mock data (no fetch calls)
  theme/         → Colors, typography, spacing tokens
  store/         → Zustand store (isOnline, bookedGigIds, activeOrder)
  components/    → 10 reusable components
  screens/       → All screens (onboarding + main app)
  navigation/    → RootNavigator, MainTabs, FeedStack, MoreStack
App.tsx          → Entry point
babel.config.js  → Reanimated plugin configured
```

---

## Navigation Map

```
RootNavigator
├── Onboarding (if isOnboarded = false)
│   ├── OtpScreen
│   ├── AadhaarScreen
│   ├── AadhaarOtpScreen
│   ├── PanScreen
│   ├── ShippingAddressScreen
│   └── ApplicationSubmittedScreen
└── MainApp → Bottom Tabs (5 tabs)
    ├── Feed → FeedStack
    │   ├── FeedScreen          (home, online toggle, simulate order)
    │   ├── ActiveOrderScreen   (triggered via "Simulate" button)
    │   ├── TripDetailScreen
    │   └── HelpCenterScreen
    ├── Earnings → EarningsScreen  (Day/Week/Month, bar chart)
    ├── Gigs → GigsScreen          (slot booking with checkboxes)
    ├── Pocket → PocketScreen      (balance, joining fee)
    └── More → MoreStack
        ├── MoreScreen             (profile, menu)
        ├── TripHistoryScreen
        ├── TripDetailScreen
        └── HelpCenterScreen
```

---

## Toggle Mock States

### Go Online / Offline
Tap the **Online/Offline toggle** on the Feed screen. State persists across all tabs via Zustand.

### Trigger Active Order
Tap the purple **"Simulate Incoming Order"** button on the Feed screen. Opens ActiveOrderScreen with mock trip data.

### Book Gigs
Go to **Gigs tab** → check slots → tap "Book now". Booked slots persist in Zustand and appear under the **Booked** filter tab.

### View Onboarding Flow
Go to **More tab** → tap "View Onboarding Flow". Walks through all 6 onboarding screens with mock verification.

### Change Onboarding State
In `src/store/useAppStore.ts`, change the initial value:
```ts
isOnboarded: false,  // shows onboarding flow on launch
isOnboarded: true,   // skips to main app (default)
```

### Change Mock Earnings
In `src/mock/index.ts`, edit `mockEarnings` values. The bar chart auto-scales based on values.

---

## Design Tokens

All colors and typography are defined in `src/theme/index.ts`:

- **Orange** `#FC8019` — primary CTAs, active states
- **Green** `#1BA672` — online status, completed trips
- **Teal** `#00897B` — earnings cards, ongoing badges
- **Black** `#1F1F1F` — primary text, shift headers
- **Gray** scale — dividers, muted text, placeholders
