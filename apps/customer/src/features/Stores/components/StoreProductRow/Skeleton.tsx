import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../../Common/components/ui/Skeleton';
import { useTheme } from '../../../../theme/ThemeContext';

export const StoreProductRowSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.left}>
        <Skeleton width={90} height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
        <Skeleton width={60} height={16} style={{ marginBottom: 10 }} />
        <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={12} style={{ marginBottom: 12 }} />
        <View style={styles.actionRow}>
          <Skeleton width={28} height={28} variant="circle" style={{ marginRight: 10 }} />
          <Skeleton width={28} height={28} variant="circle" />
        </View>
      </View>
      <View style={styles.right}>
        <Skeleton width={120} height={120} borderRadius={16} />
        <Skeleton width={96} height={36} borderRadius={18} style={styles.addBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1, marginHorizontal: 16 },
  left: { flex: 1, paddingRight: 16 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  right: { width: 120, alignItems: 'center', position: 'relative' },
  addBtn: { position: 'absolute', bottom: -10 },
});

export default StoreProductRowSkeleton;
