import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { useBargainingStore } from '@/features/Bargaining/Providers/useBargainingStore';
import { BargainTimelineList } from '@/features/Bargaining/components/BargainTimelineList';
import { EmptyState } from '@/Common/components/ui/EmptyState';
import { Badge } from '@/Common/components/ui/Badge';
import { API_STATUS } from '@/Common/Constants';

export default observer(function BargainSessionHistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const bargainingStore = useBargainingStore();

  useEffect(() => {
    if (sessionId) bargainingStore.loadSessionHistory(sessionId);
  }, [sessionId]);

  const history = bargainingStore.sessionHistory;
  const statusVariant = history?.status === 'ACTIVE' ? 'success' : history?.status === 'EXPIRED' ? 'warning' : 'secondary';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            theme.textPresets.bodyLarge,
            { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold, marginLeft: 12, flex: 1 },
          ]}
          numberOfLines={1}
        >
          Bargain History
        </Text>
        {history && <Badge label={history.status} variant={statusVariant} size="sm" />}
      </View>

      {(bargainingStore.sessionHistoryStatus === API_STATUS.FETCHING || bargainingStore.sessionHistoryStatus === API_STATUS.IDLE) && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      )}

      {bargainingStore.sessionHistoryStatus === API_STATUS.ERROR && (
        <EmptyState
          title="Unable to load history"
          description={bargainingStore.sessionHistoryError ?? 'This bargaining session history could not be found.'}
          iconName="time-outline"
          style={{ flex: 1, justifyContent: 'center' }}
        />
      )}

      {bargainingStore.sessionHistoryStatus === API_STATUS.SUCCESS && history && (
        <BargainTimelineList timeline={history.timeline} />
      )}
    </View>
  );
});
