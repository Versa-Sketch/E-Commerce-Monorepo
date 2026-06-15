import { TextStyle, ViewStyle } from 'react-native';

export const rowStyle: ViewStyle = {
  flexDirection: 'row',
  marginVertical: 4,
  paddingHorizontal: 16,
};

export const columnStyle: ViewStyle = {
  flexDirection: 'column',
  flexShrink: 1,
  maxWidth: '82%',
};

export const bubbleStyle: ViewStyle = {
  flexShrink: 1,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 18,
};

export const senderNameStyle: TextStyle = {
  marginBottom: 2,
};

export const timestampStyle: TextStyle = {
  marginTop: 4,
};

export const timestampRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
};

export const tickIconStyle: TextStyle = {
  marginLeft: 4,
};

export const systemRowStyle: ViewStyle = {
  alignItems: 'center',
  marginVertical: 6,
  paddingHorizontal: 16,
};

export const systemPillStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  maxWidth: '90%',
};

export const systemPillIconStyle: TextStyle = {
  marginRight: 6,
};

export const offerCardStyle: ViewStyle = {
  borderRadius: 16,
  padding: 12,
};

export const offerLabelStyle: TextStyle = {
  marginBottom: 4,
};

export const offerAmountStyle: TextStyle = {
  marginBottom: 2,
};

export const offerItemNameStyle: TextStyle = {
  marginBottom: 8,
};

export const offerFooterStyle: ViewStyle = {
  marginTop: 4,
};

export const offerHeaderRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
};

export const offerIconWrapStyle: ViewStyle = {
  width: 28,
  height: 28,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
};

export const offerPriceRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
};

export const offerOriginalPriceStyle: TextStyle = {
  marginLeft: 6,
  textDecorationLine: 'line-through',
};
