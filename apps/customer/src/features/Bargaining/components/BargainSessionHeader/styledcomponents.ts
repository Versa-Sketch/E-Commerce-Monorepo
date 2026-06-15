import { TextStyle, ViewStyle } from 'react-native';

export const headerContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 0.5,
};

export const avatarStyle: ViewStyle = {
  marginLeft: 10,
};

export const titleBlockStyle: ViewStyle = {
  flex: 1,
  marginLeft: 10,
};

export const titleTextStyle: TextStyle = {
  marginBottom: 2,
};

export const statusRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const statusDotStyle: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  marginRight: 6,
};

export const endButtonStyle: ViewStyle = {
  marginLeft: 8,
  padding: 2,
};
