import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChevronLeft, RotateCw } from 'lucide-react-native';
import type { OtpVerifyScreenProps } from '../../types/auth';
import { useOtpInput } from '../../hooks/useOtpInput';
import { useOtpTimer } from '../../hooks/useOtpTimer';
import { createOtpVerifyStyles } from './styles';

export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = ({
  phoneNumber,
  role,
  onBack,
  onVerify,
  theme,
  labels,
  otpLength = 4,
  isLoading = false,
  error: externalError,
  onResendOtp,
}) => {
  const { otp, refs, handleOtpChange, handleKeyPress, clear } = useOtpInput(otpLength);
  const { timer, canResend, reset: resetTimer } = useOtpTimer(30);
  const [error, setError] = React.useState('');

  const styles = createOtpVerifyStyles(theme);
  const otpString = otp.join('');
  const isComplete = otpString.length === otpLength;

  // Auto-focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      refs.current[0]?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async () => {
    if (!isComplete || isLoading) return;

    setError('');
    try {
      const success = await onVerify(otpString);
      if (!success) {
        setError('Invalid OTP. Please try again.');
        clear();
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
      clear();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      if (onResendOtp) {
        await onResendOtp();
      }
      clear();
      resetTimer();
    } catch (err: any) {
      setError(err?.message || 'Failed to resend OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <ChevronLeft size={22} color={theme.colors.text} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {labels.enterOtpTitle || 'Verify your number'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {labels.enterOtpSubtitle || `We sent a code to ${phoneNumber}`}
          </Text>

          {/* OTP Fields */}
          <View style={styles.otpContainer}>
            {Array(otpLength)
              .fill(0)
              .map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    {
                      borderColor: error
                        ? theme.colors.error
                        : otp[index]
                          ? theme.colors.primary
                          : theme.colors.border,
                      backgroundColor: theme.colors.surface || theme.colors.background,
                    },
                  ]}
                >
                  <TextInput
                    ref={(ref) => {
                      if (refs.current) refs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      { color: theme.colors.text, fontSize: 24 },
                    ]}
                    value={otp[index] || ''}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent: { key } }) =>
                      handleKeyPress(key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    returnKeyType="done"
                    editable={!isLoading}
                    selectTextOnFocus
                  />
                </View>
              ))}
          </View>

          {/* Error Message */}
          {(error || externalError) && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error || externalError}
            </Text>
          )}

          {/* Timer / Resend */}
          <View style={styles.timerRow}>
            {canResend ? (
              <Pressable
                onPress={handleResend}
                disabled={isLoading}
                style={styles.resendBtn}
              >
                <RotateCw size={16} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.resendText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {labels.resendOtp || 'Resend OTP'}
                </Text>
              </Pressable>
            ) : (
              <Text style={[styles.timerText, { color: theme.colors.textSecondary }]}>
                {labels.resendOtp || 'Resend'} in {timer}s
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={!isComplete || isLoading}
            style={[
              styles.verifyBtn,
              {
                backgroundColor: theme.colors.primary,
                opacity: isComplete && !isLoading ? 1 : 0.5,
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.verifyText, { color: '#FFFFFF' }]}>
                {labels.verifyButton || 'Verify'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
