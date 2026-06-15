import { ViewStyle, TextStyle } from 'react-native';
export const toggleRowSectionStyle: ViewStyle = {
  paddingHorizontal: 20,
  marginTop: 8,
};
export const menuItemToggleStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 16,
  shadowColor: 'rgba(0, 60, 70, 0.03)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 2,
};
export const menuItemLeftStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
export const menuIconStyle: TextStyle = {
  marginRight: 12,
};
export const togglePressableStyle: ViewStyle = {
  width: 44,
  height: 24,
  borderRadius: 12,
  justifyContent: 'center',
};
export const toggleKnobStyle: ViewStyle = {
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
};
