import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
export const cartItemRowStyle: ViewStyle = {
  flexDirection: 'row',
  padding: 12,
  gap: 12,
};
export const itemImageStyle: ImageStyle = {
  width: 56,
  height: 56,
};
export const itemDetailsStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
  justifyContent: 'center',
};
export const priceRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
  marginTop: 4,
  gap: 6,
};
export const strikethroughPriceStyle: TextStyle = {
  fontSize: 11,
  textDecorationLine: 'line-through',
};
export const bargainChipStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  marginTop: 6,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
};
export const actionBlockStyle: ViewStyle = {
  alignItems: 'flex-end',
  justifyContent: 'space-between',
};
export const quantityBoxStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 4,
};
export const qtyBtnStyle: ViewStyle = {
  padding: 2,
};
export const qtyTextStyle: TextStyle = {
  fontSize: 13,
  marginHorizontal: 8,
  minWidth: 14,
  textAlign: 'center',
};
export const deleteBtnStyle: ViewStyle = {
  padding: 4,
};
