import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { radius, spacing, typography } from '../../../theme';
import { obColors } from '../theme';
import { PickedDoc } from '../types/domain';

interface Props {
  label: string;
  value: PickedDoc | null | undefined;
  onChange: (doc: PickedDoc | null) => void;
  error?: string | null;
}

export function FilePickerField({ label, value, onChange, error }: Props) {
  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const name = asset.fileName ?? `${label.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    onChange({ uri: asset.uri, name, type: asset.mimeType ?? 'image/jpeg' });
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={[styles.box, error ? styles.boxError : null]} onPress={pick} activeOpacity={0.85}>
        {value ? (
          <>
            <Image source={{ uri: value.uri }} style={styles.preview} />
            <TouchableOpacity style={styles.retakeBtn} onPress={pick}>
              <Ionicons name="camera" size={15} color={obColors.text} />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={22} color={obColors.textMuted} />
            <Text style={styles.placeholderText}>Tap to upload</Text>
          </View>
        )}
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.label, color: obColors.textMuted, marginBottom: spacing.xs, textTransform: 'uppercase' },
  box: {
    height: 120, borderWidth: 1, borderColor: obColors.border,
    borderRadius: radius.md, overflow: 'hidden', backgroundColor: obColors.surfaceMuted,
  },
  boxError: { borderColor: obColors.error },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  placeholderText: { ...typography.small, color: obColors.textMuted },
  preview: { flex: 1, width: '100%' },
  retakeBtn: {
    position: 'absolute', bottom: 10, left: '50%', transform: [{ translateX: -42 }],
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: obColors.surface, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  retakeText: { ...typography.small, color: obColors.text, fontWeight: '600' },
  error: { ...typography.small, color: obColors.error, marginTop: spacing.xs },
});
