import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
export const BANNER_HEIGHT = 200;
export const containerStyle: ViewStyle = {
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
};
export const bannerStyle: ViewStyle = {
  width: '100%',
  height: BANNER_HEIGHT,
  justifyContent: 'center',
  alignItems: 'center',
};
export const bannerImageStyle: ImageStyle = {
  width: '100%',
  height: '100%',
};
export const categoryTagStyle: ViewStyle = {
  position: 'absolute',
  top: 10,
  left: 10,
  maxWidth: '70%',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 4,
};
export const categoryTagTextStyle: TextStyle = {
  fontSize: 12,
  color: '#FFFFFF',
};
export const closedOverlayStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
};
export const closedTextStyle: TextStyle = {
  fontSize: 12,
  letterSpacing: 1,
};
export const infoContainerStyle: ViewStyle = {
  padding: 14,
};
export const headerRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
};
export const titleColumnStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
  marginRight: 10,
};
export const titleRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
export const titleTextStyle: TextStyle = {
  fontSize: 20,
  flexShrink: 1,
};
export const ratingColumnStyle: ViewStyle = {
  alignItems: 'center',
  flexShrink: 0,
};
export const ratingBadgeStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 8,
  paddingHorizontal: 9,
  paddingVertical: 5,
};
export const ratingTextStyle: TextStyle = {
  fontSize: 13,
  fontWeight: '700',
};
export const reviewCountTextStyle: TextStyle = {
  fontSize: 11,
  marginTop: 4,
};
export const chipsRowStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
  gap: 6,
};
export const chipStyle: ViewStyle = {
  borderRadius: 8,
  paddingHorizontal: 9,
  paddingVertical: 4,
};
export const chipTextStyle: TextStyle = {
  fontSize: 11,
};
export const footerRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: 12,
  gap: 16,
};
export const footerItemStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
};
export const footerTextStyle: TextStyle = {
  fontSize: 13,
};
