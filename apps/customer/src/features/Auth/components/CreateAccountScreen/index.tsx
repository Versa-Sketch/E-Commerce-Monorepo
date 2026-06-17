import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
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
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useTheme } from '../../../../theme/ThemeContext';

interface CreateAccountScreenProps {
  onCreateAccount: (phone: string) => void;
  onBack: () => void;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = observer(({
  onCreateAccount,
  onBack,
}) => {
  const { theme } = useTheme();
  const authStore = useAuthStore();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const nameRef = useRef<TextInput>(null);
  const loading = authStore.isLoading;
  const isValid = phone.length === 10 && fullName.trim().length >= 2;

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(clean);
    if (phoneError) setPhoneError('');
  };

  const handleSubmit = async () => {
    let hasError = false;
    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number.');
      hasError = true;
    } else {
      setPhoneError('');
    }
    if (fullName.trim().length < 2) {
      setNameError('Full name must be at least 2 characters.');
      hasError = true;
    } else {
      setNameError('');
    }
    if (hasError) return;
    try {
      await authStore.register(`+91${phone}`, fullName.trim());
      onCreateAccount(phone);
    } catch (e) {
      setPhoneError(authStore.error ?? 'Registration failed. Please try again.');
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
        <View style={styles.iconWrap}>
          <Ionicons name="person-add-outline" size={30} color="#16A34A" />
        </View>

        {/* Heading */}
        <View style={styles.headingRow}>
          <Text style={[styles.headingDark, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>Create{' '}</Text>
          <Text style={[styles.headingGreen, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>Account</Text>
        </View>
        <Text style={[styles.subtitle, { fontFamily: theme.typography.fonts.inter500Medium }]}>
          Enter your mobile number and full name to get started.
        </Text>

        {/* Form card */}
        <View style={styles.card}>
          {/* Mobile Number */}
          <Text style={[styles.fieldLabel, { fontFamily: theme.typography.fonts.inter700Bold }]}>Mobile Number</Text>
          <View style={[styles.phoneInputRow, phoneFocused && styles.inputFocused, !!phoneError && styles.inputError]}>
            <View style={styles.countryBox}>
              <Text style={[styles.countryCode, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>+91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={[styles.phoneInput, { fontFamily: theme.typography.fonts.inter500Medium }]}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#D1D5DB"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              returnKeyType="next"
              onSubmitEditing={() => nameRef.current?.focus()}
              maxLength={10}
              editable={!loading}
            />
          </View>
          {!!phoneError && (
            <Text style={[styles.errorText, { fontFamily: theme.typography.fonts.inter500Medium }]}>{phoneError}</Text>
          )}

          {/* Full Name */}
          <Text style={[styles.fieldLabel, { fontFamily: theme.typography.fonts.inter700Bold, marginTop: 20 }]}>Full Name</Text>
          <View style={[styles.nameInputRow, nameFocused && styles.inputFocused, !!nameError && styles.inputError]}>
            <View style={styles.atBox}>
              <Ionicons name="person-outline" size={18} color="#16A34A" />
            </View>
            <TextInput
              ref={nameRef}
              style={[styles.nameInput, { fontFamily: theme.typography.fonts.inter500Medium }]}
              placeholder="Enter your full name"
              placeholderTextColor="#D1D5DB"
              autoCapitalize="words"
              value={fullName}
              onChangeText={(v) => { setFullName(v); if (nameError) setNameError(''); }}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!loading}
            />
          </View>
          {!!nameError && (
            <Text style={[styles.errorText, { fontFamily: theme.typography.fonts.inter500Medium }]}>{nameError}</Text>
          )}

          {/* CTA */}
          <Pressable
            onPress={handleSubmit}
            disabled={!isValid || loading}
            style={[styles.ctaBtn, { opacity: isValid && !loading ? 1 : 0.55 }]}
          >
            {loading
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={[styles.ctaText, { fontFamily: theme.typography.fonts.inter700Bold }]}>Continue</Text>
            }
            <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={20} color="#16A34A" />
            </View>
          </Pressable>
        </View>

        {/* Terms */}
        <Text style={[styles.terms, { fontFamily: theme.typography.fonts.inter500Medium }]}>
          By creating an account you agree to our{'\n'}
          <Text style={[styles.termsLink, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>Terms of Service</Text>
          <Text style={styles.terms}> and </Text>
          <Text style={[styles.termsLink, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>Privacy Policy</Text>
          <Text style={styles.terms}>.</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingTop: 16, paddingBottom: 48, paddingHorizontal: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  iconWrap: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  headingRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  headingDark: { fontSize: 32, color: '#111827', lineHeight: 38 },
  headingGreen: { fontSize: 32, color: '#16A34A', lineHeight: 38 },
  subtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 32 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 5, borderWidth: 1, borderColor: '#F3F4F6' },
  fieldLabel: { fontSize: 14, color: '#111827', marginBottom: 10 },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', height: 56, overflow: 'hidden' },
  countryBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: '100%', backgroundColor: '#F3F4F6' },
  countryCode: { fontSize: 13, color: '#374151' },
  divider: { width: 1, height: 28, backgroundColor: '#E5E7EB' },
  phoneInput: { flex: 1, paddingHorizontal: 14, fontSize: 14, color: '#111827', height: '100%' },
  nameInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', height: 56, overflow: 'hidden' },
  atBox: { width: 52, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  nameInput: { flex: 1, paddingHorizontal: 14, fontSize: 14, color: '#111827', height: '100%' },
  inputFocused: { borderColor: '#16A34A', backgroundColor: '#FFFFFF', shadowColor: '#16A34A', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 },
  inputError: { borderColor: '#EF4444' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 6 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#16A34A', borderRadius: 28, paddingLeft: 28, paddingRight: 8, paddingVertical: 8, marginTop: 28, shadowColor: '#16A34A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 5 },
  ctaText: { fontSize: 17, color: '#FFFFFF', letterSpacing: 0.2 },
  ctaArrow: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  terms: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
  termsLink: { color: '#16A34A', fontSize: 13 },
});

export default CreateAccountScreen;
