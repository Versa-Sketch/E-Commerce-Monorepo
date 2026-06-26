import { StyleSheet } from 'react-native';

export const categoriesSectionStyles = StyleSheet.create({
  categoriesSection: {
    paddingVertical: 4,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    paddingBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    width: 68,
  },
  categoryImageContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryImageSelected: {
    borderColor: '#16A34A',
    borderWidth: 2,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 15,
    color: '#374151',
    paddingHorizontal: 2,
  },
  categoryUnderline: {
    position: 'absolute',
    left: 0,
    bottom: 2,
    height: 3,
    backgroundColor: '#16A34A',
    borderRadius: 1.5,
  },
  seeAllCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  seeAllLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});
