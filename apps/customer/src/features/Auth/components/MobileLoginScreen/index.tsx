import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { useTheme } from "../../../../theme/ThemeContext";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GroceryBagIllustration = () => (
  <Svg width="160" height="160" viewBox="0 0 160 160">
    <Defs>
      <SvgLinearGradient id="bgCircle" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ECFDF5" />
        <Stop offset="100%" stopColor="#D1FAE5" />
      </SvgLinearGradient>
    </Defs>
    {}
    <Circle cx="80" cy="88" r="62" fill="url(#bgCircle)" />
    {}
    <Circle cx="22" cy="52" r="5" fill="#BBF7D0" />
    <Circle cx="138" cy="44" r="4" fill="#A7F3D0" />
    <Circle cx="30" cy="118" r="3" fill="#6EE7B7" />
    {}
    <Rect x="38" y="72" width="84" height="72" rx="10" fill="#FFFFFF" />
    <Rect
      x="38"
      y="72"
      width="84"
      height="72"
      rx="10"
      fill="none"
      stroke="#E5E7EB"
      strokeWidth="1.5"
    />
    {}
    <Path
      d="M 56 72 C 56 52, 72 46, 80 46 C 88 46, 104 52, 104 72"
      fill="none"
      stroke="#D1D5DB"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {}
    <Circle cx="80" cy="106" r="14" fill="#ECFDF5" />
    <Path
      d="M 80 96 C 75 96, 71 100, 71 105 C 71 112, 80 120, 80 120 C 80 120, 89 112, 89 105 C 89 100, 85 96, 80 96 Z"
      fill="#16A34A"
    />
    <Circle cx="80" cy="105" r="4" fill="#FFFFFF" />
    {}
    <Path
      d="M 48 74 C 44 66, 50 56, 58 60 C 54 62, 52 68, 56 72 Z"
      fill="#F59E0B"
    />
    <Path
      d="M 50 70 C 48 64, 54 58, 60 62"
      fill="none"
      stroke="#D97706"
      strokeWidth="1"
      strokeLinecap="round"
    />
    {}
    <Rect x="72" y="46" width="14" height="34" rx="5" fill="#BAE6FD" />
    <Rect x="75" y="42" width="8" height="8" rx="3" fill="#7DD3FC" />
    <Rect
      x="74"
      y="58"
      width="12"
      height="2"
      rx="1"
      fill="#7DD3FC"
      opacity="0.6"
    />
    {}
    <Rect x="90" y="52" width="16" height="26" rx="4" fill="#FDE68A" />
    <Rect x="90" y="52" width="16" height="8" rx="4" fill="#FCD34D" />
    {}
    <Circle cx="108" cy="70" r="9" fill="#EF4444" />
    <Path
      d="M 108 61 C 108 61, 110 56, 114 58"
      fill="none"
      stroke="#16A34A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {}
    <Path
      d="M 36 80 C 28 72, 30 60, 40 64 C 36 70, 38 76, 44 78 Z"
      fill="#4ADE80"
    />
    <Path
      d="M 30 90 C 20 84, 24 72, 34 76 C 30 82, 32 88, 38 90 Z"
      fill="#86EFAC"
      opacity="0.8"
    />
    {}
    <Path
      d="M 124 80 C 132 72, 130 60, 120 64 C 124 70, 122 76, 116 78 Z"
      fill="#4ADE80"
    />
  </Svg>
);
const GroceryIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 36 36">
    <Rect x="4" y="10" width="28" height="22" rx="5" fill="#16A34A" />
    <Path
      d="M 10 10 C 10 5, 26 5, 26 10"
      fill="none"
      stroke="#15803D"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="8" r="3" fill="#FCA5A5" />
    <Circle cx="24" cy="7" r="2.5" fill="#FCD34D" />
    <Path d="M 8 16 L 28 16" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
    <Rect x="10" y="19" width="6" height="8" rx="2" fill="#86EFAC" />
    <Rect x="20" y="19" width="6" height="8" rx="2" fill="#FDE68A" />
  </Svg>
);
const PharmacyIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 36 36">
    <Rect x="4" y="8" width="28" height="22" rx="6" fill="#EF4444" />
    <Rect x="14" y="13" width="8" height="12" rx="2" fill="#FFFFFF" />
    <Rect x="10" y="17" width="16" height="4" rx="2" fill="#FFFFFF" />
  </Svg>
);
const FoodIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 36 36">
    <Circle cx="18" cy="20" r="12" fill="#FCD34D" />
    <Ellipse cx="18" cy="16" rx="9" ry="5" fill="#F59E0B" />
    <Ellipse cx="18" cy="14" rx="8" ry="4" fill="#FBBF24" />
    <Rect x="9" y="17" width="18" height="6" rx="1" fill="#92400E" />
    <Circle cx="13" cy="20" r="2" fill="#EF4444" />
    <Circle cx="18" cy="20" r="2" fill="#FCD34D" />
    <Circle cx="23" cy="20" r="2" fill="#EF4444" />
    <Ellipse cx="18" cy="24" rx="9" ry="4" fill="#D97706" />
  </Svg>
);
const FashionIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 36 36">
    <Path
      d="M 10 14 L 5 19 L 9 22 L 13 19 L 13 30 H 23 L 23 19 L 27 22 L 31 19 L 26 14 Z"
      fill="#3B82F6"
    />
    <Path
      d="M 13 14 C 13 10, 23 10, 23 14"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const MoreIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 36 36">
    <Rect x="5" y="5" width="11" height="11" rx="3" fill="#8B5CF6" />
    <Rect x="20" y="5" width="11" height="11" rx="3" fill="#EC4899" />
    <Rect x="5" y="20" width="11" height="11" rx="3" fill="#F59E0B" />
    <Rect x="20" y="20" width="11" height="11" rx="3" fill="#16A34A" />
  </Svg>
);
const CATEGORIES = [
  { id: "1", name: "Grocery", icon: <GroceryIcon />, bg: "#ECFDF5" },
  { id: "2", name: "Pharmacy", icon: <PharmacyIcon />, bg: "#FEF2F2" },
  { id: "3", name: "Food", icon: <FoodIcon />, bg: "#FFFBEB" },
  { id: "4", name: "Fashion", icon: <FashionIcon />, bg: "#EFF6FF" },
  { id: "5", name: "More", icon: <MoreIcon />, bg: "#F5F3FF" },
];
const ScooterIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 28 28">
    <Path
      d="M 6 18 H 22 L 25 11 H 20 L 18 18"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="7"
      cy="20"
      r="3.5"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
    />
    <Circle
      cx="21"
      cy="20"
      r="3.5"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
    />
    <Path
      d="M 4 9 H 10 L 12 14"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const ShieldIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 28 28">
    <Path
      d="M 14 3 L 4 7 L 4 14 C 4 19, 8 23, 14 25 C 20 23, 24 19, 24 14 L 24 7 Z"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M 10 14 L 13 17 L 18 11"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const PinIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 28 28">
    <Path
      d="M 14 3 C 9 3, 5 7, 5 12 C 5 18, 14 25, 14 25 C 14 25, 23 18, 23 12 C 23 7, 19 3, 14 3 Z"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
    />
    <Circle
      cx="14"
      cy="12"
      r="3.5"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2"
    />
  </Svg>
);
const FEATURES = [
  {
    icon: <ScooterIcon />,
    title: "Fast Delivery",
    desc: "Quick & reliable\ndelivery",
  },
  {
    icon: <ShieldIcon />,
    title: "Secure Payments",
    desc: "100% safe &\nencrypted",
  },
  {
    icon: <PinIcon />,
    title: "Nearby Stores",
    desc: "Shop from trusted\nlocal stores",
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
        {}
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text
              style={[
                styles.heroHeading,
                { fontFamily: theme.typography.fonts.inter800ExtraBold },
              ]}
            >
              Everything{"\n"}Delivered{"\n"}
              <Text style={styles.heroGreen}>Nearby</Text>
            </Text>
            <Text
              style={[
                styles.heroSub,
                { fontFamily: theme.typography.fonts.inter500Medium },
              ]}
            >
              Groceries, medicines, food, fashion and more from trusted local
              stores.
            </Text>
          </View>
          <GroceryBagIllustration />
        </View>
        {}
        <View style={styles.addressCard}>
          <View style={styles.addressLeft}>
            <View style={styles.addressIconBg}>
              <Ionicons name="location" size={18} color="#16A34A" />
            </View>
            <View style={styles.addressTexts}>
              <Text
                style={[
                  styles.addressLabel,
                  { fontFamily: theme.typography.fonts.inter500Medium },
                ]}
              >
                Deliver to
              </Text>
              <View style={styles.addressValueRow}>
                <Text
                  style={[
                    styles.addressValue,
                    { fontFamily: theme.typography.fonts.inter700Bold },
                  ]}
                >
                  Home
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color="#111827"
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
        {}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.catCard, { backgroundColor: cat.bg }]}
            >
              {cat.icon}
              <Text
                style={[
                  styles.catLabel,
                  { fontFamily: theme.typography.fonts.inter600SemiBold },
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {}
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <React.Fragment key={i}>
              <View style={styles.featureCol}>
                <View style={styles.featureIconWrap}>{f.icon}</View>
                <Text
                  style={[
                    styles.featureTitle,
                    { fontFamily: theme.typography.fonts.inter700Bold },
                  ]}
                >
                  {f.title}
                </Text>
                <Text
                  style={[
                    styles.featureDesc,
                    { fontFamily: theme.typography.fonts.inter500Medium },
                  ]}
                >
                  {f.desc}
                </Text>
              </View>
              {i < FEATURES.length - 1 && (
                <View style={styles.featureDivider} />
              )}
            </React.Fragment>
          ))}
        </View>
        {}
        <Pressable style={styles.ctaBtn} onPress={onGetStarted}>
          <Text
            style={[
              styles.ctaText,
              { fontFamily: theme.typography.fonts.inter700Bold },
            ]}
          >
            Get Started
          </Text>
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={20} color="#16A34A" />
          </View>
        </Pressable>
        {}
        <View style={styles.footerBadge}>
          <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
          <Text
            style={[
              styles.footerBadgeText,
              { fontFamily: theme.typography.fonts.inter500Medium },
            ]}
          >
            Your data is protected and encrypted
          </Text>
        </View>
        <View style={styles.footerLinks}>
          <Text
            style={[
              styles.footerLink,
              { fontFamily: theme.typography.fonts.inter500Medium },
            ]}
          >
            Terms of Service
          </Text>
          <View style={styles.footerDot} />
          <Text
            style={[
              styles.footerLink,
              { fontFamily: theme.typography.fonts.inter500Medium },
            ]}
          >
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
    paddingTop: 12,
    paddingBottom: 36,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  heroText: {
    flex: 1,
    paddingRight: 8,
  },
  heroHeading: {
    fontSize: 26,
    lineHeight: 32,
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
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  addressLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressTexts: {},
  addressLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  addressValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressValue: {
    fontSize: 16,
    color: "#111827",
  },
  catScroll: {
    paddingHorizontal: 24,
    paddingBottom: 4,
    gap: 12,
    marginBottom: 20,
  },
  catCard: {
    width: 76,
    height: 90,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  catLabel: {
    fontSize: 11,
    color: "#111827",
  },
  featuresCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  featureCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  featureTitle: {
    fontSize: 11,
    color: "#111827",
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 14,
  },
  featureDivider: {
    width: 1,
    height: "70%",
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
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
