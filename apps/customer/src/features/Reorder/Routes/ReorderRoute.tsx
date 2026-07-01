import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '../../../Common/components/ui/Skeleton';
import { API_STATUS } from '../../../Common/Constants';
import { useCartStore } from '../../Cart/Providers/useCartStore';
import { useOrderStore } from '../../Orders/Providers/useOrderStore';
import { useTheme } from '../../../theme/ThemeContext';
import { useReorderStore } from '../Providers/useReorderStore';
import { FrequentItem } from '../types';
import { Product } from '../../../types/shared';
import { FrequentItemCard } from '../components/FrequentItemCard';
import { ReorderPastOrderCard } from '../components/ReorderPastOrderCard';

export default observer(function ReorderRoute() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reorderStore = useReorderStore();
  const orderStore = useOrderStore();
  const cartStore = useCartStore();

  const [expandedSkipped, setExpandedSkipped] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      reorderStore.fetchFrequentItems();
      orderStore.fetchOrders();
      return () => {
        reorderStore.clearAllResults();
      };
    }, []),
  );

  const toggleSkipped = (orderId: string) => {
    setExpandedSkipped((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const handleAddFrequent = (item: FrequentItem) => {
    if (!item.is_in_stock) return;
    const product: Product = {
      id: item.product_id,
      storeId: item.shop_id,
      storeName: item.shop_name,
      name: item.product_name,
      description: '',
      imageUrl: item.product_image,
      price: parseFloat(item.mrp),
      discountPrice: parseFloat(item.selling_price),
      gstPercent: 0,
      inStock: item.is_in_stock,
      stockCount: item.available_stock,
      category: '',
      isBargainable: false,
      rating: 0,
      variantId: item.variant_id,
      variantName: item.variant_name,
    };
    const existing = cartStore.items.find((i) => i.product.variantId === item.variant_id);
    cartStore.setQuantity(product, (existing?.quantity ?? 0) + 1);
  };

  const handleDecreaseFrequent = (item: FrequentItem) => {
    const existing = cartStore.items.find((i) => i.product.variantId === item.variant_id);
    if (!existing) return;
    const product: Product = {
      id: item.product_id,
      storeId: item.shop_id,
      storeName: item.shop_name,
      name: item.product_name,
      description: '',
      imageUrl: item.product_image,
      price: parseFloat(item.mrp),
      discountPrice: parseFloat(item.selling_price),
      gstPercent: 0,
      inStock: item.is_in_stock,
      stockCount: item.available_stock,
      category: '',
      isBargainable: false,
      rating: 0,
      variantId: item.variant_id,
      variantName: item.variant_name,
    };
    cartStore.setQuantity(product, existing.quantity - 1);
  };

  const completedOrders = orderStore.completedOrders.slice(0, 5);
  const isFreqLoading =
    reorderStore.fetchStatus === API_STATUS.FETCHING && reorderStore.frequentItems.length === 0;
  const isFreqError =
    reorderStore.fetchStatus === API_STATUS.ERROR && reorderStore.frequentItems.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" />

      <View
        style={{
          backgroundColor: '#16A34A',
          paddingTop: insets.top + 8,
          paddingBottom: 14,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontFamily: theme.typography.fonts.bold, color: '#fff' }}>
            Reorder
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: theme.typography.fonts.medium, marginTop: 1 }}>
            Quick-add your favourites
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={22} color="#fff" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: theme.typography.fonts.bold,
              color: theme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 0.7,
            }}
          >
            Buy again
          </Text>
        </View>

        {isFreqLoading && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 10 }} scrollEnabled={false}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ width: 118, backgroundColor: 'transparent' }}>
                <Skeleton width={118} height={76} borderRadius={12} />
                <View style={{ paddingTop: 8, gap: 6 }}>
                  <Skeleton width={90} height={10} borderRadius={6} />
                  <Skeleton width={60} height={10} borderRadius={6} />
                  <Skeleton width={40} height={12} borderRadius={6} />
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {isFreqError && (
          <Pressable
            onPress={() => reorderStore.fetchFrequentItems()}
            style={{
              marginHorizontal: 20,
              marginBottom: 12,
              backgroundColor: '#ECFDF5',
              borderRadius: 10,
              padding: 14,
              alignItems: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Ionicons name="refresh-outline" size={16} color="#16A34A" />
            <Text style={{ color: '#065F46', fontFamily: theme.typography.fonts.medium, fontSize: 13 }}>
              Couldn't load. Tap to retry
            </Text>
          </Pressable>
        )}

        {!isFreqLoading && !isFreqError && reorderStore.frequentItems.length === 0 && (
          <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 28 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Ionicons name="heart-outline" size={36} color="#16A34A" />
            </View>
            <Text style={{ fontSize: 15, fontFamily: theme.typography.fonts.bold, color: theme.colors.textPrimary, marginBottom: 6, textAlign: 'center' }}>
              No favourites yet
            </Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fonts.medium, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 19 }}>
              Complete a few orders and your most-ordered items will show up here for quick reorder.
            </Text>
          </View>
        )}

        {reorderStore.frequentItems.length > 0 && (
          <FlashList
            horizontal
            data={reorderStore.frequentItems}
            keyExtractor={(item) => item.variant_id}
            renderItem={({ item }) => (
              <FrequentItemCard
                item={item}
                cartQuantity={cartStore.items.find((i) => i.product.variantId === item.variant_id)?.quantity ?? 0}
                onAdd={handleAddFrequent}
                onDecrease={handleDecreaseFrequent}
              />
            )}
            extraData={cartStore.items.map((i) => `${i.product.variantId}:${i.quantity}`).join(',')}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
          />
        )}

        <View style={{ height: 0.5, backgroundColor: theme.colors.border, marginHorizontal: 20, marginBottom: 16 }} />

        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: theme.typography.fonts.bold,
              color: theme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 0.7,
            }}
          >
            Past orders
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/orders')}>
            <Text style={{ fontSize: 12, color: '#16A34A', fontFamily: theme.typography.fonts.semiBold }}>
              View all
            </Text>
          </Pressable>
        </View>

        {orderStore.fetchStatus === API_STATUS.FETCHING && completedOrders.length === 0 && (
          <View style={{ gap: 12, paddingHorizontal: 20 }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={{ backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 0.5, borderColor: theme.colors.border, padding: 12, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Skeleton width={34} height={34} borderRadius={8} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <Skeleton width="60%" height={12} borderRadius={6} />
                    <Skeleton width="40%" height={10} borderRadius={6} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Skeleton width={70} height={24} borderRadius={6} />
                  <Skeleton width={70} height={24} borderRadius={6} />
                  <Skeleton width={50} height={24} borderRadius={6} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                  <Skeleton width={80} height={12} borderRadius={6} />
                  <Skeleton width={90} height={30} borderRadius={20} />
                </View>
              </View>
            ))}
          </View>
        )}

        {completedOrders.length === 0 && orderStore.fetchStatus === API_STATUS.SUCCESS && (
          <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 28 }}>
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Ionicons name="bag-handle-outline" size={40} color="#16A34A" />
            </View>
            <Text style={{ fontSize: 16, fontFamily: theme.typography.fonts.bold, color: theme.colors.textPrimary, marginBottom: 6, textAlign: 'center' }}>
              No past orders
            </Text>
            <Text style={{ fontSize: 13, fontFamily: theme.typography.fonts.medium, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 19 }}>
              Once you complete an order you'll be able to reorder it here in one tap.
            </Text>
          </View>
        )}

        {completedOrders.map((order) => (
          <ReorderPastOrderCard
            key={order.id}
            order={order}
            reorderStatus={reorderStore.reorderStatus.get(order.id)}
            reorderResult={reorderStore.reorderResult.get(order.id)}
            reorderError={reorderStore.reorderError.get(order.id)}
            isSkippedExpanded={expandedSkipped.has(order.id)}
            onReorder={() => reorderStore.reorder(order.id)}
            onToggleSkipped={() => toggleSkipped(order.id)}
            onClearResult={() => reorderStore.clearReorderResult(order.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
});
