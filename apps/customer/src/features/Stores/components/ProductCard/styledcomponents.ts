import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  flex: 1,
  borderWidth: 0,
  overflow: 'hidden',
  margin: 8,
};
export const imageFrameStyle: ViewStyle = {
  height: 175,
  width: '100%',
  backgroundColor: '#F0F4F4',
  position: 'relative',
  overflow: 'hidden',
};
export const productImageStyle: ImageStyle = {
  width: '100%',
  height: '100%',
};
export const discountTagStyle: ViewStyle = {
  position: 'absolute',
  top: 8,
  left: 8,
  paddingVertical: 2,
  paddingHorizontal: 6,
};
export const discountTextStyle: TextStyle = {
  color: '#FFFFFF',
  fontSize: 9,
  fontWeight: 'bold',
};
export const infoFrameStyle: ViewStyle = {
  justifyContent: 'space-between',
};
export const bargainBadgeStyle: ViewStyle = {
  paddingVertical: 4,
  paddingHorizontal: 6,
  marginBottom: 8,
  alignSelf: 'flex-start',
};
export const bargainBadgeTextStyle: TextStyle = {
  fontSize: 9.5,
};
export const priceContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
};
export const strikethroughPriceStyle: TextStyle = {
  textDecorationLine: 'line-through',
  fontSize: 12,
};
export const actionRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
};
export const actionBargainBtnStyle: ViewStyle = {
  flex: 1,
  height: 32,
  borderWidth: 1,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
};
export const actionBargainTextStyle: TextStyle = {
  fontSize: 11,
};
export const addButtonStyle: ViewStyle = {
  flex: 1,
  height: 32,
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
};
export const quantitySelectorStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  paddingHorizontal: 6,
};
export const qtyBtnStyle: ViewStyle = {
  padding: 2,
};
export const qtyTextStyle: TextStyle = {
  color: '#FFFFFF',
  fontSize: 12,
  marginHorizontal: 6,
};
