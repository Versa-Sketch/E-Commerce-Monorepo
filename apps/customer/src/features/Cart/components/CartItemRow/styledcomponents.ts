import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
export const cartItemRowStyle: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: 16,
  gap: 16,
};
export const itemImageStyle: ImageStyle = {
  width: 82,
  height: 82,
};
export const itemDetailsStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
  justifyContent: 'space-between',
};
export const priceRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
  gap: 8,
};
export const strikethroughPriceStyle: TextStyle = {
  fontSize: 13,
  textDecorationLine: 'line-through',
  fontFamily: 'Inter-Medium',
  fontWeight: '500',
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
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 10,
};
export const quantityBoxStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
  gap: 12,
};
export const qtyBtnStyle: ViewStyle = {
  padding: 2,
};
export const qtyTextStyle: TextStyle = {
  fontSize: 16,
  minWidth: 20,
  textAlign: 'center',
};
export const deleteBtnStyle: ViewStyle = {
  padding: 8,
};
