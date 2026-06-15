import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export const trayContainerStyle: ViewStyle = {
  paddingVertical: 10,
  borderBottomWidth: 0.5,
};

export const trayLabelRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  marginBottom: 8,
};

export const trayLabelTextStyle: TextStyle = {
  marginLeft: 6,
};

export const scrollContentStyle: ViewStyle = {
  paddingHorizontal: 16,
  gap: 10,
};

export const cardStyle: ViewStyle = {
  width: 220,
  borderWidth: 1,
  padding: 10,
};

export const cardHeaderRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
};

export const imageStyle: ImageStyle = {
  width: 36,
  height: 36,
  marginRight: 8,
};

export const itemDetailsStyle: ViewStyle = {
  flex: 1,
};

export const priceRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'baseline',
};

export const mrpTextStyle: TextStyle = {
  marginLeft: 6,
  textDecorationLine: 'line-through',
};

export const offerAmountTextStyle: TextStyle = {
  marginLeft: 6,
};

export const actionsRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 6,
};

export const actionButtonStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 0,
};

export const counterRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
};

export const counterInputWrapperStyle: ViewStyle = {
  flex: 1,
};

export const counterErrorTextStyle: TextStyle = {
  marginTop: 4,
};
