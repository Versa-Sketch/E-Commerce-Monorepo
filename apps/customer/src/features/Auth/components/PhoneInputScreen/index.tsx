import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useTheme } from '../../../../theme/ThemeContext';

const PhoneWithCheck = () => (
  <Svg width="52" height="52" viewBox="0 0 52 52">
    <Rect x="12" y="6" width="26" height="40" rx="5" fill="none" stroke="#16A34A" strokeWidth="2.2" />
    <Rect x="21" y="10" width="8" height="2" rx="1" fill="#16A34A" opacity="0.4" />
    <Circle cx="25" cy="42" r="2" fill="#16A34A" opacity="0.4" />
    <Circle cx="36" cy="38" r="8" fill="#16A34A" />
    <Path d="M 32 38 L 35 41 L 40 35" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface PhoneInputScreenProps {
  onContinue: (phone: string, needsOtp: boolean) => void;
  onBack: () => void;
  onCreateAccount: () => void;
}

export const PhoneInputScreen: React.FC<PhoneInputScreenProps> = observer(({
  onContinue,
  onBack,
  onCreateAccount,
}) => {
  const { theme } = useTheme();
  const authStore = useAuthStore();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const loading = authStore.isLoading;

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(clean);
    if (error) setError('');
  };

  const handleContinue = async () => {
    if (phone.length !== 10) { setError('Mobile number must be exactly 10 digits.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Please enter a valid Indian mobile number.'); return; }
    setError('');
    const result = await authStore.loginWithPhone(`+91${phone}`, 'customer');
    switch (result) {
      case 'ok':
        onContinue(phone, true);
        break;
      case 'not_found':
        setError("No account found. Tap 'Create account' below.");
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.circleBtn}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </Pressable>
        </View>

        {/* Icon */}
        <View style={styles.phoneIconBg}>
          <PhoneWithCheck />
        </View>

        {/* Heading */}
        <View style={styles.headingBlock}>
          <Text style={[styles.heading, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>
            Enter your mobile
          </Text>
          <Text style={[styles.subtitle, { fontFamily: theme.typography.fonts.inter500Medium }]}>
            We'll send a one-time code to verify your number.
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={[styles.fieldLabel, { fontFamily: theme.typography.fonts.inter700Bold }]}>Mobile Number</Text>
          <View style={[styles.phoneInputRow, focused && styles.phoneInputFocused, !!error && styles.phoneInputError]}>
            <View style={styles.countrySection}>
              <Text style={[styles.countryCode, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>+91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={[styles.numberInput, { fontFamily: theme.typography.fonts.inter500Medium }]}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#D1D5DB"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={10}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              editable={!loading}
            />
          </View>
          {!!error && (
            <Text style={[styles.errorText, { fontFamily: theme.typography.fonts.inter500Medium }]}>{error}</Text>
          )}
          <Pressable
            onPress={handleContinue}
            disabled={phone.length < 10 || loading}
            style={[styles.ctaBtn, { opacity: phone.length === 10 && !loading ? 1 : 0.55 }]}
          >
            {loading
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={[styles.ctaText, { fontFamily: theme.typography.fonts.inter700Bold }]}>Continue</Text>
            }
            <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={20} color="#16A34A" />
            </View>
          </Pressable>
          <View style={styles.createRow}>
            <Text style={[styles.createLabel, { fontFamily: theme.typography.fonts.inter500Medium }]}>New here?{' '}</Text>
            <Pressable onPress={onCreateAccount} disabled={loading}>
              <Text style={[styles.createLink, { fontFamily: theme.typography.fonts.inter700Bold }]}>Create account</Text>
            </Pressable>
          </View>
        </View>

        {/* Security note */}
        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
          <Text style={[styles.secureText, { fontFamily: theme.typography.fonts.inter500Medium }]}>
            Your data is protected and encrypted
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingTop: 16, paddingHorizontal: 24, paddingBottom: 32 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  phoneIconBg: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  headingBlock: { marginBottom: 32 },
  heading: { fontSize: 32, color: '#111827', lineHeight: 38, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 5, borderWidth: 1, borderColor: '#F3F4F6' },
  fieldLabel: { fontSize: 14, color: '#111827', marginBottom: 14 },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', marginBottom: 8, overflow: 'hidden' },
  phoneInputFocused: { borderColor: '#16A34A', backgroundColor: '#FFFFFF', shadowColor: '#16A34A', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 },
  phoneInputError: { borderColor: '#EF4444' },
  countrySection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#F3F4F6', height: '100%' },
  countryCode: { fontSize: 13, color: '#374151' },
  divider: { width: 1, height: 28, backgroundColor: '#E5E7EB' },
  numberInput: { flex: 1, paddingHorizontal: 14, fontSize: 14, color: '#111827', height: '100%' },
  errorText: { fontSize: 12, color: '#EF4444', marginBottom: 10, marginTop: -2 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#16A34A', borderRadius: 28, paddingLeft: 28, paddingRight: 8, paddingVertical: 8, marginTop: 18, marginBottom: 20, shadowColor: '#16A34A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 5 },
  ctaText: { fontSize: 17, color: '#FFFFFF', letterSpacing: 0.2 },
  ctaArrow: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  createRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  createLabel: { fontSize: 14, color: '#6B7280' },
  createLink: { fontSize: 14, color: '#16A34A', textDecorationLine: 'underline' },
  secureRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  secureText: { fontSize: 12, color: '#6B7280' },
});

export default PhoneInputScreen;
