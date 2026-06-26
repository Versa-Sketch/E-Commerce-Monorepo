import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const searchBarContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  borderRadius: 12,
  height: 44,
  marginHorizontal: 16,
  marginVertical: 12,
};

export const searchInputStyle: TextStyle = {
  flex: 1,
  fontSize: 14,
  marginHorizontal: 8,
};

// Enhanced SearchBar Styles
export const searchBarStyles = StyleSheet.create({
  // Search bar styles
  searchBarOuterWrapper: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  searchBarInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    paddingRight: 5,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingLeft: 4,
  },
  searchPlaceholderText: {
    position: 'absolute',
    left: 4,
    right: 0,
    fontSize: 14,
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
