import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { OrderModel } from '../../../Orders/Models/OrderModel';
import { useTheme } from '../../../../theme/ThemeContext';
import { ApiStatus, API_STATUS } from '../../../../Common/Constants';
import { ReorderResult, ReorderSkippedItem } from '../../types';
import {
  addedChipStyle,
  cardStyle,
  errorRowStyle,
  footerStyle,
  headerStyle,
  pillsRowStyle,
  pillStyle,
  reorderBtnStyle,
  resultChipsRowStyle,
  resultRowStyle,
  skippedChipStyle,
  skippedIconBoxStyle,
  skippedItemStyle,
  skippedListStyle,
  storeIconStyle,
} from './styledcomponents';

const SKIP_REASON_LABEL: Record<ReorderSkippedItem['reason'], string> = {
  out_of_stock: 'Out of stock',
  no_headroom: 'Stock limit reached',
  locked: 'Temporarily unavailable',
  inactive: 'No longer available',
};

interface ReorderPastOrderCardProps {
  order: OrderModel;
  reorderStatus: ApiStatus | undefined;
  reorderResult: ReorderResult | undefined;
  reorderError: string | undefined;
  isSkippedExpanded: boolean;
  onReorder: () => void;
  onToggleSkipped: () => void;
  onClearResult: () => void;
}

export const ReorderPastOrderCard: React.FC<ReorderPastOrderCardProps> = ({
  order,
  reorderStatus,
  reorderResult,
  reorderError,
  isSkippedExpanded,
  onReorder,
  onToggleSkipped,
  onClearResult,
}) => {
  const { theme } = useTheme();
  const isFetching = reorderStatus === API_STATUS.FETCHING;
  const isDone = reorderStatus === API_STATUS.SUCCESS && !!reorderResult;

  return (
    <View style={[cardStyle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[headerStyle, { borderBottomColor: theme.colors.border }]}>
        <View style={storeIconStyle}>
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

      <View style={pillsRowStyle}>
        {order.items.slice(0, 3).map((item, idx) => (
          <View key={idx} style={[pillStyle, { backgroundColor: theme.colors.surfaceSecondary }]}>
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

      <View style={[footerStyle, { borderTopColor: theme.colors.border }]}>
        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.medium }}>
          Total{' '}
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.bold }}>
            {order.formattedTotal}
          </Text>
        </Text>
        {!isDone && (
          <Pressable onPress={onReorder} disabled={isFetching} style={[reorderBtnStyle, { opacity: isFetching ? 0.7 : 1 }]}>
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

      {isDone && reorderResult && (
        <View style={[resultRowStyle, { borderTopColor: theme.colors.border }]}>
          <View style={resultChipsRowStyle}>
            <View style={addedChipStyle}>
              <Ionicons name="checkmark-circle-outline" size={14} color="#16A34A" />
              <Text style={{ fontSize: 12, color: '#065F46', fontFamily: theme.typography.fonts.semiBold }}>
                {reorderResult.added.length} item{reorderResult.added.length !== 1 ? 's' : ''} added
              </Text>
            </View>
            {reorderResult.skipped.length > 0 && (
              <Pressable onPress={onToggleSkipped} style={skippedChipStyle}>
                <Ionicons name="alert-circle-outline" size={14} color="#B45309" />
                <Text style={{ fontSize: 12, color: '#92400E', fontFamily: theme.typography.fonts.semiBold }}>
                  {reorderResult.skipped.length} skipped
                </Text>
                <Ionicons name={isSkippedExpanded ? 'chevron-up' : 'chevron-down'} size={12} color="#92400E" />
              </Pressable>
            )}
            <Pressable onPress={onClearResult} style={{ marginLeft: 'auto' }}>
              <Ionicons name="close" size={16} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
          {isSkippedExpanded && reorderResult.skipped.length > 0 && (
            <View style={skippedListStyle}>
              {reorderResult.skipped.map((skipped) => (
                <View key={skipped.variant_id} style={skippedItemStyle}>
                  <View style={skippedIconBoxStyle}>
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

      {reorderError && (
        <View style={[errorRowStyle, { borderTopColor: theme.colors.border }]}>
          <Ionicons name="warning-outline" size={14} color="#DC2626" />
          <Text style={{ fontSize: 12, color: '#DC2626', fontFamily: theme.typography.fonts.medium, flex: 1 }}>
            {reorderError}
          </Text>
          <Pressable onPress={onClearResult}>
            <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReorderPastOrderCard;
