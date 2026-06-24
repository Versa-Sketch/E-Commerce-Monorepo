import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Colors } from '../colors';

export function GradientCard({
  colors,
  style,
  children,
}: {
  colors?: readonly [string, string];
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const [from] = colors ?? Colors.gradientPrimary;
  return (
    <View style={[{ backgroundColor: from, borderRadius: 24, overflow: 'hidden', margin: 20 }, style]}>
      {children}
    </View>
  );
}
