import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '../../features/Auth/Providers/useAuthStore';
import { useStoresStore } from '../../features/Stores/Providers/useStoresStore';

const ACTIVE_COLOR = '#16A34A';
const INACTIVE_COLOR = '#9CA3AF';
const TAB_BAR_ANIMATION_DURATION = 350;
const TAB_ITEM_ANIMATION_DURATION = 200;
const INDICATOR_WIDTH = 28;
const INDICATOR_TOP = 56;

const TAB_CONFIG: Record<string, {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}> = {
  index:   { label: 'Home',    icon: 'home-outline',   iconActive: 'home'   },
  reorder: { label: 'Reorder', icon: 'repeat-outline', iconActive: 'repeat' },
  profile: { label: 'Account', icon: 'person-outline', iconActive: 'person' },
};

const VISIBLE_ROUTES = ['index', 'reorder', 'profile'];

interface TabItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ label, icon, iconActive, focused, onPress, onLongPress }) => {
  const scale = useSharedValue(focused ? 1.05 : 1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.05 : 1, { duration: TAB_ITEM_ANIMATION_DURATION });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabItem}>
      <Animated.View style={[styles.tabItemInner, animatedStyle]}>
        <Ionicons name={focused ? iconActive : icon} size={24} color={color} />
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, navigation, insets }) => {
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / VISIBLE_ROUTES.length;

  const visibleRoutes = state.routes.filter((r) => VISIBLE_ROUTES.includes(r.name));

  const activeIndex = VISIBLE_ROUTES.indexOf(state.routes[state.index]?.name ?? '');
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  const indicatorX = useSharedValue(safeIndex * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2);

  useEffect(() => {
    const idx = VISIBLE_ROUTES.indexOf(state.routes[state.index]?.name ?? '');
    if (idx >= 0) {
      indicatorX.value = withTiming(
        idx * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2,
        { duration: 250, easing: Easing.out(Easing.quad) },
      );
    }
  }, [state.index, tabWidth]);

  const indicatorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom, height: 58 + insets.bottom }]}>
      {/* Sliding underline — absolutely positioned below each icon */}
      <Animated.View style={[styles.slidingIndicator, indicatorAnimStyle]} />

      {visibleRoutes.map((route) => {
        const focused = state.routes[state.index]?.name === route.name;
        const config = TAB_CONFIG[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            label={config.label}
            icon={config.icon}
            iconActive={config.iconActive}
            focused={focused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

export default observer(function TabLayout() {
  const authStore = useAuthStore();
  const storesStore = useStoresStore();
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      router.replace('/landing');
    }
  }, [authStore.isAuthenticated]);

  const isTabBarVisible = storesStore.isTabBarVisible;

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const translateY = withTiming(isTabBarVisible ? 0 : 110, {
      duration: TAB_BAR_ANIMATION_DURATION,
    });
    return {
      transform: [{ translateY }],
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    };
  }, [isTabBarVisible]);

  if (!authStore.isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      tabBar={(props) => (
        <Animated.View style={animatedTabBarStyle}>
          <FloatingTabBar {...props} />
        </Animated.View>
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"      options={{ title: 'Home' }} />
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="orders"     options={{ href: null }} />
      <Tabs.Screen name="reorder"    options={{ title: 'Reorder' }} />
      <Tabs.Screen name="profile"    options={{ title: 'Account' }} />
    </Tabs>
  );
});

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
  },
  tabItemInner: {
    alignItems: 'center',
    gap: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  slidingIndicator: {
    position: 'absolute',
    top: INDICATOR_TOP,
    left: 0,
    width: INDICATOR_WIDTH,
    height: 3,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
  },
});
