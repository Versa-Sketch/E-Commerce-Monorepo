import { ViewStyle, TextStyle } from 'react-native';
export const formStyle: ViewStyle = {
  width: '100%',
  marginBottom: 24,
};
export const inputStyle: ViewStyle = {
  marginBottom: 16,
};
export const loginBtnStyle: ViewStyle = {
  marginTop: 16,
  height: 48,
  justifyContent: 'center',
};
export const otpContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginVertical: 24,
};
export const otpBox: ViewStyle & TextStyle = {
  width: 44,
  height: 48,
  borderWidth: 1.5,
  borderRadius: 8,
  textAlign: 'center',
  fontSize: 20,
};
export const helperRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
};
export const editLinkText: TextStyle = {
  fontSize: 13,
  textDecorationLine: 'underline',
};
export const timerContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 16,
};
export const timerText: TextStyle = {
  fontSize: 13,
};
