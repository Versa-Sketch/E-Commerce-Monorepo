import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Avatar } from '../Avatar';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createChatHeaderStyles } from './styles';

export interface ChatHeaderProps {
  name: string;
  avatarImageUrl?: string;
  /** Customer app shows the store icon; merchant app shows the customer's initials. */
  showStoreIcon?: boolean;
  initials?: string;
  online?: boolean;
  onBack?: () => void;
  /** Slot for anything app-specific (e.g. a menu button) without forking this component. */
  rightSlot?: React.ReactNode;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatarImageUrl,
  showStoreIcon,
  initials,
  online,
  onBack,
  rightSlot,
}) => {
  const theme = useBargainTheme();
  const styles = createChatHeaderStyles(theme);

  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable style={styles.backButton} onPress={onBack} accessibilityLabel="Back">
          <ArrowLeft size={18} color={theme.colors.textSecondary} />
        </Pressable>
      ) : null}

      <Avatar imageUrl={avatarImageUrl} showStoreIcon={showStoreIcon} initials={initials} size={34} />

      <View style={styles.nameBlock}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {online !== undefined && (
          <View style={styles.statusRow}>
            {online && <View style={styles.onlineDot} />}
            <Text style={styles.statusLabel}>{online ? 'Online' : 'Offline'}</Text>
          </View>
        )}
      </View>

      {rightSlot}
    </View>
  );
};
