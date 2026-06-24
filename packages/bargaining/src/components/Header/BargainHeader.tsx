import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../colors';
import { GatewayConnectionStatus } from '../../client/BargainGatewaySocket';
import { ConnectionStatusPill } from '../DealVisuals/ConnectionStatusPill';
import { CountdownBadge } from '../DealVisuals/CountdownBadge';

interface Props {
  counterpartyName: string;
  secondsLeft: number;
  connectionStatus: GatewayConnectionStatus;
  onBack?: () => void;
  onEndSession?: () => void;
}

export function BargainHeader({ counterpartyName, secondsLeft, connectionStatus, onBack, onEndSession }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.titleCol}>
          <Text style={styles.name}>{counterpartyName}</Text>
          <ConnectionStatusPill status={connectionStatus} />
        </View>
        <CountdownBadge seconds={secondsLeft} size="sm" />
      </View>
      {onEndSession ? (
        <TouchableOpacity onPress={onEndSession} style={styles.endBtn}>
          <Text style={styles.endText}>End session</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { paddingRight: 4 },
  backText: { fontSize: 26, color: Colors.textPrimary },
  titleCol: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  endBtn: { marginTop: 8, alignSelf: 'flex-end' },
  endText: { fontSize: 12, fontWeight: '600', color: Colors.error },
});
