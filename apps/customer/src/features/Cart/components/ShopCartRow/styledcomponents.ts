import { ViewStyle, TextStyle } from 'react-native';

export const rowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
};

export const avatarStyle: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
};

export const detailsStyle: ViewStyle = {
  flex: 1,
};

export const nameTextStyle: TextStyle = {
  marginBottom: 6,
};

export const viewCartBtnStyle: ViewStyle = {
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 6,
};

export const viewCartTextStyle: TextStyle = {
  fontSize: 13,
};

export const closeBtnStyle: ViewStyle = {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8,
};
