import { ViewStyle, TextStyle } from 'react-native';
export const storeGroupCardStyle: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  padding: 20,
  gap: 16,
  marginBottom: 20,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.06,
  shadowRadius: 32,
  elevation: 6,
};
export const storeGroupHeaderStyle: ViewStyle = {
  flexDirection: 'column',
  gap: 4,
};
export const storeTitleTextStyle: TextStyle = {
  marginLeft: 8,
};
export const headerBadgeRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
};
export const itemCountBadgeStyle: ViewStyle = {
  paddingVertical: 4,
  paddingHorizontal: 10,
};
export const deliveryBadgeStyle: ViewStyle = {
  paddingVertical: 4,
  paddingHorizontal: 10,
};
export const rowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
