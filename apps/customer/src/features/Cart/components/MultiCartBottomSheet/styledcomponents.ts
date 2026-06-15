import { ViewStyle, TextStyle } from 'react-native';

export const headerWrapperStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: 4,
  paddingBottom: 16,
  borderBottomWidth: 1,
};

export const titleStyle: TextStyle = {
  fontSize: 20,
  fontWeight: '800',
};

export const clearAllTextStyle: TextStyle = {
  fontSize: 13,
};

export const scrollViewStyle: ViewStyle = {
  paddingHorizontal: 20,
};

export const scrollContentStyle: ViewStyle = {
  paddingTop: 8,
  paddingBottom: 8,
};

export const emptyStateStyle: ViewStyle = {
  alignItems: 'center',
  paddingVertical: 40,
};

export const checkoutBtnStyle: ViewStyle = {
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 20,
  marginTop: 12,
};

export const checkoutTextStyle: TextStyle = {
  fontSize: 15,
};

export const handleIndicatorStyle: ViewStyle = {
  width: 40,
  height: 4,
};
