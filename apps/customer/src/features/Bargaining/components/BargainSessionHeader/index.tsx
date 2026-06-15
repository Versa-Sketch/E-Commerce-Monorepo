import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { useBargainingStore } from '../../Providers/useBargainingStore';
import { Avatar } from '../../../../Common/components/ui/Avatar';
import {
  avatarStyle,
  endButtonStyle,
  headerContainerStyle,
  statusDotStyle,
  statusRowStyle,
  titleBlockStyle,
  titleTextStyle,
} from './styledcomponents';

const formatCountdown = (expiresAt: string): string => {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return '00:00';
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const BargainSessionHeader: React.FC = observer(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bargainingStore = useBargainingStore();
  const [, forceTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const session = bargainingStore.session;
  const status = session?.status ?? 'ACTIVE';
  const expiresAt = bargainingStore.expiresAt;
  const shopName = 'Bargain Session';

  const statusColor = status === 'ACTIVE' ? theme.colors.success : status === 'EXPIRED' ? theme.colors.warning : theme.colors.textMuted;
  const statusLabel =
    status === 'ACTIVE' && expiresAt
      ? `Negotiating · expires in ${formatCountdown(expiresAt)}`
      : status === 'EXPIRED'
      ? 'Session expired'
      : 'Session ended';

  const handleEndSession = () => {
    Alert.alert('End bargain session?', 'The shop will no longer be able to send or accept offers.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End session', style: 'destructive', onPress: () => bargainingStore.endSession() },
    ]);
  };

  return (
    <View style={[headerContainerStyle, { paddingTop: insets.top + 12, backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <Avatar name={shopName} size={36} style={avatarStyle} />
      <View style={titleBlockStyle}>
        <Text
          numberOfLines={1}
          style={[theme.textPresets.bodyLarge, titleTextStyle, { color: theme.colors.textPrimary, fontFamily: theme.typography.fonts.semiBold }]}
        >
          {shopName}
        </Text>
        <View style={statusRowStyle}>
          <View style={[statusDotStyle, { backgroundColor: statusColor }]} />
          <Text numberOfLines={1} style={[theme.textPresets.caption, { color: theme.colors.textSecondary }]}>
            {statusLabel}
          </Text>
        </View>
      </View>
      {bargainingStore.isActive && (
        <Pressable onPress={handleEndSession} style={endButtonStyle} hitSlop={8}>
          <Ionicons name="close-circle-outline" size={24} color={theme.colors.error} />
        </Pressable>
      )}
    </View>
  );
});
export default BargainSessionHeader;
