import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
export const containerStyle: ViewStyle = {
  width: '100%',
  overflow: 'hidden',
  borderWidth: 0,
  marginBottom: 20,
};
export const imageContainerStyle: ViewStyle = {
  height: 160,
  width: '100%',
  position: 'relative',
  backgroundColor: '#F0F4F4',
};
export const coverImageStyle: ImageStyle = {
  width: '100%',
  height: '100%',
};
export const logoAvatarStyle: any = {
  position: 'absolute',
  bottom: -20,
  left: 16,
  width: 48,
  height: 48,
  borderRadius: 24,
  borderWidth: 2.5,
  zIndex: 10,
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.8,
  shadowRadius: 4,
  elevation: 3,
};
export const badgesWrapperStyle: ViewStyle = {
  position: 'absolute',
  top: 12,
  left: 12,
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: 10,
};
export const badgeStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 8,
  shadowColor: 'rgba(0, 0, 0, 0.05)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 4,
  elevation: 2,
};
export const statusDotStyle: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  marginRight: 4,
};
export const badgeTextStyle: TextStyle = {
  fontSize: 9,
  letterSpacing: 0.5,
};
export const starIconStyle: TextStyle = {
  marginRight: 4,
  marginTop: -2,
};
export const closedOverlayStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  justifyContent: 'center',
  alignItems: 'center',
};
export const closedTextStyle: TextStyle = {
  color: '#FFFFFF',
  fontSize: 16,
  letterSpacing: 1.5,
};
export const infoContainerStyle: ViewStyle = {
  width: '100%',
};
export const titleRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
};
export const ratingRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 12,
};
