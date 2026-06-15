import { ViewStyle, TextStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  flex: 1,
  width: '100%',
  backgroundColor: '#F9FAFB', 
};
export const topHeaderRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 24,
  paddingTop: 16,
  paddingBottom: 8,
};
export const backBtnStyle: ViewStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E5E7EB', 
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.02,
  shadowRadius: 4,
  elevation: 1,
};
export const topActionsRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
};
export const circularActionBtnStyle: ViewStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E5E7EB', 
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.02,
  shadowRadius: 4,
  elevation: 1,
};
export const heroRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 24,
  marginTop: 12,
  marginBottom: 20,
};
export const heroLeftStyle: ViewStyle = {
  flex: 1,
  paddingRight: 8,
};
export const heroRightStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};
export const titleStyle: TextStyle = {
  fontSize: 28,
  lineHeight: 36,
  fontWeight: '800',
  color: '#111827', 
};
export const subtitleStyle: TextStyle = {
  fontSize: 13,
  lineHeight: 18,
  color: '#6B7280', 
  marginTop: 8,
};
export const phoneHighlightStyle: TextStyle = {
  fontWeight: '700',
  color: '#16A34A', 
};
export const loginCardStyle: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  borderWidth: 1,
  borderColor: '#E5E7EB', 
  marginHorizontal: 24,
  marginTop: 12,
  marginBottom: 20,
  padding: 20,
  shadowColor: '#16A34A', 
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.03,
  shadowRadius: 24,
  elevation: 3,
};
export const loginCardHeaderStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
};
export const phoneIconCircleStyle: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: '#ECFDF5', 
  justifyContent: 'center',
  alignItems: 'center',
};
export const loginHeaderTextsStyle: ViewStyle = {
  marginLeft: 12,
  flex: 1,
};
export const loginCardTitleStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '800',
  color: '#111827', 
};
export const loginCardSubtitleStyle: TextStyle = {
  fontSize: 12,
  color: '#6B7280', 
  marginTop: 2,
};
export const otpContainerStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 20,
};
export const otpBoxStyle: ViewStyle & TextStyle = {
  width: 54,
  height: 56,
  borderWidth: 1.5,
  borderRadius: 12,
  textAlign: 'center',
  fontSize: 22,
  backgroundColor: '#FFFFFF',
  borderColor: '#E5E7EB', 
  shadowColor: '#16A34A', 
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.02,
  shadowRadius: 8,
  elevation: 1,
};
export const actionRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
  paddingHorizontal: 2,
};
export const timerTextStyle: TextStyle = {
  fontSize: 12,
  color: '#6B7280', 
};
export const timerHighlightStyle: TextStyle = {
  color: '#16A34A',
  fontWeight: '700',
};
export const resendBtnTextStyle: TextStyle = {
  fontSize: 12,
  fontWeight: '700',
  color: '#16A34A', 
};
export const changeNumberTextStyle: TextStyle = {
  fontSize: 12,
  fontWeight: '700',
  color: '#16A34A', 
};
export const ctaBtnWrapperStyle: ViewStyle = {
  width: '100%',
  height: 54,
  borderRadius: 27,
  overflow: 'hidden',
  shadowColor: '#16A34A', 
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 3,
};
export const ctaButtonStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: 24,
  paddingRight: 6,
};
export const ctaTextStyle: TextStyle = {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '700',
};
export const ctaArrowCircleStyle: ViewStyle = {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
};
export const bottomBadgeRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
  marginBottom: 16,
};
export const bottomBadgeTextStyle: TextStyle = {
  fontSize: 12,
  color: '#16A34A', 
};
export const skylineWrapperStyle: ViewStyle = {
  width: '100%',
  height: 60,
  justifyContent: 'flex-end',
  marginTop: 'auto',
};
