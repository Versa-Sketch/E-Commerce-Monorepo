import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

export function AadhaarScreen({ navigation }: any) {
  const [num, setNum] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.black87} />
          </TouchableOpacity>

          <View style={styles.illustration}>
            <View style={styles.cardIllus}>
              <Text style={styles.cardIllusText}>AADHAAR</Text>
              <View style={styles.cardIllusLine} />
              <View style={styles.cardIllusLine2} />
            </View>
          </View>

          <Text style={styles.heading}>Enter your Aadhar details</Text>
          <Text style={styles.sub}>Your 12-digit Aadhaar number issued by UIDAI</Text>

          <TextInput
            style={styles.input}
            placeholder="xxxx xxxx xxxx"
            keyboardType="number-pad"
            maxLength={12}
            value={num}
            onChangeText={setNum}
            placeholderTextColor={colors.gray300}
          />
          <Text style={styles.helper}>Aadhaar number must be 12 digits</Text>

          <TouchableOpacity
            style={[styles.btn, num.length !== 12 && styles.btnDisabled]}
            onPress={() => num.length === 12 && navigation.navigate('AadhaarOtp')}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  back: { marginBottom: 24 },
  illustration: { alignItems: 'center', marginBottom: 32 },
  cardIllus: {
    width: 200, height: 120, backgroundColor: '#1A237E', borderRadius: 12,
    padding: 16, justifyContent: 'space-between',
  },
  cardIllusText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  cardIllusLine: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, width: '70%' },
  cardIllusLine2: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, width: '50%' },
  heading: { ...typography.h1, color: colors.black87, marginBottom: 8 },
  sub: { ...typography.body, color: colors.gray700, marginBottom: 24 },
  input: {
    borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 14, ...typography.h3, color: colors.black87,
    letterSpacing: 2, marginBottom: 8,
  },
  helper: { ...typography.small, color: colors.gray300, marginBottom: 32 },
  btn: { backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: colors.gray300 },
  btnText: { ...typography.h3, color: colors.white },
});
