import { Tabs } from 'expo-router';
import { Boxes, Clipboard, Home, MessagesSquare, Plus } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

const TABS = [
  { name: 'home/index', label: 'Home', Icon: Home },
  { name: 'orders/index', label: 'Orders', Icon: Clipboard },
  { name: 'products/index', label: '', Icon: Plus, isCenter: true },
  { name: 'inventory/index', label: 'Inventory', Icon: Boxes },
  { name: 'bargaining/index', label: 'Bargains', Icon: MessagesSquare },
];

// ── Individual tab item with press-scale micro-interaction ─────────────────
function TabItem({
  name,
  label,
  Icon,
  focused,
  isCenter,
  onPress,
}: {
  name: string;
  label: string;
  Icon: React.ComponentType<any>;
  focused: boolean;
  isCenter?: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
      bounciness: 6,
    }).start();
  };

  if (isCenter) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        style={styles.centerItemWrap}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.centerButton,
            { transform: [{ scale }] },
          ]}
        >
          <Icon color={Colors.white} size={24} strokeWidth={2.8} />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  const color = focused ? Colors.primary : '#64748B';
  const strokeWidth = focused ? 2.2 : 1.8;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      activeOpacity={1}
      style={styles.item}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.iconWrap,
          { transform: [{ scale }] },
        ]}
      >
        <Icon color={color} size={22} strokeWidth={strokeWidth} />
      </Animated.View>
      <Text style={[styles.label, focused && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Custom tab bar matching mockup ──────────────────────────────────────────
function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 12), paddingTop: 10 },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const tab = TABS.find(t => t.name === route.name);
        if (!tab) return null;

        return (
          <TabItem
            key={route.key}
            name={route.name}
            label={tab.label}
            Icon={tab.Icon}
            focused={focused}
            isCenter={tab.isCenter}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          />
        );
      })}
    </View>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map(({ name, label }) => (
        <Tabs.Screen key={name} name={name} options={{ title: label }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    gap: 4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  centerItemWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    top: -12, // slightly floating up
  },
});

