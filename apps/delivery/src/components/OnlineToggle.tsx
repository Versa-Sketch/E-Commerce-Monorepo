import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

interface Props {
  isOnline: boolean;
  onToggle: () => void;
}

export function OnlineToggle({ isOnline, onToggle }: Props) {
  const anim = useRef(new Animated.Value(isOnline ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOnline ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  const bg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CCCCCC', colors.black],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85} style={styles.wrap}>
      <Animated.View style={[styles.track, { backgroundColor: bg }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
      <Text style={[styles.label, { color: isOnline ? colors.green : colors.gray300 }]}>
        {isOnline ? 'Online' : 'Offline'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: {
    width: 52,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  label: { ...typography.body, fontWeight: '600' },
});
