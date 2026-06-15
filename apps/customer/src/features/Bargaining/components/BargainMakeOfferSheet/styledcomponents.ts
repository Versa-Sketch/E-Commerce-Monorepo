import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export const handleIndicatorStyle: ViewStyle = {
  width: 40,
  height: 4,
};

export const headerWrapperStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: 4,
  paddingBottom: 12,
  borderBottomWidth: 1,
};

export const titleStyle: TextStyle = {
  fontSize: 18,
};

export const scrollViewStyle: ViewStyle = {
  paddingHorizontal: 20,
};

export const scrollContentStyle: ViewStyle = {
  paddingTop: 12,
  paddingBottom: 24,
};

export const sectionLabelStyle: TextStyle = {
  marginBottom: 8,
};

export const itemListStyle: ViewStyle = {
  gap: 8,
  marginBottom: 16,
};

export const itemRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderWidth: 1,
};

export const itemImageStyle: ImageStyle = {
  width: 40,
  height: 40,
  marginRight: 10,
};

export const itemDetailsStyle: ViewStyle = {
  flex: 1,
};

export const itemPriceStyle: TextStyle = {
  marginTop: 2,
};

export const lockedBadgeStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  marginTop: 4,
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 8,
};

export const lockedBadgeIconStyle: TextStyle = {
  marginRight: 4,
};

export const lockedNoticeStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderRadius: 12,
  marginBottom: 16,
};

export const lockedNoticeIconStyle: TextStyle = {
  marginRight: 8,
};

export const amountRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginBottom: 12,
};

export const amountInputWrapperStyle: ViewStyle = {
  flex: 1,
};

export const currencyPrefixStyle: TextStyle = {
  marginRight: 4,
};

export const discountHintStyle: TextStyle = {
  minWidth: 80,
};

export const chipsRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 8,
  marginBottom: 16,
};

export const errorTextStyle: TextStyle = {
  marginBottom: 8,
};
