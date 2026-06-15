import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, typography } from '../../theme';

export function PanScreen({ navigation }: any) {
  const [pan, setPan] = useState('');
  const [sheet, setSheet] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.black87} />
        </TouchableOpacity>

        <View style={styles.illustration}>
          <View style={styles.viewfinder}>
            <Ionicons name="camera-outline" size={48} color={colors.gray300} />
            <Text style={styles.viewfinderText}>PAN Card</Text>
          </View>
        </View>

        <Text style={styles.badge}>PAN • PERMANENT ACCOUNT NUMBER</Text>
        <Text style={styles.heading}>Enter your PAN details</Text>

        <TextInput
          style={styles.input}
          placeholder="XXXXXXXXXX"
          autoCapitalize="characters"
          maxLength={10}
          value={pan}
          onChangeText={setPan}
          placeholderTextColor={colors.gray300}
        />

        <TouchableOpacity
          style={[styles.btn, pan.length < 10 && styles.btnDisabled]}
          onPress={() => pan.length >= 5 && setSheet(true)}
        >
          <Text style={styles.btnText}>Submit PAN</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={sheet} onClose={() => setSheet(false)} height={300}>
        <View style={styles.sheetContent}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color={colors.white} />
          </View>
          <Text style={styles.sheetTitle}>PAN details verified</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoVal}>KIRAN KUMAR CHENNA</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PAN</Text>
            <Text style={styles.infoVal}>ITXXXXXX6B</Text>
          </View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => { setSheet(false); navigation.navigate('ShippingAddress'); }}
          >
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  back: { marginBottom: 24 },
  illustration: { alignItems: 'center', marginBottom: 28 },
  viewfinder: {
    width: 200, height: 120, borderWidth: 2, borderColor: colors.gray100,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  viewfinderText: { ...typography.small, color: colors.gray300 },
  badge: {
    ...typography.label, color: colors.gray300,
    borderWidth: 1, borderColor: colors.gray100, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 12,
  },
  heading: { ...typography.h1, color: colors.black87, marginBottom: 24 },
  input: {
    borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 14, ...typography.h3,
    color: colors.black87, letterSpacing: 3, marginBottom: 24,
  },
  btn: { backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: colors.gray300 },
  btnText: { ...typography.h3, color: colors.white },
  sheetContent: { alignItems: 'center' },
  checkCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  sheetTitle: { ...typography.h2, color: colors.black87, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  infoLabel: { ...typography.body, color: colors.gray700 },
  infoVal: { ...typography.body, color: colors.black87, fontWeight: '600' },
  nextBtn: {
    marginTop: 20, backgroundColor: colors.orange, borderRadius: 10,
    paddingVertical: 14, width: '100%', alignItems: 'center',
  },
  nextText: { ...typography.h3, color: colors.white },
});
