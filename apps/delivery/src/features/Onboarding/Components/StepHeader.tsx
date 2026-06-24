import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { obColors } from '../theme';

interface Props {
  title: string;
  stepNumber: number;
  onBack?: () => void;
}

export function StepHeader({ title, onBack }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={obColors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.helpBtn} activeOpacity={0.7}>
          <Ionicons name="headset-outline" size={16} color={obColors.textMuted} />
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={18} color={obColors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: obColors.bg, borderBottomWidth: 1, borderBottomColor: obColors.border },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12, gap: 4 },
  iconBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: obColors.text, flex: 1, marginLeft: 4 },
  helpBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6 },
  helpText: { fontSize: 12, color: obColors.textMuted },
});
