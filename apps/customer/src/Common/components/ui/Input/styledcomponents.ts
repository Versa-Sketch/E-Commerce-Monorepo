import { StyleSheet, ViewStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  width: '100%',
};
export const inputStyle = {
  flex: 1,
  height: '100%' as const,
  paddingVertical: 0,
};
export const leftIconStyle: import('react-native').TextStyle = {
  marginRight: 8,
};
export const clearBtnStyle: ViewStyle = {
  padding: 4,
};
export const toggleBtnStyle: ViewStyle = {
  padding: 4,
  marginLeft: 4,
};
export const rightIconWrapperStyle: ViewStyle = {
  marginLeft: 8,
  justifyContent: 'center',
  alignItems: 'center',
};
