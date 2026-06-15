import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Button } from '@/Common/components/ui/Button';
import { Input } from '@/Common/components/ui/Input';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  formStyle,
  inputStyle,
  loginBtnStyle,
  otpContainer,
  otpBox,
  helperRowStyle,
  editLinkText,
  timerContainer,
  timerText,
} from './styledcomponents';
interface LoginFormProps {
  onLogin: (phone: string) => void;
}
export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef<Array<TextInput | null>>([]);
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);
  const handleGetOtp = () => {
    if (phone && phone.length === 10) {
      setStep('otp');
      setTimer(30);
    }
  };
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      onLogin(phone);
    }
  };
  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);
    if (cleanText !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  const handleResendOtp = () => {
    if (timer === 0) {
      setOtp(['', '', '', '', '', '']);
      setTimer(30);
      otpRefs.current[0]?.focus();
    }
  };
  const handleEditPhone = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
  };
  if (step === 'phone') {
    return (
      <View style={formStyle}>
        <Input
          label="Mobile Number"
          placeholder="Enter 10-digit mobile number"
          value={phone}
          onChangeText={(val) => setPhone(val.replace(/[^0-9]/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          leftIcon="call-outline"
          style={inputStyle}
        />
        <Button
          label="Get OTP"
          onPress={handleGetOtp}
          variant="solid"
          disabled={phone.length < 10}
          style={loginBtnStyle}
        />
      </View>
    );
  }
  return (
    <View style={formStyle}>
      {}
      <View style={helperRowStyle}>
        <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.manrope500Medium }]}>
          Sent OTP to +91 {phone}
        </Text>
        <Pressable onPress={handleEditPhone} style={{ marginLeft: 8 }}>
          <Text style={[editLinkText, { color: theme.colors.primary, fontFamily: theme.typography.fonts.poppins600SemiBold }]}>
            Edit
          </Text>
        </Pressable>
      </View>
      <Text style={[theme.textPresets.caption, { color: theme.colors.textMuted, fontFamily: theme.typography.fonts.manrope400Regular, marginBottom: 8 }]}>
        Mock Verification: Enter any 6 digits (e.g. 123456)
      </Text>
      {}
      <View style={otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { otpRefs.current[index] = ref; }}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[
              otpBox,
              {
                borderColor: digit ? theme.colors.primary : theme.colors.border,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.surface,
                fontFamily: theme.typography.fonts.poppins700Bold,
              },
            ]}
          />
        ))}
      </View>
      <Button
        label="Verify & Log In"
        onPress={handleVerifyOtp}
        variant="solid"
        disabled={otp.join('').length < 6}
        style={loginBtnStyle}
      />
      {}
      <View style={timerContainer}>
        {timer > 0 ? (
          <Text style={[timerText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fonts.manrope400Regular }]}>
            Resend OTP in{' '}
            <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fonts.poppins600SemiBold }}>
              {timer}s
            </Text>
          </Text>
        ) : (
          <Pressable onPress={handleResendOtp}>
            <Text style={[timerText, { color: theme.colors.primary, fontFamily: theme.typography.fonts.poppins600SemiBold, textDecorationLine: 'underline' }]}>
              Resend OTP
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
export default LoginForm;
