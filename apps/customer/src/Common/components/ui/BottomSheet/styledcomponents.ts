import { StyleSheet, ViewStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
};
export const backdropStyle: ViewStyle = {
  ...StyleSheet.absoluteFill,
};
export const sheetStyle: ViewStyle = {
  width: '100%',
  elevation: 15,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
};
export const handleContainerStyle: ViewStyle = {
  width: '100%',
  height: 24,
  justifyContent: 'center',
  alignItems: 'center',
};
export const handleBaseStyle: ViewStyle = {
  width: 48,
  height: 5,
  borderRadius: 3,
};
export const headerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: 12,
};
export const closeBtnStyle: ViewStyle = {
  padding: 2,
};
export const bodyStyle: ViewStyle = {
  flex: 1,
};
