import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const overlayContainer: ViewStyle = {
  flex: 1,
};

export const overlayHeader: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 12,
  borderBottomWidth: 1,
};

export const headerTitle: TextStyle = {
  fontSize: 18,
  fontWeight: '600',
};

export const closeButton: ViewStyle = {
  padding: 8,
  justifyContent: 'center',
  alignItems: 'center',
};

export const searchInputContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
};

export const searchInputStyle: TextStyle = {
  flex: 1,
  fontSize: 16,
  paddingVertical: 8,
};

export const resultsContainer: ViewStyle = {
  flex: 1,
};

export const resultItem: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
};

export const resultText: TextStyle = {
  fontSize: 14,
};

export const emptyStateContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const emptyStateText: TextStyle = {
  fontSize: 14,
  textAlign: 'center',
};

// Enhanced SearchOverlay Styles
export const searchOverlayStyles = StyleSheet.create({
  suggestionsContainer: {
    paddingTop: 28,
  },
  suggestionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
});
