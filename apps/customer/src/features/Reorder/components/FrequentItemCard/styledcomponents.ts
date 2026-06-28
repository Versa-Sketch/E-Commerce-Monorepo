import { ImageStyle, ViewStyle } from 'react-native';

export const cardStyle: ViewStyle = {
  width: 118,
  borderRadius: 12,
  borderWidth: 0.5,
  overflow: 'hidden',
  marginRight: 10,
};

export const imageContainerStyle: ViewStyle = {
  width: '100%',
  height: 76,
  backgroundColor: '#ECFDF5',
  alignItems: 'center',
  justifyContent: 'center',
};

export const imageStyle: ImageStyle = {
  width: '100%',
  height: '100%',
};

export const outOfStockBadgeStyle: ViewStyle = {
  position: 'absolute',
  top: 5,
  left: 5,
  backgroundColor: '#FEF2F2',
  borderRadius: 4,
  paddingHorizontal: 5,
  paddingVertical: 2,
};

export const inCartBadgeStyle: ViewStyle = {
  position: 'absolute',
  top: 5,
  right: 5,
  backgroundColor: '#16A34A',
  borderRadius: 8,
  paddingHorizontal: 5,
  paddingVertical: 2,
};

export const infoContainerStyle: ViewStyle = {
  padding: 8,
  paddingBottom: 4,
};

export const footerRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 8,
  paddingBottom: 8,
};

export const orderCountRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
};

export const disabledBtnStyle: ViewStyle = {
  width: 26,
  height: 26,
  borderRadius: 13,
  alignItems: 'center',
  justifyContent: 'center',
};

export const stepperStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#16A34A',
  borderRadius: 14,
  overflow: 'hidden',
};

export const stepperBtnStyle: ViewStyle = {
  paddingHorizontal: 8,
  paddingVertical: 4,
};

export const addBtnStyle: ViewStyle = {
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: '#16A34A',
  alignItems: 'center',
  justifyContent: 'center',
};
