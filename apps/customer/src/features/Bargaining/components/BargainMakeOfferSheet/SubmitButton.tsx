import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { Button } from '../../../../Common/components/ui/Button';
import { useOfferSheet } from './context';
import { lockedNoticeIconStyle, lockedNoticeStyle } from './styledcomponents';

export function SubmitButton() {
  const { theme } = useTheme();
  const { selectedItem, items, handleSubmit, onClose, isActive } = useOfferSheet();

  if (selectedItem) {
    return (
      <Button
        label="Send offer"
        onPress={() => handleSubmit(onClose)}
        size="lg"
        disabled={!isActive}
      />
    );
  }

  if (items.length > 0) {
    return (
      <View
        style={[
          lockedNoticeStyle,
          {
            backgroundColor: theme.dark
              ? 'rgba(250, 199, 117, 0.15)'
              : 'rgba(186, 117, 23, 0.1)',
          },
        ]}
      >
        <Ionicons
          name="lock-closed"
          size={18}
          color={theme.colors.warning}
          style={lockedNoticeIconStyle}
        />
        <Text style={[theme.textPresets.bodySmall, { color: theme.colors.warning, flex: 1 }]}>
          All items in this cart already have an offer under negotiation. Wait for the
          shop's response before making a new offer.
        </Text>
      </View>
    );
  }

  return null;
}
