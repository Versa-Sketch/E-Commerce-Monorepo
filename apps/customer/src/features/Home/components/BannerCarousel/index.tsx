import React, { useEffect, useRef } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { HOME_BANNERS, BANNER_AUTOPLAY_INTERVAL, SCREEN_DIMENSIONS } from '../../Constants';
import { bannerCarouselStyles } from './styledcomponents';

const { width: SCREEN_WIDTH } = SCREEN_DIMENSIONS;

interface BannerCarouselProps {
  activeBannerIndex: number;
  onBannerIndexChange: (index: number) => void;
  isBannerDragging: React.MutableRefObject<boolean>;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  activeBannerIndex,
  onBannerIndexChange,
  isBannerDragging,
}) => {
  const { isDark } = useTheme();
  const bannerScrollRef = useRef<ScrollView>(null);

  // Auto-advance the banner carousel
  useEffect(() => {
    const timer = setInterval(() => {
      // Skip auto-play if user is dragging
      if (isBannerDragging.current) return;

      const nextIndex = (activeBannerIndex + 1) % HOME_BANNERS.length;
      bannerScrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      onBannerIndexChange(nextIndex);
    }, BANNER_AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [activeBannerIndex, onBannerIndexChange]);

  return (
    <View style={bannerCarouselStyles.bannerSection}>
      {/* Banner Carousel */}
      <ScrollView
        ref={bannerScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScrollBeginDrag={() => {
          isBannerDragging.current = true;
        }}
        onMomentumScrollEnd={(e) => {
          isBannerDragging.current = false;
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          onBannerIndexChange(index);
        }}
        scrollEventThrottle={16}
      >
        {HOME_BANNERS.map((uri, index) => (
          <View key={index} style={bannerCarouselStyles.bannerSlide}>
            <Image
              source={{ uri }}
              style={bannerCarouselStyles.bannerImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={bannerCarouselStyles.bannerDotsRow}>
        {HOME_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              bannerCarouselStyles.bannerDot,
              {
                backgroundColor:
                  index === activeBannerIndex
                    ? '#16A34A'
                    : isDark
                      ? 'rgba(255,255,255,0.25)'
                      : '#E5E7EB',
                width: index === activeBannerIndex ? 18 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;
