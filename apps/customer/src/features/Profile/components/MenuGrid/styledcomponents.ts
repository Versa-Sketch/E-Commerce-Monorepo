import { ViewStyle, TextStyle } from 'react-native';
export const menuGridContainerStyle: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  marginTop: 24,
};
export const gridItemCardStyle: ViewStyle = {
  width: '30%',
  aspectRatio: 1,
  borderRadius: 16,
  borderWidth: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 16,
  padding: 8,
  shadowColor: 'rgba(0, 60, 70, 0.03)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 2,
};
export const gridIconFrameStyle: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
};
export const gridItemLabelStyle: TextStyle = {
  fontSize: 11,
  textAlign: 'center',
};
