import { ViewStyle } from 'react-native';
export const billSummaryStyle: ViewStyle = {
  padding: 16,
  marginBottom: 16,
  elevation: 3,
  shadowColor: 'rgba(0, 60, 70, 0.04)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 10,
};
export const billRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
};
export const dividerStyle: ViewStyle = {
  height: 1,
  marginVertical: 12,
};
export const grandTotalRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
