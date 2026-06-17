import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import { useNavigation } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function AnimatedScreen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const navigation = useNavigation();
  const isInitial = useRef(true);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (isInitial.current) {
        isInitial.current = false;
        return;
      }
      
      // Reset position to right (100) before animating in at full opacity
      translateX.setValue(100);

      Animated.spring(translateX, {
        toValue: 0,
        damping: 26,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }).start();
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      // Slide out left (-100) instantly or with a fast slide
      Animated.timing(translateX, {
        toValue: -100,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        // Reset to right position so it is ready for the next focus entrance
        translateX.setValue(100);
      });
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <Animated.View
      style={[
        styles.root,
        style,
        { transform: [{ translateX }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
});
