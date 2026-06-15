import { ViewStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 32,
  alignSelf: 'center',
};
export const iconFrameStyle: ViewStyle = {
  width: 96,
  height: 96,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
};
export const titleStyle = {
  textAlign: 'center' as const,
  marginBottom: 8,
};
export const descriptionStyle = {
  textAlign: 'center' as const,
  marginBottom: 24,
  maxWidth: 280,
};
export const actionButtonStyle: ViewStyle = {
  minWidth: 160,
};
