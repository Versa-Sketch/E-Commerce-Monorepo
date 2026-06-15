import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { useAuthStore } from '../../../../features/Auth/Providers/useAuthStore';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  actionRowStyle,
  backBtnStyle,
  bottomBadgeRowStyle,
  bottomBadgeTextStyle,
  changeNumberTextStyle,
  containerStyle,
  ctaArrowCircleStyle,
  ctaBtnWrapperStyle,
  ctaButtonStyle,
  ctaTextStyle,
  heroLeftStyle,
  heroRightStyle,
  heroRowStyle,
  loginCardHeaderStyle,
  loginCardStyle,
  loginCardSubtitleStyle,
  loginCardTitleStyle,
  loginHeaderTextsStyle,
  otpBoxStyle,
  otpContainerStyle,
  phoneHighlightStyle,
  phoneIconCircleStyle,
  resendBtnTextStyle,
  skylineWrapperStyle,
  subtitleStyle,
  timerHighlightStyle,
  timerTextStyle,
  titleStyle,
  topHeaderRowStyle
} from './styledcomponents';
interface OtpVerifyScreenProps {
  phoneNumber: string;
  apiRole?: string;
  onBack: () => void;
  onVerify: (otp: string) => void;
}
const SecureShieldSVG = () => (
  <Svg width="110" height="120" viewBox="0 0 110 120">
    <Defs>
      <SvgLinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#16A34A" />
        <Stop offset="100%" stopColor="#047857" />
      </SvgLinearGradient>
      <SvgLinearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FBBF24" />
        <Stop offset="100%" stopColor="#D97706" />
      </SvgLinearGradient>
      <SvgLinearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="rgba(0, 0, 0, 0.08)" />
        <Stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
      </SvgLinearGradient>
    </Defs>
    <Ellipse cx="55" cy="112" rx="42" ry="7" fill="url(#shadowGrad)" />
    <Path
      d="M 55 15 C 75 15, 85 22, 85 45 C 85 75, 55 102, 55 102 C 55 102, 25 75, 25 45 C 25 22, 35 15, 55 15 Z"
      fill="url(#shieldGrad)"
    />
    <Path
      d="M 55 23 C 70 23, 77 28, 77 47 C 77 71, 55 92, 55 92 C 55 92, 33 71, 33 47 C 33 28, 40 23, 55 23 Z"
      fill="#16A34A"
      opacity="0.3"
    />
    <Path d="M 38 65 L 48 55 L 75 82 L 68 89 Z" fill="url(#keyGrad)" />
    <Circle cx="38" cy="65" r="12" fill="url(#keyGrad)" />
    <Circle cx="38" cy="65" r="5" fill="#16A34A" />
    <Path d="M 68 75 L 75 68 L 81 74 L 78 77 L 75 74 Z" fill="url(#keyGrad)" />
    <Path d="M 72 79 L 79 72 L 85 78 L 82 81 L 79 78 Z" fill="url(#keyGrad)" />
    <Path
      d="M 45 48 L 52 55 L 68 38"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M 98 25 L 100 29 L 104 31 L 100 33 L 98 37 L 96 33 L 92 31 L 96 29 Z" fill="#FBBF24" opacity="0.8" />
    <Path d="M 14 20 L 15 23 L 18 24 L 15 25 L 14 28 L 13 25 L 10 24 L 13 23 Z" fill="#16A34A" opacity="0.6" />
  </Svg>
);
const CitySkylineSVG = () => (
  <Svg width="100%" height="60" viewBox="0 0 375 60" preserveAspectRatio="none">
    <Defs>
      <SvgLinearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#ECEEF7" />
        <Stop offset="100%" stopColor="#E2E6F2" />
      </SvgLinearGradient>
    </Defs>
    <Path d="M 0 60 L 0 45 L 20 45 L 20 60 Z" fill="url(#skylineGrad)" opacity="0.3" />
    <Path d="M 15 60 L 15 35 L 45 35 L 45 60 Z" fill="url(#skylineGrad)" opacity="0.4" />
    <Path d="M 40 60 L 40 48 L 65 48 L 65 60 Z" fill="url(#skylineGrad)" opacity="0.3" />
    <Path d="M 60 60 L 60 30 L 90 30 L 90 60 Z" fill="url(#skylineGrad)" opacity="0.5" />
    <Path d="M 85 60 L 85 40 L 110 40 L 110 60 Z" fill="url(#skylineGrad)" opacity="0.3" />
    <Path d="M 105 60 L 105 50 L 130 50 L 130 60 Z" fill="url(#skylineGrad)" opacity="0.4" />
    <Path d="M 140 60 L 140 35 L 170 35 L 170 60 Z" fill="url(#skylineGrad)" opacity="0.45" />
    <Path d="M 165 60 L 165 42 L 195 42 L 195 60 Z" fill="url(#skylineGrad)" opacity="0.3" />
    <Path d="M 190 60 L 190 25 L 225 25 L 225 60 Z" fill="url(#skylineGrad)" opacity="0.5" />
    <Path d="M 220 60 L 220 38 L 245 38 L 245 60 Z" fill="url(#skylineGrad)" opacity="0.4" />
    <Path d="M 255 60 L 255 45 L 280 45 L 280 60 Z" fill="url(#skylineGrad)" opacity="0.3" />
    <Path d="M 275 60 L 275 32 L 310 32 L 310 60 Z" fill="url(#skylineGrad)" opacity="0.5" />
    <Path d="M 305 60 L 305 40 L 335 40 L 335 60 Z" fill="url(#skylineGrad)" opacity="0.35" />
    <Path d="M 330 60 L 330 48 L 360 48 L 360 60 Z" fill="url(#skylineGrad)" opacity="0.4" />
    <Path d="M 355 60 L 355 35 L 375 35 L 375 60 Z" fill="url(#skylineGrad)" opacity="0.3" />
    <Path d="M -10 60 Q 20 40, 50 60 Z" fill="#E2E6F2" opacity="0.4" />
    <Path d="M 80 60 Q 110 45, 140 60 Z" fill="#E2E6F2" opacity="0.5" />
    <Path d="M 210 60 Q 240 48, 270 60 Z" fill="#E2E6F2" opacity="0.4" />
    <Path d="M 300 60 Q 330 42, 360 60 Z" fill="#E2E6F2" opacity="0.5" />
    <Path d="M 30 18 Q 38 12, 46 18 Q 54 18, 56 24 L 20 24 Q 22 18, 30 18 Z" fill="#FFFFFF" opacity="0.75" />
    <Path d="M 280 14 Q 288 8, 296 14 Q 304 14, 306 20 L 270 20 Q 272 14, 280 14 Z" fill="#FFFFFF" opacity="0.6" />
  </Svg>
);
export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = observer(({
  phoneNumber,
  apiRole = 'CUSTOMER',
  onBack,
  onVerify,
}) => {
  const { theme } = useTheme();
  const authStore = useAuthStore();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const displayPhone = phoneNumber.length === 10
    ? `+91 ${phoneNumber.slice(0, 5)}XXXXX`
    : `+91 ${phoneNumber}`;
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  useEffect(() => {
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  }, []);
  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);
    if (error) {
      setError('');
    }
    if (cleanText !== '' && index < 3) {
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
      setOtp(['', '', '', '']);
      setError('');
      setTimer(30);
      otpRefs.current[0]?.focus();
    }
  };
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      setError('Please enter a 4-digit verification code.');
      return;
    }
    setError('');
    // Phone arrives as 10-digit string from navigation; prepend +91
    const e164 = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    try {
      await authStore.verifyOtp(e164, code, apiRole);
      // authStore.isAuthenticated → true → app/index.tsx routing fires automatically
      onVerify(code);
    } catch (e) {
      setError(authStore.error ?? 'Verification failed. Please try again.');
    }
  };
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F9FAFB', '#ECFDF5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={containerStyle}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Top Header Row */}
        <View style={topHeaderRowStyle}>
          <Pressable onPress={onBack} style={backBtnStyle}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </Pressable>
        </View>
        {/* Hero Section */}
        <View style={heroRowStyle}>
          <View style={heroLeftStyle}>
            <Text style={[titleStyle, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>
              Verify Phone
            </Text>
            <Text style={[subtitleStyle, { fontFamily: theme.typography.fonts.inter500Medium }]}>
              We’ve sent a verification code to{' '}
              <Text style={phoneHighlightStyle}>
                {displayPhone}
              </Text>
            </Text>
          </View>
          <View style={heroRightStyle}>
            <SecureShieldSVG />
          </View>
        </View>
        {/* Central Verification Card */}
        <View style={loginCardStyle}>
          <View style={loginCardHeaderStyle}>
            <View style={phoneIconCircleStyle}>
              <Ionicons name="lock-closed-outline" size={20} color="#16A34A" />
            </View>
            <View style={loginHeaderTextsStyle}>
              <Text style={[loginCardTitleStyle, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>
                Enter Code
              </Text>
              <Text style={[loginCardSubtitleStyle, { fontFamily: theme.typography.fonts.inter500Medium }]}>
                Type the 4-digit code sent to your phone
              </Text>
            </View>
          </View>
          {/* 4-Digit OTP Grid */}
          <View style={otpContainerStyle}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { otpRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                style={[
                  otpBoxStyle,
                  {
                    borderColor: focusedIndex === index
                      ? '#16A34A'
                      : digit
                        ? '#16A34A'
                        : '#E5E7EB',
                    color: '#111827',
                    fontFamily: theme.typography.fonts.inter700Bold,
                  },
                  { outlineStyle: 'none' } as any,
                ]}
              />
            ))}
          </View>
          {/* Error Message */}
          {error ? (
            <Text
              style={{
                color: '#EF4444',
                fontSize: 12,
                marginTop: -10,
                marginBottom: 16,
                textAlign: 'center',
                fontFamily: theme.typography.fonts.inter500Medium,
              }}
            >
              {error}
            </Text>
          ) : null}
          {/* Actions Row */}
          <View style={actionRowStyle}>
            {/* Timer */}
            <View>
              {timer > 0 ? (
                <Text style={[timerTextStyle, { fontFamily: theme.typography.fonts.inter500Medium }]}>
                  Resend in <Text style={timerHighlightStyle}>00:{timer < 10 ? `0${timer}` : timer}</Text>
                </Text>
              ) : (
                <Pressable onPress={handleResendOtp}>
                  <Text style={[resendBtnTextStyle, { fontFamily: theme.typography.fonts.inter700Bold }]}>
                    Resend SMS
                  </Text>
                </Pressable>
              )}
            </View>
            {/* Change Number */}
            <Pressable onPress={onBack}>
              <Text style={[changeNumberTextStyle, { fontFamily: theme.typography.fonts.inter700Bold }]}>
                Change Number
              </Text>
            </Pressable>
          </View>
          {/* Verify CTA Gradient Button */}
          <View style={[ctaBtnWrapperStyle, { opacity: otp.join('').length === 4 && !authStore.isLoading ? 1 : 0.6 }]}>
            <LinearGradient
              colors={['#16A34A', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            >
              <Pressable
                onPress={handleVerify}
                disabled={otp.join('').length < 4 || authStore.isLoading}
                style={ctaButtonStyle}
              >
                {authStore.isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[ctaTextStyle, { fontFamily: theme.typography.fonts.inter700Bold }]}>
                    Verify & Continue
                  </Text>
                )}
                <View style={ctaArrowCircleStyle}>
                  {authStore.isLoading
                    ? <ActivityIndicator color="#16A34A" size="small" />
                    : <Ionicons name="arrow-forward" size={18} color="#16A34A" />
                  }
                </View>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
        {/* Footer Security Badge */}
        <View style={bottomBadgeRowStyle}>
          <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
          <Text style={[bottomBadgeTextStyle, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>
            Secure Verification: OTP valid for 5 mins
          </Text>
        </View>
        {/* Skyline Illustration */}
        <View style={skylineWrapperStyle}>
          <CitySkylineSVG />
        </View>
      </ScrollView>
    </LinearGradient>
  );
});
export default OtpVerifyScreen;
