import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useOnboardingStore } from '../features/Onboarding/Store/useOnboardingStore';
import { getRejectedDocuments } from '../features/Onboarding/utils/documents';
import { StorageService } from '../services/storage';
import { typography } from '../theme';

export const APPROVED_BANNER_SEEN_KEY = 'delivery_approved_banner_seen';

const tone = {
  amber: { bg: '#FFF8E1', border: '#FFE7A0', icon: '#8A6116', title: '#5C4310', body: '#8A6116' },
  red: { bg: '#FCEBEB', border: '#F7C1C1', icon: '#791F1F', title: '#501313', body: '#791F1F' },
  green: { bg: '#EAF3DE', border: '#C0DD97', icon: '#27500A', title: '#173404', body: '#3B6D11' },
};

export function OnboardingStatusBanner({ navigation }: any) {
  const onboardingStatus = useOnboardingStore((s) => s.onboardingStatus);
  const documents = useOnboardingStore((s) => s.prefill?.documents);
  const [approvedSeen, setApprovedSeen] = useState(true);

  useEffect(() => {
    setApprovedSeen(StorageService.getString(APPROVED_BANNER_SEEN_KEY) === 'true');
  }, []);

  const dismissApprovedBanner = () => {
    StorageService.set(APPROVED_BANNER_SEEN_KEY, 'true');
    setApprovedSeen(true);
  };

  if (onboardingStatus === 'SUBMITTED' || onboardingStatus === 'UNDER_REVIEW') {
    const t = tone.amber;
    return (
      <View style={[styles.banner, { backgroundColor: t.bg, borderColor: t.border }]}>
        <Ionicons name="time-outline" size={18} color={t.icon} />
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: t.title }]}>Application under review</Text>
          <Text style={[styles.body, { color: t.body }]}>
            We're verifying your documents. This usually takes 24 to 48 hours.
          </Text>
        </View>
      </View>
    );
  }

  if (onboardingStatus === 'REJECTED') {
    const t = tone.red;
    const rejectedCount = getRejectedDocuments(documents).length;
    return (
      <View style={[styles.banner, { backgroundColor: t.bg, borderColor: t.border }]}>
        <Ionicons name="close-circle-outline" size={18} color={t.icon} />
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: t.title }]}>
            {rejectedCount > 0 ? `${rejectedCount} document${rejectedCount > 1 ? 's' : ''} need to be reuploaded` : 'Application rejected'}
          </Text>
          <Text style={[styles.body, { color: t.body }]}>Some photos didn't pass verification.</Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: t.icon }]}
            onPress={() => navigation.navigate('ReuploadDocuments')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>Review and reupload</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (onboardingStatus === 'SUSPENDED') {
    const t = tone.red;
    return (
      <View style={[styles.banner, { backgroundColor: t.bg, borderColor: t.border }]}>
        <Ionicons name="warning-outline" size={18} color={t.icon} />
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: t.title }]}>Account suspended</Text>
          <Text style={[styles.body, { color: t.body }]}>Contact support to find out why and resolve it.</Text>
        </View>
      </View>
    );
  }

  if (onboardingStatus === 'APPROVED' && !approvedSeen) {
    const t = tone.green;
    return (
      <View style={[styles.banner, { backgroundColor: t.bg, borderColor: t.border, alignItems: 'center' }]}>
        <Ionicons name="checkmark-circle-outline" size={18} color={t.icon} />
        <Text style={[styles.title, { color: t.title, flex: 1 }]}>You're approved! Start accepting orders.</Text>
        <TouchableOpacity onPress={dismissApprovedBanner}>
          <Ionicons name="close" size={16} color={t.body} />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 10,
    padding: 12, marginHorizontal: 16, marginTop: 12,
  },
  textCol: { flex: 1, gap: 2 },
  title: { ...typography.small, fontWeight: '600' },
  body: { ...typography.small },
  actionBtn: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, marginTop: 8 },
  actionText: { ...typography.small, color: '#FFFFFF', fontWeight: '600' },
});
