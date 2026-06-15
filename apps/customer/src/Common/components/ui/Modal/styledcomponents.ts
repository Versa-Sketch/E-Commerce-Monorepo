import { StyleSheet, ViewStyle } from 'react-native';
export const centerContainerStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
};
export const backdropStyle: ViewStyle = {
  ...StyleSheet.absoluteFill,
};
export const modalContentStyle: ViewStyle = {
  width: '100%',
  maxWidth: 340,
  elevation: 10,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  zIndex: 1,
};
export const headerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
};
export const closeBtnStyle: ViewStyle = {
  padding: 2,
};
export const bodyStyle: ViewStyle = {
  width: '100%',
};
