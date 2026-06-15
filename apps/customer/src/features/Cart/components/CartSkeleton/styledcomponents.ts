import { ViewStyle } from 'react-native';
export const cardStyle: ViewStyle = {
  padding: 14,
  marginBottom: 16,
  elevation: 3,
  shadowColor: 'rgba(0, 60, 70, 0.04)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 10,
};
export const cardHeaderRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 14,
};
export const itemRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginBottom: 14,
};
export const itemDetailsStyle: ViewStyle = {
  flex: 1,
  gap: 6,
};
export const billRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
};
export const totalRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 12,
};
