import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { BottomTabBar } from 'expo-router/build/layouts/Tabs';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../features/Auth/Providers/useAuthStore';
import { useStoresStore } from '../../features/Stores/Providers/useStoresStore';
import { useTheme } from '../../theme/ThemeContext';

// Animation speed / duration (in ms) for hiding/showing the tab bar
const TAB_BAR_ANIMATION_DURATION = 350;

export default observer(function TabLayout() {
  const { theme, isDark } = useTheme();
  const authStore = useAuthStore();
  const storesStore = useStoresStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      router.replace('/landing');
    }
  }, [authStore.isAuthenticated]);

  const isTabBarVisible = storesStore.isTabBarVisible;

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const translateY = withTiming(isTabBarVisible ? 0 : 100, {
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

  const renderTabIcon = (focused: boolean, activeIcon: any, inactiveIcon: any, label: string) => {
    const activeColor = '#16A34A'; // fresh green accent
    const inactiveColor = isDark ? '#9CA3AF' : '#6B7280'; // monochrome minimal

    return (
      <View style={styles.tabItemContainer}>
        <Ionicons
          name={focused ? activeIcon : inactiveIcon}
          size={focused ? 21 : 19}
          color={focused ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.tabItemLabel,
            { color: focused ? activeColor : inactiveColor },
            focused && styles.tabItemLabelActive,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <Tabs
      tabBar={(props) => (
        <Animated.View style={animatedTabBarStyle}>
          <BottomTabBar {...props} />
        </Animated.View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 64,
        },
        tabBarIconStyle: {
          width: '100%',
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          height: 72 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderWidth: 0,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          shadowColor: '#16A34A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'home', 'home-outline', 'Home'),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'grid', 'grid-outline', 'Categories'),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Reorder',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'reload', 'reload-outline', 'Reorder'),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'heart', 'heart-outline', 'Wishlist'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'person', 'person-outline', 'Account'),
        }}
      />
    </Tabs>
  );
});

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 2,
  },
  tabItemLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  tabItemLabelActive: {
    fontFamily: 'Poppins-SemiBold',
  },
});
