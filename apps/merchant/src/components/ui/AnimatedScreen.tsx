import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export function AnimatedScreen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.root, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
});

