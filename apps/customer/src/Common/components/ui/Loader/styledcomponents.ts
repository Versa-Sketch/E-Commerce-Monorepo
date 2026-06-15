import { StyleSheet, ViewStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 8,
};
export const fullscreenStyle: ViewStyle = {
  ...StyleSheet.absoluteFill,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};
