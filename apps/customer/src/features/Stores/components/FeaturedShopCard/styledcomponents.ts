import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
export const CARD_WIDTH = 260;
export const BANNER_HEIGHT = 140;
export const containerStyle: ViewStyle = {
  width: CARD_WIDTH,
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
export const ratingBadgeStyle: ViewStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 6,
};
export const ratingTextStyle: TextStyle = {
  fontSize: 12,
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
export const infoStyle: ViewStyle = {
  padding: 10,
};
export const titleRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
};
export const titleTextStyle: TextStyle = {
  fontSize: 14,
  flexShrink: 1,
};
export const subtitleTextStyle: TextStyle = {
  fontSize: 12,
  marginBottom: 4,
};
export const footerRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
};
export const metaTextStyle: TextStyle = {
  fontSize: 12,
};
export const dotStyle: TextStyle = {
  fontSize: 12,
  marginHorizontal: 6,
};
