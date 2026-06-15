import { ViewStyle, TextStyle } from 'react-native';
export const storeGroupCardStyle: ViewStyle = {
  marginBottom: 16,
  overflow: 'hidden',
  elevation: 3,
  shadowColor: 'rgba(0, 60, 70, 0.04)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 10,
};
export const storeGroupHeaderStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 14,
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
