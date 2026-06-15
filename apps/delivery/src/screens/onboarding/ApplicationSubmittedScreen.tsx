import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../store/useAppStore';
import { colors, typography } from '../../theme';

export function ApplicationSubmittedScreen({ navigation }: any) {
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const checks = [
    { label: 'Aadhaar Card', done: true },
    { label: 'PAN Card', done: true },
    { label: 'Selfie', done: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#1A1A1A', '#000000']} style={styles.header}>
        <Ionicons name="checkmark-circle" size={64} color={colors.white} />
        <Text style={styles.headTitle}>Great Kiran!</Text>
        <Text style={styles.headSub}>
          Application submitted!{'\n'}Your ID will be ready in less than 5 minutes.
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.checklist}>
          {checks.map((c) => (
            <View key={c.label} style={styles.checkRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.green} />
              <Text style={styles.checkText}>{c.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.bankCard}>
          <View>
            <Text style={styles.bankTitle}>Add bank details later</Text>
            <Text style={styles.bankSub}>You can add your bank account after login</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray300} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setOnboarded(true);
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
          }}
        >
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingTop: 48, paddingBottom: 40, alignItems: 'center', paddingHorizontal: 24,
  },
  headTitle: { ...typography.h1, color: colors.white, marginTop: 12 },
  headSub: { ...typography.body, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  checklist: { marginBottom: 24 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  checkText: { ...typography.body, color: colors.black87 },
  bankCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.gray50, borderRadius: 12, padding: 16, marginBottom: 24,
  },
  bankTitle: { ...typography.h3, color: colors.black87 },
  bankSub: { ...typography.small, color: colors.gray700, marginTop: 4 },
  btn: { backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  btnText: { ...typography.h3, color: colors.white },
});
