import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { BargainOfferActions } from '../../types/actions';
import { useBargainTheme } from '../../context/BargainThemeContext';
import { createActionRowStyles } from './styles';

export interface ActionRowProps {
  /** Omit to render the "waiting for the other side" state instead of buttons. */
  actions?: BargainOfferActions;
  waitingLabel?: string;
}

export const ActionRow: React.FC<ActionRowProps> = ({ actions, waitingLabel = 'Waiting for response…' }) => {
  const styles = createActionRowStyles(useBargainTheme());

  if (!actions) {
    return (
      <View style={styles.waitingRow}>
        <View style={styles.waitingDot} />
        <Text style={styles.waitingLabel}>{waitingLabel}</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Pressable style={[styles.chip, styles.acceptChip]} onPress={actions.onAccept}>
        <Text style={[styles.chipLabel, styles.acceptLabel]}>Accept</Text>
      </Pressable>
      <Pressable style={styles.chip} onPress={actions.onCounter}>
        <Text style={styles.chipLabel}>Counter</Text>
      </Pressable>
      <Pressable style={styles.chip} onPress={actions.onDecline}>
        <Text style={[styles.chipLabel, styles.declineLabel]}>Decline</Text>
      </Pressable>
    </View>
  );
};
