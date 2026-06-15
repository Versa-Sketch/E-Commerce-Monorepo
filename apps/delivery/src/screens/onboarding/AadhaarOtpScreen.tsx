import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, typography } from '../../theme';

export function AadhaarOtpScreen({ navigation }: any) {
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  function handleOtp(val: string) {
    setOtp(val);
    if (val.length === 6) setSheet(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.black87} />
        </TouchableOpacity>

        <Text style={styles.heading}>Enter OTP</Text>
        <Text style={styles.sub}>
          Shared on your Aadhaar registered mobile number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="6-digit OTP"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={handleOtp}
          placeholderTextColor={colors.gray300}
        />

        {seconds > 0 ? (
          <Text style={styles.timer}>
            Resend OTP in 00:{seconds.toString().padStart(2, '0')}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => setSeconds(30)}>
            <Text style={styles.resend}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Submit Aadhar photo instead</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={sheet} onClose={() => setSheet(false)} height={300}>
        <View style={styles.sheetContent}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color={colors.white} />
          </View>
          <Text style={styles.sheetTitle}>Aadhar details verified</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoVal}>Chenna Kiran Kumar</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aadhaar</Text>
            <Text style={styles.infoVal}>XXXXXXXX4926</Text>
          </View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => { setSheet(false); navigation.navigate('Pan'); }}
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
  heading: { ...typography.h1, color: colors.black87, marginBottom: 8 },
  sub: { ...typography.body, color: colors.gray700, marginBottom: 28 },
  input: {
    borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 14, ...typography.h3,
    color: colors.black87, letterSpacing: 6, marginBottom: 16,
  },
  timer: { ...typography.body, color: colors.gray300, marginBottom: 16 },
  resend: { ...typography.body, color: colors.orange, fontWeight: '600', marginBottom: 16 },
  secondaryBtn: { marginTop: 8 },
  secondaryText: { ...typography.body, color: colors.orange, textDecorationLine: 'underline' },
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
