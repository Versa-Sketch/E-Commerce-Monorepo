import { ViewStyle } from 'react-native';
import { Spacing } from '@/constants/theme';
export const headingStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing.two,
};
export const pressedHeadingStyle: ViewStyle = {
  opacity: 0.7,
};
export const buttonStyle: ViewStyle = {
  width: Spacing.four,
  height: Spacing.four,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
};
export const contentStyle: ViewStyle = {
  marginTop: Spacing.three,
  borderRadius: Spacing.three,
  marginLeft: Spacing.four,
  padding: Spacing.four,
};
