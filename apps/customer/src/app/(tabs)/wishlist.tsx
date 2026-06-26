import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useReorderStore } from '../../features/Reorder/Providers/useReorderStore';
import { useOrderStore } from '../../features/Orders/Providers/useOrderStore';
import { useCartStore } from '../../features/Cart/Providers/useCartStore';
import { API_STATUS } from '../../Common/Constants';
import { FrequentItem, ReorderSkippedItem } from '../../features/Reorder/types';
import { Product } from '../../types/shared';

const SKIP_REASON_LABEL: Record<ReorderSkippedItem['reason'], string> = {
  out_of_stock: 'Out of stock',
  no_headroom: 'Stock limit reached',
  locked: 'Temporarily unavailable',
  inactive: 'No longer available',
};

export default observer(function ReorderScreen() {
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

  const completedOrders = orderStore.completedOrders.slice(0, 5);
  const isFreqLoading =
    reorderStore.fetchStatus === API_STATUS.FETCHING && reorderStore.frequentItems.length === 0;
  const isFreqError =
    reorderStore.fetchStatus === API_STATUS.ERROR && reorderStore.frequentItems.length === 0;

  const renderFreqCard = ({ item }: { item: FrequentItem }) => {
    const price = parseFloat(item.selling_price);
    const inCart = cartStore.items.find((i) => i.product.variantId === item.variant_id);
    return (
      <View
        style={{
          width: 118,
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: theme.colors.border,
          overflow: 'hidden',
          marginRight: 10,
        }}
      >
        <View
          style={{
            width: '100%',
            height: 76,
            backgroundColor: '#ECFDF5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.product_image ? (
            <Image
              source={{ uri: item.product_image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="leaf-outline" size={28} color="#16A34A" />
          )}
          {!item.is_in_stock && (
            <View
              style={{
                position: 'absolute',
                top: 5,
                left: 5,
                backgroundColor: '#FEF2F2',
                borderRadius: 4,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 9, color: '#DC2626', fontFamily: theme.typography.fonts.semiBold }}>
                Out of stock
              </Text>
            </View>
          )}
          {inCart && (
            <View
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: '#16A34A',
                borderRadius: 8,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 9, color: '#fff', fontFamily: theme.typography.fonts.semiBold }}>
                {inCart.quantity} in cart
              </Text>
            </View>
          )}
        </View>

        <View style={{ padding: 8, paddingBottom: 4 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 11,
              fontFamily: theme.typography.fonts.semiBold,
              color: theme.colors.textPrimary,
              lineHeight: 15,
              marginBottom: 2,
            }}
          >
            {item.product_name}
          </Text>
          <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular }}>
            {item.variant_name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.typography.fonts.bold,
              color: item.is_in_stock ? '#16A34A' : theme.colors.textSecondary,
              marginTop: 4,
            }}
          >
            ₹{price.toFixed(0)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
            paddingBottom: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="repeat-outline" size={10} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }}>
              {item.order_count}×
            </Text>
          </View>

          {item.is_in_stock ? (
            <Pressable
              onPress={() => handleAddFrequent(item)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: '#16A34A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#fff', lineHeight: 22, marginTop: -1 }}>+</Text>
            </Pressable>
          ) : (
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: theme.colors.surfaceSecondary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" />

      {/* Green header */}
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

        {/* Buy Again section */}
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
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator color="#16A34A" />
          </View>
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
          <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: 13 }}>
              Complete a few orders and your favourites will appear here.
            </Text>
          </View>
        )}

        {reorderStore.frequentItems.length > 0 && (
          <FlatList
            horizontal
            data={reorderStore.frequentItems}
            keyExtractor={(item) => item.variant_id}
            renderItem={renderFreqCard}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
            scrollEnabled
          />
        )}

        {/* Divider */}
        <View style={{ height: 0.5, backgroundColor: theme.colors.border, marginHorizontal: 20, marginBottom: 16 }} />

        {/* Past Orders section */}
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
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator color="#16A34A" />
          </View>
        )}

        {completedOrders.length === 0 && orderStore.fetchStatus === API_STATUS.SUCCESS && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium, fontSize: 13 }}>
              No completed orders yet.
            </Text>
          </View>
        )}

        {completedOrders.map((order) => {
          const orderId = order.id;
          const status = reorderStore.reorderStatus.get(orderId);
          const result = reorderStore.reorderResult.get(orderId);
          const err = reorderStore.reorderError.get(orderId);
          const isFetching = status === API_STATUS.FETCHING;
          const isDone = status === API_STATUS.SUCCESS && !!result;
          const isSkippedExpanded = expandedSkipped.has(orderId);

          return (
            <View
              key={orderId}
              style={{
                marginHorizontal: 20,
                marginBottom: 12,
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                borderWidth: 0.5,
                borderColor: theme.colors.border,
                overflow: 'hidden',
              }}
            >
              {/* Order header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  padding: 12,
                  borderBottomWidth: 0.5,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: '#ECFDF5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="storefront-outline" size={17} color="#16A34A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontFamily: theme.typography.fonts.semiBold, color: theme.colors.textPrimary }}>
                    {order.storeName}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.regular, marginTop: 1 }}>
                    {order.formattedDate} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {/* Item pills */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 10, paddingBottom: 6 }}>
                {order.items.slice(0, 3).map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: theme.colors.surfaceSecondary,
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }}>
                      {item.productName}
                    </Text>
                  </View>
                ))}
                {order.items.length > 3 && (
                  <Text style={{ fontSize: 11, color: theme.colors.textSecondary, alignSelf: 'center', fontFamily: theme.typography.fonts.medium }}>
                    +{order.items.length - 3} more
                  </Text>
                )}
              </View>

              {/* Footer */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                  paddingTop: 6,
                  borderTopWidth: 0.5,
                  borderTopColor: theme.colors.border,
                }}
              >
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }}>
                  Total{' '}
                  <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }}>
                    {order.formattedTotal}
                  </Text>
                </Text>

                {!isDone && (
                  <Pressable
                    onPress={() => reorderStore.reorder(orderId)}
                    disabled={isFetching}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      backgroundColor: '#ECFDF5',
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      opacity: isFetching ? 0.7 : 1,
                    }}
                  >
                    {isFetching ? (
                      <ActivityIndicator size={12} color="#16A34A" />
                    ) : (
                      <Ionicons name="refresh-outline" size={13} color="#065F46" />
                    )}
                    <Text style={{ fontSize: 12, fontFamily: theme.typography.fonts.semiBold, color: '#065F46' }}>
                      {isFetching ? 'Adding…' : 'Reorder all'}
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Inline result feedback */}
              {isDone && result && (
                <View style={{ borderTopWidth: 0.5, borderTopColor: theme.colors.border, padding: 10, gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: '#ECFDF5',
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                      }}
                    >
                      <Ionicons name="checkmark-circle-outline" size={14} color="#16A34A" />
                      <Text style={{ fontSize: 12, color: '#065F46', fontFamily: theme.typography.fonts.semiBold }}>
                        {result.added.length} item{result.added.length !== 1 ? 's' : ''} added
                      </Text>
                    </View>

                    {result.skipped.length > 0 && (
                      <Pressable
                        onPress={() => toggleSkipped(orderId)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          backgroundColor: '#FEF3C7',
                          borderRadius: 20,
                          paddingHorizontal: 12,
                          paddingVertical: 5,
                        }}
                      >
                        <Ionicons name="alert-circle-outline" size={14} color="#B45309" />
                        <Text style={{ fontSize: 12, color: '#92400E', fontFamily: theme.typography.fonts.semiBold }}>
                          {result.skipped.length} skipped
                        </Text>
                        <Ionicons
                          name={isSkippedExpanded ? 'chevron-up' : 'chevron-down'}
                          size={12}
                          color="#92400E"
                        />
                      </Pressable>
                    )}

                    <Pressable onPress={() => reorderStore.clearReorderResult(orderId)} style={{ marginLeft: 'auto' }}>
                      <Ionicons name="close" size={16} color={theme.colors.textSecondary} />
                    </Pressable>
                  </View>

                  {isSkippedExpanded && result.skipped.length > 0 && (
                    <View style={{ gap: 6, marginTop: 2 }}>
                      {result.skipped.map((skipped) => (
                        <View
                          key={skipped.variant_id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FEF2F2',
                            borderRadius: 8,
                            padding: 8,
                            gap: 8,
                          }}
                        >
                          <View
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              backgroundColor: '#FEE2E2',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Ionicons name="close-circle-outline" size={15} color="#DC2626" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, fontFamily: theme.typography.fonts.semiBold, color: theme.colors.textPrimary }}>
                              {skipped.product_name} {skipped.variant_name}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#DC2626', fontFamily: theme.typography.fonts.medium, marginTop: 1 }}>
                              {SKIP_REASON_LABEL[skipped.reason] ?? skipped.reason}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Error state */}
              {err && (
                <View
                  style={{
                    borderTopWidth: 0.5,
                    borderTopColor: theme.colors.border,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons name="warning-outline" size={14} color="#DC2626" />
                  <Text style={{ fontSize: 12, color: '#DC2626', fontFamily: theme.typography.fonts.medium, flex: 1 }}>
                    {err}
                  </Text>
                  <Pressable onPress={() => reorderStore.clearReorderResult(orderId)}>
                    <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});
