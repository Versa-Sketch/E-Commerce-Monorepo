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
import { ChevronLeft } from 'lucide-react-native';
import type { PhoneInputScreenProps } from '../../types/auth';
import { usePhoneValidation } from '../../hooks/usePhoneValidation';
import { cleanPhoneInput } from '../../utils/validators';
import { createPhoneInputStyles } from './styles';

export const PhoneInputScreen: React.FC<PhoneInputScreenProps> = ({
  onContinue,
  onBack,
  onCreateAccount,
  theme,
  labels,
  role,
  isLoading = false,
  error: externalError,
}) => {
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');
  const [focused, setFocused] = useState(false);

  const { valid, error: validationError } = usePhoneValidation(phone);
  const error = externalError || localError;

  const styles = createPhoneInputStyles(theme);

  const handlePhoneChange = (text: string) => {
    const cleaned = cleanPhoneInput(text);
    setPhone(cleaned);
    if (error) setLocalError('');
  };

  const handleContinue = async () => {
    if (!valid && validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError('');
    try {
      await onContinue(phone, true);
    } catch (err: any) {
      setLocalError(err?.message || 'An error occurred');
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
        {/* Back Button */}
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <ChevronLeft size={22} color={theme.colors.text} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {labels.title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {labels.subtitle}
          </Text>

          {/* Phone Input Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface || theme.colors.background },
            ]}
          >
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              MOBILE NUMBER
            </Text>

            <View
              style={[
                styles.phoneRow,
                focused && { borderColor: theme.colors.primary },
                error && { borderColor: theme.colors.error },
              ]}
            >
              <View style={[styles.countryPrefix, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.countryFlag]}>🇮🇳</Text>
                <Text style={[styles.countryCode, { color: theme.colors.text }]}>+91</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <TextInput
                style={[styles.phoneInput, { color: theme.colors.text }]}
                placeholder={labels.placeholder || '9876543210'}
                placeholderTextColor={theme.colors.textSecondary}
                value={phone}
                onChangeText={handlePhoneChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                editable={!isLoading}
              />
            </View>

            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={!valid || isLoading}
              style={[
                styles.cta,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: valid && !isLoading ? 1 : 0.5,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.ctaText, { color: '#FFFFFF' }]}>
                  {labels.buttonText}
                </Text>
              )}
            </Pressable>

            {/* Create Account Link */}
            <View style={styles.createRow}>
              <Text style={[styles.createLabel, { color: theme.colors.textSecondary }]}>
                {labels.createAccountText || 'New here?'}{' '}
              </Text>
              <Pressable onPress={onCreateAccount} disabled={isLoading}>
                <Text
                  style={[
                    styles.createLink,
                    { color: theme.colors.primary },
                  ]}
                >
                  {labels.createAccountLink || 'Create account'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.secureRow}>
            <Text style={[styles.secureText, { color: theme.colors.textSecondary }]}>
              🛡️ {labels.securityNote || 'Your data is protected and encrypted'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
