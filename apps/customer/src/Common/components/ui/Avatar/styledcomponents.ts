import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
};
export const getInitialsStyle = (size: number, color: string): TextStyle => ({
  fontSize: size * 0.4,
  color,
  textAlign: 'center',
  fontWeight: '600',
});
