import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { useTheme } from "../../../../theme/ThemeContext";

const HeroIllustration = () => (
  <Svg width="100" height="100" viewBox="0 0 100 100">
    <Defs>
      <SvgLinearGradient id="bgC" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ECFDF5" />
        <Stop offset="100%" stopColor="#D1FAE5" />
      </SvgLinearGradient>
    </Defs>
    <Circle cx="50" cy="55" r="40" fill="url(#bgC)" />
    <Circle cx="14" cy="32" r="4" fill="#BBF7D0" />
    <Circle cx="86" cy="26" r="3" fill="#A7F3D0" />
    <Circle cx="18" cy="74" r="2.5" fill="#6EE7B7" />
    {/* Bag */}
    <Path d="M 24 46 L 76 46 L 70 88 L 30 88 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    <Path d="M 35 46 C 35 32, 65 32, 65 46" fill="none" stroke="#D1D5DB" strokeWidth="3.5" strokeLinecap="round" />
    {/* Location pin */}
    <Circle cx="50" cy="66" r="9" fill="#ECFDF5" />
    <Path d="M 50 58 C 45 58, 41 62, 41 67 C 41 73, 50 80, 50 80 C 50 80, 59 73, 59 67 C 59 62, 55 58, 50 58 Z" fill="#16A34A" />
    <Circle cx="50" cy="67" r="3" fill="#FFFFFF" />
    {/* Items */}
    <Path d="M 29 48 C 25 41, 31 34, 37 37 C 33 39, 31 43, 35 46 Z" fill="#F59E0B" />
    <Path d="M 57 30 L 57 46" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
    <Circle cx="57" cy="28" r="4" fill="#34D399" />
    <Circle cx="67" cy="44" r="6" fill="#EF4444" />
    <Path d="M 67 38 C 67 38, 69 34, 72 36" fill="none" stroke="#16A34A" strokeWidth="1" strokeLinecap="round" />
  </Svg>
);

const VALUE_PROPS = [
  {
    emoji: "🥦",
    bg: "#ECFDF5",
    title: "Fresh grocery & daily essentials",
    sub: "Delivered in 30 mins or less",
  },
  {
    emoji: "💊",
    bg: "#FEF2F2",
    title: "Medicines & pharmacy",
    sub: "From trusted local pharmacies",
  },
  {
    emoji: "🍱",
    bg: "#FFFBEB",
    title: "Hot food & restaurants",
    sub: "Real-time bargaining on food orders",
  },
  {
    emoji: "🏪",
    bg: "#F5F3FF",
    title: "Local shops near you",
    sub: "Support your neighbourhood stores",
  },
];

interface MobileLoginScreenProps {
  onGetStarted: () => void;
}

export const MobileLoginScreen: React.FC<MobileLoginScreenProps> = ({
  onGetStarted,
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={[styles.heroHeading, { fontFamily: theme.typography.fonts.inter800ExtraBold }]}>
              Shop local,{"\n"}
              <Text style={styles.heroGreen}>delivered fast</Text>
            </Text>
            <Text style={[styles.heroSub, { fontFamily: theme.typography.fonts.inter500Medium }]}>
              Groceries, medicines, food & more from your neighbourhood.
            </Text>
          </View>
          <HeroIllustration />
        </View>

        {/* Value prop list */}
        <View style={styles.valuePropList}>
          {VALUE_PROPS.map((v, i) => (
            <View key={i} style={styles.valuePropRow}>
              <View style={[styles.valueIconCircle, { backgroundColor: v.bg }]}>
                <Text style={styles.valueEmoji}>{v.emoji}</Text>
              </View>
              <View style={styles.valueTexts}>
                <Text style={[styles.valueTitle, { fontFamily: theme.typography.fonts.inter600SemiBold }]}>
                  {v.title}
                </Text>
                <Text style={[styles.valueSub, { fontFamily: theme.typography.fonts.inter500Medium }]}>
                  {v.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaBtn} onPress={onGetStarted}>
          <Text style={[styles.ctaText, { fontFamily: theme.typography.fonts.inter700Bold }]}>
            Get Started
          </Text>
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={20} color="#16A34A" />
          </View>
        </Pressable>

        {/* Footer */}
        <View style={styles.footerBadge}>
          <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
          <Text style={[styles.footerBadgeText, { fontFamily: theme.typography.fonts.inter500Medium }]}>
            Your data is protected and encrypted
          </Text>
        </View>
        <View style={styles.footerLinks}>
          <Text style={[styles.footerLink, { fontFamily: theme.typography.fonts.inter500Medium }]}>
            Terms of Service
          </Text>
          <View style={styles.footerDot} />
          <Text style={[styles.footerLink, { fontFamily: theme.typography.fonts.inter500Medium }]}>
            Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    paddingTop: 16,
    paddingBottom: 36,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  heroText: {
    flex: 1,
    paddingRight: 12,
  },
  heroHeading: {
    fontSize: 28,
    lineHeight: 36,
    color: "#111827",
    marginBottom: 10,
  },
  heroGreen: {
    color: "#16A34A",
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },
  valuePropList: {
    marginHorizontal: 24,
    marginBottom: 28,
    gap: 10,
  },
  valuePropRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  valueIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  valueEmoji: {
    fontSize: 20,
  },
  valueTexts: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 2,
  },
  valueSub: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#16A34A",
    borderRadius: 28,
    marginHorizontal: 24,
    paddingLeft: 28,
    paddingRight: 8,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
  ctaText: {
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  ctaArrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  footerBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  footerBadgeText: {
    fontSize: 12,
    color: "#16A34A",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  footerLink: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  footerDot: {
    width: 1,
    height: 12,
    backgroundColor: "#E5E7EB",
  },
});

export default MobileLoginScreen;
