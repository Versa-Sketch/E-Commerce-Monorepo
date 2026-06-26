import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const bannerCarouselStyles = StyleSheet.create({
  bannerSection: {
    marginBottom: 12,
  },
  bannerSlide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 18,
  },
  bannerDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  bannerDot: {
    height: 6,
    borderRadius: 3,
  },
});
