import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const categoriesBottomSheetStyles = StyleSheet.create({
  // Sheet Container
  customHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    position: 'relative',
    overflow: 'visible',
  },
  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  floatingCloseBtn: {
    position: 'absolute',
    top: -56,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  // Sheet Header
  sheetHeaderWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'left',
    marginTop: 10,
  },
  // Scroll View
  bottomSheetScrollView: {
    paddingHorizontal: 20,
  },
  bottomSheetScrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  // Grid Layout
  bottomSheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  // Category Card
  categoryCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryImageSelected: {
    borderColor: '#E11D48',
    borderWidth: 2,
  },
  bottomSheetImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomSheetText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  fallbackIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});
