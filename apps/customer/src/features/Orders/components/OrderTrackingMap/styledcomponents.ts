import { ViewStyle, TextStyle } from 'react-native';
export const mapContainerStyle: ViewStyle = {
  height: 180,
  width: '100%',
  position: 'relative',
  borderWidth: 1.5,
  overflow: 'hidden',
  marginBottom: 16,
};
export const mapGridLineHorizontalStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 90,
  height: 1,
  borderStyle: 'dashed',
  borderWidth: 0.5,
  borderColor: 'rgba(0, 0, 0, 0.1)',
};
export const mapGridLineVerticalStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 160,
  width: 1,
  borderStyle: 'dashed',
  borderWidth: 0.5,
  borderColor: 'rgba(0, 0, 0, 0.1)',
};
export const pinStyle: ViewStyle = {
  position: 'absolute',
  alignItems: 'center',
};
export const storePinPositionStyle: ViewStyle = {
  top: 24,
  left: 36,
};
export const customerPinPositionStyle: ViewStyle = {
  bottom: 24,
  right: 36,
};
export const pinCircleStyle: ViewStyle = {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 3,
};
export const pinLabelStyle: TextStyle = {
  marginTop: 4,
  fontSize: 9,
};
export const radarPulseStyle: ViewStyle = {
  position: 'absolute',
  width: 48,
  height: 48,
  borderRadius: 24,
  top: -10,
};
export const routePathStyle: ViewStyle = {
  position: 'absolute',
  top: 38,
  left: 50,
  bottom: 38,
  right: 50,
  borderWidth: 2,
  borderStyle: 'dotted',
  borderRadius: 20,
  opacity: 0.4,
};
export const riderIconFrameStyle: ViewStyle = {
  position: 'absolute',
  width: 28,
  height: 28,
  borderRadius: 14,
  top: 90,
  left: 160,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 4,
};
