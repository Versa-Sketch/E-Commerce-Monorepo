import React, { useState } from 'react';
import {
  Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { appStore } from '../store/useAppStore';
import { DispatchService } from '../services/dispatch';
import { ApiError } from '../services/http';
import { colors, typography, spacing, radius } from '../theme';

const MIN_PHOTOS = 1;
const MAX_PHOTOS = 4;

const PHOTO_HINTS = ['Order bag', 'Receipt / bill', 'Sealed bag', 'Items visible'];

export function PhotoUploadScreen({ navigation }: any) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const order = appStore.activeOrderDetail;
  const canSubmit = photos.length >= MIN_PHOTOS;

  async function pickPhoto(index: number) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      if (cam.status !== 'granted') {
        Alert.alert('Permission required', 'Camera or gallery access is needed to upload photos.');
        return;
      }
    }

    Alert.alert('Add photo', 'Choose source', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!result.canceled && result.assets[0]) {
            addPhoto(index, result.assets[0].uri);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!result.canceled && result.assets[0]) {
            addPhoto(index, result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function addPhoto(index: number, uri: string) {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = uri;
      return next;
    });
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }

  async function handleSubmit() {
    if (!order || !canSubmit || loading) return;

    if (__DEV__) {
      navigation.navigate('DropNavigation');
      return;
    }

    setLoading(true);
    try {
      await DispatchService.uploadPhotos(order.order_id, photos);
      navigation.navigate('DropNavigation');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Photo upload failed. Please try again.';
      Alert.alert('Upload failed', message);
    } finally {
      setLoading(false);
    }
  }

  const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => i);
  const progressPct = Math.min((photos.filter(Boolean).length / MIN_PHOTOS) * 100, 100);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Photo verification</Text>
          <Text style={styles.headerSub}>Take clear photos of the order before delivery</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Photos added</Text>
            <Text style={styles.progressCount}>
              {photos.filter(Boolean).length} / {MIN_PHOTOS} required
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        {/* Photo grid */}
        <View style={styles.grid}>
          {slots.map((i) => {
            const uri = photos[i];
            return uri ? (
              <View key={i} style={styles.photoSlot}>
                <Image source={{ uri }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removePhoto(i)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={22} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                key={i}
                style={styles.emptySlot}
                onPress={() => pickPhoto(i)}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={28} color={colors.gray300} />
                <Text style={styles.slotHint}>{PHOTO_HINTS[i]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Instruction */}
        <View style={styles.infoCard}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.gray700} />
          <Text style={styles.infoText}>
            Ensure bags are sealed, items are visible, and the receipt is legible.
            At least {MIN_PHOTOS} photo{MIN_PHOTOS > 1 ? 's are' : ' is'} required.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || loading) && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.white} />
              <Text style={styles.submitBtnText}>Submit &amp; start delivery</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },

  header: {
    backgroundColor: colors.black87,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', gap: 4 },
  headerTitle: { ...typography.h2, color: colors.white },
  headerSub: { ...typography.small, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },

  scroll: { padding: spacing.lg, gap: spacing.md },

  progressSection: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { ...typography.body, color: colors.black87, fontWeight: '600' },
  progressCount: { ...typography.body, color: colors.gray300 },
  progressTrack: {
    height: 4, backgroundColor: colors.gray100, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.black87, borderRadius: 2 },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  photoSlot: {
    width: '47.5%', aspectRatio: 4 / 3,
    borderRadius: radius.lg, overflow: 'hidden', position: 'relative',
  },
  photoImage: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 6, right: 6,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  checkBadge: {
    position: 'absolute', bottom: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center', justifyContent: 'center',
  },
  emptySlot: {
    width: '47.5%', aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.gray100,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  slotHint: { ...typography.small, color: colors.gray300, textAlign: 'center' },

  infoCard: {
    backgroundColor: colors.gray50, borderRadius: radius.lg,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderWidth: 1, borderColor: colors.gray100,
  },
  infoText: { ...typography.small, color: colors.gray700, flex: 1, lineHeight: 18 },

  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.gray100,
  },
  submitBtn: {
    backgroundColor: colors.black87,
    borderRadius: radius.lg,
    paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  submitBtnText: { ...typography.h3, color: colors.white },
  btnDisabled: { opacity: 0.4 },
});
